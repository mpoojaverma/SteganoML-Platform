import os
import secrets
import hashlib
import traceback
import sys
import time
import logging
from datetime import datetime, timedelta, timezone
from typing import Optional, List
from pydantic import BaseModel, EmailStr
from fastapi import APIRouter, HTTPException, Query, status, Request, Response
from fastapi.responses import RedirectResponse
from passlib.context import CryptContext
from app.utils.supabase_logger import supabase
from app.utils.auth import get_authenticated_user, validate_share_token, validate_uuid

router = APIRouter()
logger = logging.getLogger("uvicorn.error")

# Initialize password context with bcrypt and fallback to pbkdf2_sha256 to avoid crashes on Windows
pwd_context = None
try:
    import bcrypt
    # Test if bcrypt actually works without segfaulting/throwing
    bcrypt.hashpw(b"test", bcrypt.gensalt())
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
except Exception as e:
    logger.warning(f"bcrypt library is not fully functional ({str(e)}). Falling back to pure Python pbkdf2_sha256 context.")
    pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

class ShareCreateRequest(BaseModel):
    file_name: str
    storage_path: str
    expiration: str
    download_limit: str
    password: Optional[str] = None
    owner_id: str
    user_email: EmailStr

class PasswordVerifyRequest(BaseModel):
    password: Optional[str] = None

# InMemory store for failed password attempts: (ip + token) -> {"count": int, "lock_until": float, "last_updated": float}
failed_password_attempts = {}
MAX_FAILED_ATTEMPTS = 5
LOCKOUT_DURATION_SECONDS = 900  # 15 minutes

def prune_expired_lockouts():
    """Removes entries from failed_password_attempts that haven't been updated for over an hour."""
    now = time.time()
    expired = [k for k, v in failed_password_attempts.items() if now - v["last_updated"] > 3600]
    for k in expired:
        try:
            del failed_password_attempts[k]
        except KeyError:
            pass

def parse_expiration(exp_str: str) -> datetime:
    now = datetime.now(timezone.utc)
    if exp_str == "1 Hour":
        return now + timedelta(hours=1)
    elif exp_str == "24 Hours":
        return now + timedelta(days=1)
    elif exp_str == "7 Days":
        return now + timedelta(days=7)
    elif exp_str == "30 Days":
        return now + timedelta(days=30)
    else:
        return now + timedelta(days=1)

def parse_download_limit(limit_str: str) -> int:
    if limit_str == "Unlimited":
        return -1
    try:
        return int(limit_str)
    except ValueError:
        return 1

@router.post("/create", status_code=status.HTTP_201_CREATED)
async def create_share_link(req: ShareCreateRequest, request: Request):
    # P1: Enforce JWT authentication identity verification
    user = get_authenticated_user(request)
    
    # Overwrite payload attributes with verified JWT claims to prevent IDOR/BOLA
    req.owner_id = user["id"]
    req.user_email = user["email"]

    if req.password and len(req.password) > 128:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Password exceeds the maximum length of 128 characters.")

    password_present = req.password is not None and len(req.password.strip()) > 0
    
    # 1. Verify ownership of the file by checking the jobs table
    try:
        jobs_res = supabase.table("jobs").select("*").eq("user_email", req.user_email).eq("output_file", req.file_name).execute()
        if not jobs_res.data:
            logger.warning(f"Share creation warning: Ownership verification failed for file {req.file_name} under user {req.user_email}")
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Unauthorized: You do not own this audio file output."
            )
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database ownership validation error: {str(e)}"
        )

    # 2. Derive expiration time and download limit
    expires_at = parse_expiration(req.expiration)
    max_downloads = parse_download_limit(req.download_limit)

    # 3. Hash the optional password safely, falling back to SHA-256 if hashing fails
    password_hash = None
    if password_present:
        try:
            if pwd_context is not None:
                password_hash = pwd_context.hash(req.password.strip())
            else:
                raise RuntimeError("pwd_context is not initialized")
        except Exception as e:
            logger.error(f"Password hashing fallback triggered: {str(e)}")
            password_hash = f"sha256:{hashlib.sha256(req.password.strip().encode()).hexdigest()}"

    # 4. Generate high-entropy 32-character secure token (16 bytes)
    share_token = secrets.token_hex(16)

    # 5. Insert shared file record
    record = {
        "owner_id": req.owner_id,
        "file_name": req.file_name,
        "storage_path": req.storage_path,
        "share_token": share_token,
        "expires_at": expires_at.isoformat(),
        "max_downloads": max_downloads,
        "download_count": 0,
        "access_count": 0,
        "link_password_hash": password_hash,
        "status": "active"
    }

    try:
        insert_res = supabase.table("shared_files").insert(record).execute()
        if not insert_res.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to record share link details."
            )
        return {
            "status": "success",
            "share_token": share_token,
            "expires_at": insert_res.data[0]["expires_at"]
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Share creation query failure: {str(e)}"
        )

