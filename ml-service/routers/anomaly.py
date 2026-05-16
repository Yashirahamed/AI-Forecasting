from fastapi import APIRouter
from services import anomaly_service

router = APIRouter()

@router.get("/")
async def detect_anomaly(data: list):
    # Logic to detect weather anomalies using Isolation Forest
    return {"anomalies": []}
