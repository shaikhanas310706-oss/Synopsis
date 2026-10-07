import os
import sys
from pathlib import Path
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

# Ensure server directory is in sys.path for direct imports
SERVER_DIR = Path(__file__).resolve().parent
if str(SERVER_DIR) not in sys.path:
    sys.path.insert(0, str(SERVER_DIR))

from data.store import init_store
from routes.api import router as api_router

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize JSON file-backed database store
    init_store()
    yield

app = FastAPI(
    title="SynapseIQ AI Adaptive Learning Engine",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS middleware to allow client access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    response = await call_next(request)
    print(f"[{request.method}] {request.url.path} -> {response.status_code}")
    return response

# Root greeting
@app.get("/")
def root():
    return {
        "name": "SynapseIQ AI Adaptive Learning Engine",
        "version": "1.0.0",
        "docs": "/api/health"
    }

# Register API Router
app.include_router(api_router)

# Global unhandled error handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print(f"Server Unhandled Error: {exc}")
    return JSONResponse(
        status_code=500,
        content={"error": "Internal Server Error", "message": str(exc)}
    )

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 5000))
    print(f"[SERVER] SynapseIQ Adaptive Server (FastAPI) running on http://localhost:{port}")
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