@router.get("/list")
async def list_shares(request: Request, owner_id: Optional[str] = Query(None)):
    try:
        # P1: Authenticate user via JWT to extract owner ID (prevent IDOR)
        user = get_authenticated_user(request)
        owner_id = user["id"]
        
        res = supabase.table("shared_files").select("*").eq("owner_id", owner_id).order("created_at", desc=True).execute()
        return res.data or []
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error listing shared files: {str(e)}"
        )

@router.post("/disable/{token}")
async def disable_share(token: str, request: Request, owner_id: Optional[str] = Query(None)):
    try:
        validate_share_token(token)
        # P1: Authenticate user via JWT to extract owner ID (prevent IDOR)
        user = get_authenticated_user(request)
        owner_id = user["id"]

        # Verify ownership
        res = supabase.table("shared_files").select("*").eq("share_token", token).eq("owner_id", owner_id).execute()
        if not res.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Share link not found or unauthorized access."
            )
        
        update_res = supabase.table("shared_files").update({"status": "disabled"}).eq("share_token", token).execute()
        return {"status": "success", "message": "Link disabled successfully."}
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error disabling share link: {str(e)}"
        )

@router.delete("/delete/{token}")
async def delete_share(token: str, request: Request, owner_id: Optional[str] = Query(None)):
    try:
        validate_share_token(token)
        # P1: Authenticate user via JWT to extract owner ID (prevent IDOR)
        user = get_authenticated_user(request)
        owner_id = user["id"]

        # Verify ownership
        res = supabase.table("shared_files").select("*").eq("share_token", token).eq("owner_id", owner_id).execute()
        if not res.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Share link not found or unauthorized access."
            )
        
        supabase.table("shared_files").delete().eq("share_token", token).execute()
        return {"status": "success", "message": "Link deleted successfully."}
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting share link: {str(e)}"
        )

