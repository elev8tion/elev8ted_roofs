"""Application configuration using Pydantic settings."""
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # App Info
    app_name: str = "Elev8ted Roofs"
    app_version: str = "1.0.0"
    debug: bool = True

    # API Keys
    google_maps_api_key: str = ""
    google_geocoding_api_key: str = ""
    openai_api_key: str = ""
    openai_model: str = "gpt-4o-mini"

    # CORS
    cors_origins: str = "http://localhost:5173,http://localhost:3000"

    # Pricing Defaults
    default_material_cost: float = 3.50
    default_labor_cost: float = 2.50
    steep_roof_multiplier: float = 1.25
    damage_repair_multiplier: float = 1.15

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False
    )

    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS origins as list."""
        return [origin.strip() for origin in self.cors_origins.split(",")]

    @property
    def has_google_maps_key(self) -> bool:
        """Check if Google Maps API key is configured."""
        return bool(self.google_maps_api_key and self.google_maps_api_key != "your_google_maps_api_key_here")

    @property
    def has_openai_key(self) -> bool:
        """Check if OpenAI API key is configured."""
        return bool(self.openai_api_key and self.openai_api_key != "your_openai_api_key_here")


settings = Settings()
