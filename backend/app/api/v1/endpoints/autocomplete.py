"""Address autocomplete endpoint using Google Places API."""
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List
import httpx
from app.core.config import settings


router = APIRouter()


class AddressSuggestion(BaseModel):
    description: str
    place_id: str


class AutocompleteResponse(BaseModel):
    suggestions: List[AddressSuggestion]
    success: bool
    error: str = None


@router.get("/suggestions", response_model=AutocompleteResponse)
async def get_address_suggestions(
    input: str = Query(..., description="User's partial address input"),
    types: str = Query("address", description="Type of place to search for")
):
    """
    Get address suggestions using Google Places Autocomplete API.

    Args:
        input: Partial address string from user
        types: Place types to search (default: address)

    Returns:
        List of address suggestions with place IDs
    """
    if not settings.has_google_maps_key:
        return AutocompleteResponse(
            suggestions=[],
            success=False,
            error="Google Maps API key not configured"
        )

    if not input or len(input) < 3:
        return AutocompleteResponse(
            suggestions=[],
            success=True
        )

    try:
        # Build Google Places Autocomplete API URL
        base_url = "https://maps.googleapis.com/maps/api/place/autocomplete/json"

        params = {
            "input": input,
            "types": types,
            "key": settings.google_maps_api_key,
            "components": "country:us"  # Restrict to US addresses
        }

        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(base_url, params=params)
            response.raise_for_status()
            data = response.json()

            if data.get("status") == "REQUEST_DENIED":
                return AutocompleteResponse(
                    suggestions=[],
                    success=False,
                    error="Google Places API not enabled. Enable it at: https://console.cloud.google.com/apis/library/places-backend.googleapis.com"
                )

            suggestions = []
            for prediction in data.get("predictions", []):
                suggestions.append(AddressSuggestion(
                    description=prediction["description"],
                    place_id=prediction["place_id"]
                ))

            return AutocompleteResponse(
                suggestions=suggestions,
                success=True
            )

    except Exception as e:
        return AutocompleteResponse(
            suggestions=[],
            success=False,
            error=f"Failed to fetch suggestions: {str(e)}"
        )
