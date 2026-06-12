import os
import secrets
import hashlib
import traceback
import sys
from datetime import datetime, timedelta, timezone
from typing import Optional, List
from pydantic import BaseModel, EmailStr
from fastapi import APIRouter, HTTPException, Query, status
from fastapi.responses import RedirectResponse
from passlib.context import CryptContext
from app.utils.supabase_logger import supabase

router = APIRouter()

# Initialize password context with bcrypt and fallback to pbkdf2_sha256 to avoid crashes on Windows
pwd_context = None
try:
    import bcrypt
    # Test if bcrypt actually works without segfaulting/throwing
    bcrypt.hashpw(b"test", bcrypt.gensalt())
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
except Exception as e:
    print(f"WARNING: bcrypt library is not fully functional ({str(e)}). Falling back to pure Python pbkdf2_sha256 context.")
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
async def create_share_link(req: ShareCreateRequest):
    # Log incoming request parameters
    print("--- [POST /api/share/create] LOG ---")
    print(f"Request: file_name={req.file_name}, storage_path={req.storage_path}, expiration={req.expiration}, download_limit={req.download_limit}")
    print(f"owner_id={req.owner_id}, user_email={req.user_email}")
    password_present = req.password is not None and len(req.password.strip()) > 0
    print(f"Password present: {password_present}")
    if password_present:
        print(f"Password length: {len(req.password.strip())}")
    
    # 1. Verify ownership of the file by checking the jobs table
    try:
        jobs_res = supabase.table("jobs").select("*").eq("user_email", req.user_email).eq("output_file", req.file_name).execute()
        if not jobs_res.data:
            print("LOG: Ownership verification failed.")
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Unauthorized: You do not own this audio file output."
            )
    except Exception as e:
        print("LOG: Ownership validation exception:")
        traceback.print_exc(file=sys.stdout)
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
            print("LOG: Attempting to hash password...")
            if pwd_context is not None:
                password_hash = pwd_context.hash(req.password.strip())
                print("LOG: Password hashed successfully using pwd_context.")
            else:
                raise RuntimeError("pwd_context is not initialized")
        except Exception as e:
            print(f"LOG: Password hashing failed: {str(e)}. Falling back to SHA-256.")
            traceback.print_exc(file=sys.stdout)
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
        print(f"LOG: Inserting share record for token {share_token}...")
        insert_res = supabase.table("shared_files").insert(record).execute()
        if not insert_res.data:
            print("LOG: Insert query returned no data.")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to record share link details."
            )
        print("LOG: Share creation successful.")
        return {
            "status": "success",
            "share_token": share_token,
            "expires_at": insert_res.data[0]["expires_at"]
        }
    except Exception as e:
        print("LOG: Insert query exception:")
        traceback.print_exc(file=sys.stdout)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Share creation query failure: {str(e)}"
        )

@router.get("/list")
async def list_shares(owner_id: str = Query(...)):
    try:
        res = supabase.table("shared_files").select("*").eq("owner_id", owner_id).order("created_at", desc=True).execute()
        return res.data or []
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error listing shared files: {str(e)}"
        )

@router.post("/disable/{token}")
async def disable_share(token: str, owner_id: str = Query(...)):
    try:
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
async def delete_share(token: str, owner_id: str = Query(...)):
    try:
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
async def get_share_info(token: str, body: Optional[PasswordVerifyRequest] = None):
    try:
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
            if not body or not body.password:
                return {
                    "status": "password_protected",
                    "is_password_protected": True,
                    "file_name": "Encrypted File"
                }
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
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect link password.")

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
async def download_shared_file(token: str, password: Optional[str] = Query(None)):
    try:
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
            if not password:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect or missing link password.")
            
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
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect or missing link password.")

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
