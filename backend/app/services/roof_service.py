"""Roof measurement and calculation service."""
from typing import List, Dict, Tuple
import math
from shapely.geometry import Polygon
from app.core.config import settings


class RoofService:
    """Service for roof measurements and cost calculations."""

    @staticmethod
    def calculate_polygon_area(points: List[Dict[str, float]], scale_factor: float = 1.0) -> float:
        """
        Calculate area of polygon from points.

        Args:
            points: List of {x, y} coordinates
            scale_factor: Conversion factor from pixels to real-world units

        Returns:
            Area in square feet
        """
        if len(points) < 3:
            return 0.0

        coords = [(p['x'], p['y']) for p in points]
        polygon = Polygon(coords)
        area_pixels = polygon.area

        # Convert to square feet (assuming scale_factor is feet per pixel)
        area_sq_ft = area_pixels * (scale_factor ** 2)
        return round(area_sq_ft, 2)

    @staticmethod
    def estimate_roof_pitch(area_sq_ft: float, building_type: str = "residential") -> float:
        """
        Estimate roof pitch based on area and building type.

        Args:
            area_sq_ft: Roof area in square feet
            building_type: Type of building (residential, commercial)

        Returns:
            Estimated pitch in degrees
        """
        # Simple heuristic: larger roofs tend to have lower pitch
        if building_type == "commercial":
            base_pitch = 15.0  # ~3:12 pitch
        else:
            base_pitch = 22.5  # ~5:12 pitch

        # Adjust based on area (larger = slightly flatter)
        if area_sq_ft > 3000:
            base_pitch -= 5.0
        elif area_sq_ft < 1000:
            base_pitch += 5.0

        return round(max(10.0, min(base_pitch, 45.0)), 1)

    @staticmethod
    def calculate_pitch_multiplier(pitch_degrees: float) -> float:
        """
        Calculate multiplier for steep roofs.

        Args:
            pitch_degrees: Roof pitch in degrees

        Returns:
            Multiplier for cost adjustment
        """
        if pitch_degrees <= 25:
            return 1.0
        elif pitch_degrees <= 35:
            return 1.15
        elif pitch_degrees <= 45:
            return settings.steep_roof_multiplier
        else:
            return 1.5

    @staticmethod
    def calculate_material_cost(
        area_sq_ft: float,
        material_cost_per_sqft: float = None,
        waste_factor: float = 1.1
    ) -> float:
        """
        Calculate material cost.

        Args:
            area_sq_ft: Roof area in square feet
            material_cost_per_sqft: Cost per square foot (default from settings)
            waste_factor: Waste/overlap factor (default 10%)

        Returns:
            Material cost in USD
        """
        if material_cost_per_sqft is None:
            material_cost_per_sqft = settings.default_material_cost

        return round(area_sq_ft * material_cost_per_sqft * waste_factor, 2)

    @staticmethod
    def calculate_labor_cost(
        area_sq_ft: float,
        pitch_multiplier: float,
        labor_cost_per_sqft: float = None
    ) -> float:
        """
        Calculate labor cost.

        Args:
            area_sq_ft: Roof area in square feet
            pitch_multiplier: Multiplier for steep roofs
            labor_cost_per_sqft: Labor cost per square foot (default from settings)

        Returns:
            Labor cost in USD
        """
        if labor_cost_per_sqft is None:
            labor_cost_per_sqft = settings.default_labor_cost

        return round(area_sq_ft * labor_cost_per_sqft * pitch_multiplier, 2)

    @staticmethod
    def calculate_total_estimate(
        area_sq_ft: float,
        pitch_degrees: float,
        has_damage: bool = False,
        material_cost_per_sqft: float = None,
        labor_cost_per_sqft: float = None
    ) -> Dict[str, float]:
        """
        Calculate complete cost estimate.

        Args:
            area_sq_ft: Roof area in square feet
            pitch_degrees: Roof pitch in degrees
            has_damage: Whether roof has damage requiring repairs
            material_cost_per_sqft: Custom material cost
            labor_cost_per_sqft: Custom labor cost

        Returns:
            Dictionary with cost breakdown
        """
        pitch_multiplier = RoofService.calculate_pitch_multiplier(pitch_degrees)
        material_cost = RoofService.calculate_material_cost(area_sq_ft, material_cost_per_sqft)
        labor_cost = RoofService.calculate_labor_cost(area_sq_ft, pitch_multiplier, labor_cost_per_sqft)

        subtotal = material_cost + labor_cost

        # Apply damage repair multiplier if needed
        if has_damage:
            repair_cost = subtotal * (settings.damage_repair_multiplier - 1)
        else:
            repair_cost = 0.0

        total = subtotal + repair_cost

        return {
            "area_sq_ft": round(area_sq_ft, 2),
            "pitch_degrees": pitch_degrees,
            "pitch_multiplier": pitch_multiplier,
            "material_cost": material_cost,
            "labor_cost": labor_cost,
            "repair_cost": round(repair_cost, 2),
            "subtotal": round(subtotal, 2),
            "total": round(total, 2),
            "cost_per_sqft": round(total / area_sq_ft, 2)
        }


roof_service = RoofService()
