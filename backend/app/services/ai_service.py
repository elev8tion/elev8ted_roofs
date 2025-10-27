"""AI service for roof analysis and cost estimation using OpenAI."""
from typing import Optional, Dict
import json
from openai import OpenAI
from app.core.config import settings


class AIService:
    """Service for AI-powered roof analysis."""

    def __init__(self):
        """Initialize AI service with OpenAI client."""
        self.client = None
        if settings.has_openai_key:
            self.client = OpenAI(api_key=settings.openai_api_key)

    def is_configured(self) -> bool:
        """Check if AI service is properly configured."""
        return self.client is not None

    async def analyze_roof_description(
        self,
        address: str,
        area_sq_ft: float,
        pitch_degrees: float,
        user_notes: Optional[str] = None
    ) -> Dict[str, any]:
        """
        Use AI to provide additional insights about the roof estimate.

        Args:
            address: Property address
            area_sq_ft: Calculated roof area
            pitch_degrees: Estimated pitch
            user_notes: Optional user-provided notes or observations

        Returns:
            AI-generated insights and recommendations
        """
        if not self.is_configured():
            return {
                "success": False,
                "error": "OpenAI API key not configured",
                "recommendations": ["Configure OpenAI API key to enable AI insights"],
                "confidence": 0.0
            }

        try:
            prompt = f"""You are a roofing expert AI assistant for Elev8ted Roofs. Analyze this roof estimate and provide insights:

Address: {address}
Roof Area: {area_sq_ft:.2f} sq ft
Estimated Pitch: {pitch_degrees}°
{"User Notes: " + user_notes if user_notes else ""}

Provide a JSON response with:
1. "complexity_rating": Rate the job complexity (1-10)
2. "recommendations": List of 3-5 specific recommendations for this roof
3. "material_suggestions": Suggested roofing materials for this property
4. "timeline_estimate": Estimated project duration in days
5. "considerations": Important factors to consider
6. "confidence": Your confidence in this estimate (0-1)

Keep recommendations practical and specific to the roof size and pitch."""

            response = self.client.chat.completions.create(
                model=settings.openai_model,
                messages=[
                    {"role": "system", "content": "You are an expert roofing consultant providing detailed, accurate estimates."},
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"},
                temperature=0.7,
                max_tokens=800
            )

            ai_response = json.loads(response.choices[0].message.content)

            return {
                "success": True,
                **ai_response
            }

        except Exception as e:
            return {
                "success": False,
                "error": f"AI analysis failed: {str(e)}",
                "recommendations": ["Manual review recommended"],
                "confidence": 0.0
            }

    async def detect_roof_damage(
        self,
        image_description: str,
        area_sq_ft: float
    ) -> Dict[str, any]:
        """
        Analyze potential roof damage from description.

        Args:
            image_description: Description of roof condition
            area_sq_ft: Roof area for context

        Returns:
            Damage assessment
        """
        if not self.is_configured():
            return {
                "has_damage": False,
                "damage_types": [],
                "severity": "unknown",
                "confidence": 0.0
            }

        try:
            prompt = f"""Analyze this roof condition description and assess damage:

Roof Area: {area_sq_ft:.2f} sq ft
Description: {image_description}

Provide JSON with:
1. "has_damage": true/false
2. "damage_types": list of specific damage types found
3. "severity": "none", "minor", "moderate", or "severe"
4. "repair_priority": "low", "medium", "high", or "urgent"
5. "estimated_repair_cost_multiplier": 1.0 to 2.0 (how much repairs add to base cost)
6. "confidence": 0-1 confidence score"""

            response = self.client.chat.completions.create(
                model=settings.openai_model,
                messages=[
                    {"role": "system", "content": "You are a roof damage assessment expert."},
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"},
                temperature=0.5,
                max_tokens=500
            )

            return json.loads(response.choices[0].message.content)

        except Exception as e:
            return {
                "has_damage": False,
                "error": str(e),
                "confidence": 0.0
            }


ai_service = AIService()
