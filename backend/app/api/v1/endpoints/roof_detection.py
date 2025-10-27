"""AI-powered roof detection endpoint using OpenAI Vision."""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict
import json
from openai import OpenAI
from app.core.config import settings


router = APIRouter()


class RoofDetectionRequest(BaseModel):
    image_base64: str
    latitude: float
    longitude: float
    image_width: int = 800
    image_height: int = 600


class Point(BaseModel):
    x: float
    y: float


class RoofDetectionResponse(BaseModel):
    success: bool
    points: List[Point] = []
    confidence: float = 0.0
    roof_type: str = "unknown"
    error: str = None
    message: str = None


@router.post("/detect", response_model=RoofDetectionResponse)
async def detect_roof(request: RoofDetectionRequest):
    """
    Use OpenAI Vision API to automatically detect roof outline from satellite image.

    Args:
        request: Satellite image (base64) and coordinates

    Returns:
        Detected roof polygon points that can be drawn on canvas
    """
    if not settings.has_openai_key:
        return RoofDetectionResponse(
            success=False,
            error="OpenAI API key not configured",
            message="Configure OpenAI API key to enable AI roof detection"
        )

    try:
        client = OpenAI(api_key=settings.openai_api_key)

        # Prepare prompt for Vision API
        prompt = f"""Analyze this satellite/aerial image of a property and detect the main roof structure.

Image dimensions: {request.image_width}x{request.image_height} pixels
Location: {request.latitude}, {request.longitude}

Your task:
1. Identify the PRIMARY roof structure (the main building)
2. Determine the roof outline polygon corners
3. Return corner coordinates as pixel positions (x, y) relative to image dimensions

Return a JSON response with this exact format:
{{
  "points": [
    {{"x": 100, "y": 150}},
    {{"x": 700, "y": 150}},
    {{"x": 700, "y": 450}},
    {{"x": 100, "y": 450}}
  ],
  "confidence": 0.85,
  "roof_type": "rectangular"
}}

Guidelines:
- Provide 4-8 corner points tracing the roof perimeter
- Points should be in clockwise order
- Use actual pixel coordinates within the image bounds
- roof_type can be: "rectangular", "L-shaped", "complex", "hip", "gable"
- confidence: 0-1 score of detection certainty"""

        # Call OpenAI Vision API
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": request.image_base64,
                                "detail": "high"
                            }
                        }
                    ]
                }
            ],
            response_format={"type": "json_object"},
            max_tokens=500
        )

        # Parse response
        result = json.loads(response.choices[0].message.content)

        # Convert to Point objects
        points = [Point(**p) for p in result.get("points", [])]

        if len(points) < 3:
            return RoofDetectionResponse(
                success=False,
                error="Could not detect roof outline",
                message="AI could not identify a clear roof structure. Please draw manually."
            )

        return RoofDetectionResponse(
            success=True,
            points=points,
            confidence=result.get("confidence", 0.0),
            roof_type=result.get("roof_type", "unknown"),
            message=f"Detected {result.get('roof_type', 'roof')} with {len(points)} corners"
        )

    except Exception as e:
        return RoofDetectionResponse(
            success=False,
            error=f"AI detection failed: {str(e)}",
            message="Please draw roof outline manually"
        )
