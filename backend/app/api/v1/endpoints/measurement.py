"""Roof measurement and cost calculation endpoints."""
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional, Dict
from app.services.roof_service import roof_service


router = APIRouter()


class Point(BaseModel):
    x: float
    y: float


class MeasurementRequest(BaseModel):
    points: List[Point]
    scale_factor: float = 1.0  # feet per pixel
    building_type: str = "residential"
    user_notes: Optional[str] = None


class CostEstimateRequest(BaseModel):
    area_sq_ft: float
    pitch_degrees: float
    has_damage: bool = False
    material_cost_per_sqft: Optional[float] = None
    labor_cost_per_sqft: Optional[float] = None


class MeasurementResponse(BaseModel):
    area_sq_ft: float
    estimated_pitch: float
    pitch_multiplier: float
    perimeter: float
    point_count: int


class CostEstimateResponse(BaseModel):
    area_sq_ft: float
    pitch_degrees: float
    pitch_multiplier: float
    material_cost: float
    labor_cost: float
    repair_cost: float
    subtotal: float
    total: float
    cost_per_sqft: float


@router.post("/calculate", response_model=MeasurementResponse)
async def calculate_measurement(request: MeasurementRequest):
    """
    Calculate roof measurements from polygon points.

    Args:
        request: Polygon points and scale factor

    Returns:
        Roof measurements including area and estimated pitch
    """
    points_dict = [{"x": p.x, "y": p.y} for p in request.points]

    # Calculate area
    area_sq_ft = roof_service.calculate_polygon_area(points_dict, request.scale_factor)

    # Estimate pitch
    pitch_degrees = roof_service.estimate_roof_pitch(area_sq_ft, request.building_type)

    # Calculate pitch multiplier
    pitch_multiplier = roof_service.calculate_pitch_multiplier(pitch_degrees)

    # Calculate simple perimeter
    perimeter = 0.0
    for i in range(len(request.points)):
        p1 = request.points[i]
        p2 = request.points[(i + 1) % len(request.points)]
        distance = ((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2) ** 0.5
        perimeter += distance * request.scale_factor

    return MeasurementResponse(
        area_sq_ft=area_sq_ft,
        estimated_pitch=pitch_degrees,
        pitch_multiplier=pitch_multiplier,
        perimeter=round(perimeter, 2),
        point_count=len(request.points)
    )


@router.post("/estimate-cost", response_model=CostEstimateResponse)
async def estimate_cost(request: CostEstimateRequest):
    """
    Calculate cost estimate for roof replacement.

    Args:
        request: Area, pitch, and optional custom pricing

    Returns:
        Detailed cost breakdown
    """
    estimate = roof_service.calculate_total_estimate(
        area_sq_ft=request.area_sq_ft,
        pitch_degrees=request.pitch_degrees,
        has_damage=request.has_damage,
        material_cost_per_sqft=request.material_cost_per_sqft,
        labor_cost_per_sqft=request.labor_cost_per_sqft
    )

    return CostEstimateResponse(**estimate)


@router.get("/pricing-defaults")
async def get_pricing_defaults():
    """
    Get default pricing configuration.

    Returns:
        Default material and labor costs
    """
    from app.core.config import settings

    return {
        "material_cost_per_sqft": settings.default_material_cost,
        "labor_cost_per_sqft": settings.default_labor_cost,
        "steep_roof_multiplier": settings.steep_roof_multiplier,
        "damage_repair_multiplier": settings.damage_repair_multiplier,
        "currency": "USD"
    }