@router.post("/info/{token}")
async def get_share_info(token: str, request: Request, response: Response, body: Optional[PasswordVerifyRequest] = None):
    try:
        validate_share_token(token)

        # Enforce Cache-Control response headers
        response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate"
        response.headers["Pragma"] = "no-cache"

        # Prune expired lockout logs to prevent memory leaks
        prune_expired_lockouts()

        res = supabase.table("shared_files").select("*").eq("share_token", token).execute()
        if not res.data:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Secure link not found.")
        
        record = res.data[0]
        now = datetime.now(timezone.utc)
        expires_at = datetime.fromisoformat(record["expires_at"].replace("Z", "+00:00"))

        # Expiry checks
        if record["status"] == "expired" or expires_at < now:
            if record["status"] != "expired":
                supabase.table("shared_files").update({"status": "expired"}).eq("share_token", token).execute()
            raise HTTPException(status_code=status.HTTP_410_GONE, detail="This secure share link has expired.")

        # Status disabled checks
        if record["status"] == "disabled":
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="This secure share link has been disabled.")

        # Download limits checks
        if record["status"] == "download_limit_reached" or (record["max_downloads"] != -1 and record["download_count"] >= record["max_downloads"]):
            if record["status"] != "download_limit_reached":
                supabase.table("shared_files").update({"status": "download_limit_reached"}).eq("share_token", token).execute()
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Download limit reached for this share link.")

        # Password required checks
        is_password_protected = record["link_password_hash"] is not None
        if is_password_protected:
            client_ip = request.client.host if request.client else "unknown"
            lockout_key = f"{client_ip}_{token}"
            current_time = time.time()
            
            # Check lockout state
            lock_info = failed_password_attempts.get(lockout_key)
            if lock_info and lock_info["lock_until"] > current_time:
                remaining = int(lock_info["lock_until"] - current_time)
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail=f"Too many failed password attempts. Access locked for {remaining} seconds."
                )

            if not body or not body.password:
                return {
                    "status": "password_protected",
                    "is_password_protected": True,
                    "file_name": "Encrypted File"
                }

            # Enforce parameter length limits
            if len(body.password) > 128:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Password exceeds the maximum length of 128 characters.")

            # Verify password with fallback support
            pwd_hash = record["link_password_hash"]
            is_valid = False
            if pwd_hash.startswith("sha256:"):
                raw_hash = pwd_hash.split(":", 1)[1]
                is_valid = hashlib.sha256(body.password.strip().encode()).hexdigest() == raw_hash
            else:
                try:
                    is_valid = pwd_context.verify(body.password, pwd_hash)
                except Exception:
                    is_valid = hashlib.sha256(body.password.strip().encode()).hexdigest() == pwd_hash
            
            if not is_valid:
                # Increment failed attempts count
                if lockout_key not in failed_password_attempts:
                    failed_password_attempts[lockout_key] = {"count": 0, "lock_until": 0.0, "last_updated": current_time}
                
                failed_password_attempts[lockout_key]["count"] += 1
                failed_password_attempts[lockout_key]["last_updated"] = current_time
                
                count = failed_password_attempts[lockout_key]["count"]
                
                # Apply progressive delay
                if count == 3:
                    time.sleep(2.0)
                elif count == 4:
                    time.sleep(5.0)
                elif count >= MAX_FAILED_ATTEMPTS:
                    failed_password_attempts[lockout_key]["lock_until"] = current_time + LOCKOUT_DURATION_SECONDS
                    failed_password_attempts[lockout_key]["count"] = 0
                    raise HTTPException(
                        status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                        detail="Too many failed password attempts. Access locked for 15 minutes."
                    )
                
                attempts_left = MAX_FAILED_ATTEMPTS - count
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail=f"Incorrect link password. {attempts_left} attempts remaining."
                )

            # Password is valid, reset lockout state
            if lockout_key in failed_password_attempts:
                del failed_password_attempts[lockout_key]

        # Increment access count (page views)
        supabase.table("shared_files").update({
            "access_count": record["access_count"] + 1,
            "last_accessed_at": now.isoformat()
        }).eq("share_token", token).execute()

        downloads_remaining = (record["max_downloads"] - record["download_count"]) if record["max_downloads"] != -1 else "Unlimited"

        return {
            "status": "active",
            "is_password_protected": is_password_protected,
            "file_name": record["file_name"],
            "created_at": record["created_at"],
            "expires_at": record["expires_at"],
            "downloads_remaining": downloads_remaining,
            "access_count": record["access_count"] + 1
        }
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error checking link status: {str(e)}"
        )

