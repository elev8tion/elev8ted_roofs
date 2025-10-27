"""Address geocoding endpoint."""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx
from app.core.config import settings


router = APIRouter()


class AddressRequest(BaseModel):
    address: str


class GeocodeResponse(BaseModel):
    address: str
    formatted_address: str
    latitude: float
    longitude: float
    success: bool
    error: str = None


@router.post("/geocode", response_model=GeocodeResponse)
async def geocode_address(request: AddressRequest):
    """
    Geocode an address to coordinates using Google Geocoding API.

    Args:
        request: Address to geocode

    Returns:
        Geocoded coordinates and formatted address
    """
    if not settings.has_google_maps_key:
        # Return mock data if API key not configured
        return GeocodeResponse(
            address=request.address,
            formatted_address=f"Mock: {request.address}",
            latitude=37.7749,
            longitude=-122.4194,
            success=False,
            error="Google Maps API key not configured. Please add your API key to .env file."
        )

    try:
        api_key = settings.google_geocoding_api_key or settings.google_maps_api_key
        url = "https://maps.googleapis.com/maps/api/geocode/json"

        async with httpx.AsyncClient() as client:
            response = await client.get(
                url,
                params={"address": request.address, "key": api_key}
            )
            data = response.json()

        if data["status"] == "OK" and len(data["results"]) > 0:
            result = data["results"][0]
            location = result["geometry"]["location"]

            return GeocodeResponse(
                address=request.address,
                formatted_address=result["formatted_address"],
                latitude=location["lat"],
                longitude=location["lng"],
                success=True
            )
        else:
            raise HTTPException(
                status_code=404,
                detail=f"Address not found: {data.get('status', 'Unknown error')}"
            )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Geocoding failed: {str(e)}")
