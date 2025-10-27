"""Main FastAPI application."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.endpoints import address, measurement, ai


# Create FastAPI app
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="AI-powered roofing estimation platform",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(address.router, prefix="/api/v1/address", tags=["Address"])
app.include_router(measurement.router, prefix="/api/v1/measurement", tags=["Measurement"])
app.include_router(ai.router, prefix="/api/v1/ai", tags=["AI"])


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "app": settings.app_name,
        "version": settings.app_version,
        "status": "operational",
        "docs": "/api/docs",
        "api_configured": {
            "google_maps": settings.has_google_maps_key,
            "openai": settings.has_openai_key
        }
    }


@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "app": settings.app_name,
        "version": settings.app_version
    }


@app.get("/api/config")
async def get_config():
    """Get public configuration."""
    return {
        "app_name": settings.app_name,
        "version": settings.app_version,
        "features": {
            "google_maps": settings.has_google_maps_key,
            "ai_analysis": settings.has_openai_key,
            "cost_estimation": True,
            "pdf_export": True
        },
        "pricing": {
            "material_cost_per_sqft": settings.default_material_cost,
            "labor_cost_per_sqft": settings.default_labor_cost
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
