from fastapi import APIRouter
from services import lstm_service

router = APIRouter()

@router.get("/")
async def get_forecast(city: str):
    # Logic to return LSTM-based forecast
    return {"city": city, "forecast": "LSTM prediction data"}