@router.get("/download/{token}")
async def download_shared_file(token: str, request: Request, response: Response, password: Optional[str] = Query(None)):
    try:
        validate_share_token(token)

        # Enforce Cache-Control response headers
        response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate"
        response.headers["Pragma"] = "no-cache"

        # Prune expired lockout logs
        prune_expired_lockouts()

        res = supabase.table("shared_files").select("*").eq("share_token", token).execute()
        if not res.data:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Secure link not found.")
        
        record = res.data[0]
        now = datetime.now(timezone.utc)
        expires_at = datetime.fromisoformat(record["expires_at"].replace("Z", "+00:00"))

        # Expiry checks
        if record["status"] == "expired" or expires_at < now:
            if record["status"] != "expired":
                supabase.table("shared_files").update({"status": "expired"}).eq("share_token", token).execute()
            raise HTTPException(status_code=status.HTTP_410_GONE, detail="This secure share link has expired.")

        # Status checks
        if record["status"] == "disabled":
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="This secure share link has been disabled.")

        # Download limits checks
        if record["status"] == "download_limit_reached" or (record["max_downloads"] != -1 and record["download_count"] >= record["max_downloads"]):
            if record["status"] != "download_limit_reached":
                supabase.table("shared_files").update({"status": "download_limit_reached"}).eq("share_token", token).execute()
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Download limit reached for this share link.")

        # Password required checks with fallback support
        if record["link_password_hash"] is not None:
            client_ip = request.client.host if request.client else "unknown"
            lockout_key = f"{client_ip}_{token}"
            current_time = time.time()
            
            # Check lockout status
            lock_info = failed_password_attempts.get(lockout_key)
            if lock_info and lock_info["lock_until"] > current_time:
                remaining = int(lock_info["lock_until"] - current_time)
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail=f"Too many failed password attempts. Access locked for {remaining} seconds."
                )

            if not password:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect or missing link password.")
            
            # Enforce parameter length limits
            if len(password) > 128:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Password exceeds the maximum length of 128 characters.")

            pwd_hash = record["link_password_hash"]
            is_valid = False
            if pwd_hash.startswith("sha256:"):
                raw_hash = pwd_hash.split(":", 1)[1]
                is_valid = hashlib.sha256(password.strip().encode()).hexdigest() == raw_hash
            else:
                try:
                    is_valid = pwd_context.verify(password, pwd_hash)
                except Exception:
                    is_valid = hashlib.sha256(password.strip().encode()).hexdigest() == pwd_hash
            
            if not is_valid:
                # Increment failed attempts count
                if lockout_key not in failed_password_attempts:
                    failed_password_attempts[lockout_key] = {"count": 0, "lock_until": 0.0, "last_updated": current_time}
                
                failed_password_attempts[lockout_key]["count"] += 1
                failed_password_attempts[lockout_key]["last_updated"] = current_time
                
                count = failed_password_attempts[lockout_key]["count"]
                
                # Apply progressive delay
                if count == 3:
                    time.sleep(2.0)
                elif count == 4:
                    time.sleep(5.0)
                elif count >= MAX_FAILED_ATTEMPTS:
                    failed_password_attempts[lockout_key]["lock_until"] = current_time + LOCKOUT_DURATION_SECONDS
                    failed_password_attempts[lockout_key]["count"] = 0
                    raise HTTPException(
                        status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                        detail="Too many failed password attempts. Access locked for 15 minutes."
                    )
                
                attempts_left = MAX_FAILED_ATTEMPTS - count
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail=f"Incorrect or missing link password. {attempts_left} attempts remaining."
                )

            # Password is valid, reset lockout state
            if lockout_key in failed_password_attempts:
                del failed_password_attempts[lockout_key]

        # Increment download count
        new_download_count = record["download_count"] + 1
        new_status = record["status"]
        if record["max_downloads"] != -1 and new_download_count >= record["max_downloads"]:
            new_status = "download_limit_reached"

        supabase.table("shared_files").update({
            "download_count": new_download_count,
            "status": new_status,
            "last_accessed_at": now.isoformat()
        }).eq("share_token", token).execute()

        # Generate temporary signed Supabase Storage URL (expires in 60 seconds)
        signed_res = supabase.storage.from_("audio-files").create_signed_url(record["storage_path"], 60)
        
        signed_url = None
        if isinstance(signed_res, dict):
            signed_url = signed_res.get("signedURL") or signed_res.get("signedUrl")
        else:
            signed_url = getattr(signed_res, "signed_url", None) or getattr(signed_res, "signedUrl", None) or signed_res

        if not signed_url:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Could not generate secure storage signed URL."
            )

        return RedirectResponse(url=signed_url, status_code=status.HTTP_307_TEMPORARY_REDIRECT)

    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing secure download: {str(e)}"
        )
