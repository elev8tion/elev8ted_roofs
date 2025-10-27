"""Satellite imagery endpoint."""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import base64
import httpx
from app.core.config import settings


router = APIRouter()


class SatelliteRequest(BaseModel):
    latitude: float
    longitude: float
    zoom: int = 20
    width: int = 800
    height: int = 600


class SatelliteResponse(BaseModel):
    image_url: str
    image_base64: str = None
    success: bool
    error: str = None


@router.post("/image", response_model=SatelliteResponse)
async def fetch_satellite_image(request: SatelliteRequest):
    """
    Fetch satellite imagery from Google Maps Static API.

    Args:
        request: Latitude, longitude, and image dimensions

    Returns:
        Satellite image URL or base64 encoded image
    """
    if not settings.has_google_maps_key:
        return SatelliteResponse(
            image_url="",
            success=False,
            error="Google Maps API key not configured"
        )

    try:
        # Build Google Maps Static API URL
        api_key = settings.google_maps_api_key
        base_url = "https://maps.googleapis.com/maps/api/staticmap"

        params = {
            "center": f"{request.latitude},{request.longitude}",
            "zoom": request.zoom,
            "size": f"{request.width}x{request.height}",
            "maptype": "satellite",
            "key": api_key
        }

        image_url = f"{base_url}?" + "&".join([f"{k}={v}" for k, v in params.items()])

        # Fetch the image
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(image_url)

            if response.status_code == 403:
                # API key issue - return helpful error
                return SatelliteResponse(
                    image_url="",
                    success=False,
                    error="Google Maps Static API is not enabled. Please enable it in Google Cloud Console: https://console.cloud.google.com/apis/library/static-maps-backend.googleapis.com"
                )

            response.raise_for_status()

            # Encode as base64 for embedding
            image_base64 = base64.b64encode(response.content).decode('utf-8')

        return SatelliteResponse(
            image_url=image_url,
            image_base64=image_base64,
            success=True
        )

    except httpx.HTTPStatusError as e:
        return SatelliteResponse(
            image_url="",
            success=False,
            error=f"Google Maps API error: {e.response.status_code}. Check API key and billing settings."
        )
    except Exception as e:
        return SatelliteResponse(
            image_url="",
            success=False,
            error=f"Failed to fetch satellite image: {str(e)}"
        )
