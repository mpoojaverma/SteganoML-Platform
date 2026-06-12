import time
from collections import defaultdict
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse

class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, requests_per_minute: int = 30):
        super().__init__(app)
        self.requests_per_minute = requests_per_minute
        # Dict to store client IP -> list of request timestamps
        self.request_history = defaultdict(list)

    async def dispatch(self, request: Request, call_next):
        path = request.url.path
        
        # Only apply rate limiting to sensitive endpoints
        sensitive_prefixes = [
            "/api/encode",
            "/api/decode",
            "/api/share/create",
            "/api/share/info",
            "/api/share/download"
        ]
        
        is_sensitive = any(path.startswith(prefix) for prefix in sensitive_prefixes)
        if not is_sensitive:
            return await call_next(request)

        # Retrieve client IP address (fallback to unknown if not present)
        client_ip = request.client.host if request.client else "unknown"
        now = time.time()
        
        # Filter out timestamps older than 60 seconds
        self.request_history[client_ip] = [
            t for t in self.request_history[client_ip]
            if now - t < 60
        ]
        
        if len(self.request_history[client_ip]) >= self.requests_per_minute:
            return JSONResponse(
                status_code=429,
                content={
                    "detail": "Too many requests. Rate limit exceeded. Please try again in a minute."
                }
            )
            
        self.request_history[client_ip].append(now)
        return await call_next(request)
