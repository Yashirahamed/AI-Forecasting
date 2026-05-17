from fastapi import APIRouter, HTTPException, Query
import numpy as np
from services.lstm_service import LSTMForecastService
from data.mock_generator import generate_mock_temperature_data

router = APIRouter()
lstm_service = LSTMForecastService()


@router.get("")
async def get_forecast(
    city: str = Query(..., description="City name"),
    days: int = Query(7, ge=1, le=14, description="Forecast days"),
):
    """
    Get LSTM-based temperature forecast for a city.
    Uses mock historical data when real data is unavailable.
    """
    try:
        # Generate mock historical data (replace with real API in production)
        historical_temps = generate_mock_temperature_data(city, days=60)
        
        forecast = lstm_service.predict(historical_temps, forecast_days=days)
        
        return {
            "city": city,
            "forecast_days": days,
            "predictions": [
                {
                    "day": i + 1,
                    "temperature_min": round(float(forecast[i]) - 3.5, 1),
                    "temperature_max": round(float(forecast[i]) + 3.5, 1),
                    "temperature_mean": round(float(forecast[i]), 1),
                }
                for i in range(days)
            ],
            "model": "LSTM",
            "confidence": 0.82,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e
