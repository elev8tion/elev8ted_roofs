"""AI-powered roof analysis endpoints."""
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, Dict, Any
from app.services.ai_service import ai_service


router = APIRouter()


class AIAnalysisRequest(BaseModel):
    address: str
    area_sq_ft: float
    pitch_degrees: float
    user_notes: Optional[str] = None


class DamageDetectionRequest(BaseModel):
    image_description: str
    area_sq_ft: float


class AIAnalysisResponse(BaseModel):
    success: bool
    complexity_rating: Optional[int] = None
    recommendations: Optional[list] = None
    material_suggestions: Optional[list] = None
    timeline_estimate: Optional[int] = None
    considerations: Optional[list] = None
    confidence: float = 0.0
    error: Optional[str] = None


@router.post("/analyze", response_model=Dict[str, Any])
async def analyze_roof(request: AIAnalysisRequest):
    """
    Get AI-powered insights and recommendations for a roof estimate.

    Args:
        request: Address and roof measurements

    Returns:
        AI-generated recommendations and insights
    """
    result = await ai_service.analyze_roof_description(
        address=request.address,
        area_sq_ft=request.area_sq_ft,
        pitch_degrees=request.pitch_degrees,
        user_notes=request.user_notes
    )

    return result


@router.post("/detect-damage")
async def detect_damage(request: DamageDetectionRequest):
    """
    Analyze roof condition description for potential damage.

    Args:
        request: Roof condition description

    Returns:
        Damage assessment
    """
    result = await ai_service.detect_roof_damage(
        image_description=request.image_description,
        area_sq_ft=request.area_sq_ft
    )

    return result


@router.get("/status")
async def ai_status():
    """
    Check AI service configuration status.

    Returns:
        AI service status and model info
    """
    from app.core.config import settings

    return {
        "configured": ai_service.is_configured(),
        "model": settings.openai_model if ai_service.is_configured() else "not configured",
        "features": {
            "roof_analysis": ai_service.is_configured(),
            "damage_detection": ai_service.is_configured(),
            "cost_optimization": ai_service.is_configured()
        },
        "message": "AI service ready" if ai_service.is_configured() else "Configure OpenAI API key to enable AI features"
    }
