# ============================================================
# AgriLens Backend — Rate Limiting Middleware
# ============================================================
# Basic in-memory rate limiter to prevent brute-force attacks
# on authentication endpoints (/auth/login, /auth/register).
# ============================================================

import time
from collections import defaultdict
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from app.utils.exceptions import AgriLensException
from fastapi.responses import JSONResponse

class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, max_requests: int = 15, window_seconds: int = 60):
        super().__init__(app)
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests = defaultdict(list)

    async def dispatch(self, request: Request, call_next):
        path = request.url.path
        
        # Only rate limit auth POST endpoints
        if request.method == "POST" and path in ["/api/v1/auth/login", "/api/v1/auth/register"]:
            client_ip = request.client.host if request.client else "127.0.0.1"
            now = time.time()
            
            # Clean old timestamps
            self.requests[client_ip] = [
                ts for ts in self.requests[client_ip] if now - ts < self.window_seconds
            ]
            
            if len(self.requests[client_ip]) >= self.max_requests:
                return JSONResponse(
                    status_code=429,
                    content={
                        "success": False,
                        "message": "Too many requests. Please try again later.",
                        "data": None,
                    },
                )
            
            self.requests[client_ip].append(now)
            
        return await call_next(request)
