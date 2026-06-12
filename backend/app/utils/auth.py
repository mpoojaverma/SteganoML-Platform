import os
import re
import uuid
import base64
import json
import time
from fastapi import Request, HTTPException, status
from app.utils.supabase_logger import supabase

def validate_uuid(val: str) -> str:
    if not val:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="UUID parameter is missing or empty."
        )
    try:
        uuid_obj = uuid.UUID(val)
        return str(uuid_obj)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid UUID format."
        )

def validate_email(val: str) -> str:
    if not val:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email parameter is missing or empty."
        )
    try:
        from pydantic import EmailStr, BaseModel
        class EmailModel(BaseModel):
            email: EmailStr
        return EmailModel(email=val).email
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email format."
        )

def validate_share_token(token: str) -> str:
    if not token or not isinstance(token, str):
        raise HTTPException(status_code=400, detail="Invalid secure token.")
    if not re.match(r"^[0-9a-fA-F]{32}$", token):
        raise HTTPException(status_code=400, detail="Invalid secure token format.")
    return token

def parse_and_validate_jwt_claims(token: str) -> dict:
    """
    Decodes the JWT payload locally and validates standard claims (exp, aud, sub).
    Signature verification is bypassed locally (handled by Supabase API next).
    """
    try:
        parts = token.split(".")
        if len(parts) != 3:
            raise ValueError("JWT must contain 3 dot-separated parts.")
        
        payload_b64 = parts[1]
        # Pad payload for base64 decoding if necessary
        padded_payload = payload_b64 + "=" * (4 - len(payload_b64) % 4)
        payload_bytes = base64.urlsafe_b64decode(padded_payload)
        claims = json.loads(payload_bytes.decode("utf-8"))
        
        # Validate expiration
        exp = claims.get("exp")
        if exp and exp < time.time():
            raise ValueError("Token signature validation failed: token has expired.")
            
        # Validate audience (Supabase auth tokens default to 'authenticated')
        aud = claims.get("aud")
        if not aud or aud != "authenticated":
            raise ValueError("Invalid audience claim.")
            
        # Validate subject (User ID)
        sub = claims.get("sub")
        if not sub:
            raise ValueError("Subject claim is missing.")
            
        return claims
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication failed: {str(e)}"
        )

def get_authenticated_user(request: Request) -> dict:
    """
    Retrieves and validates JWT claims locally, then verifies the session with Supabase.
    """
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required: Authorization header is missing."
        )
    
    parts = auth_header.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header must follow 'Bearer <token>' format."
        )
    
    token = parts[1]
    
    # 1. Perform local claims checks (expiry, audience, sub) to shield Supabase API
    claims = parse_and_validate_jwt_claims(token)
    
    # 2. Call Supabase GoTrue API to verify token signature and get full user model
    try:
        response = supabase.auth.get_user(token)
        if not response or not response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired session token."
            )
        user = response.user
        return {
            "id": user.id,
            "email": user.email
        }
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication session verification failed: {str(e)}"
        )

def get_optional_authenticated_user(request: Request) -> dict:
    """
    Extracts and validates user if Authorization header is present, otherwise returns None.
    """
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return None
    return get_authenticated_user(request)
