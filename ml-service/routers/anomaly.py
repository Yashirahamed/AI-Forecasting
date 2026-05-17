from fastapi import APIRouter, HTTPException, Query
from services.anomaly_service import AnomalyDetectionService
from data.mock_generator import generate_mock_temperature_data

router = APIRouter()
anomaly_service = AnomalyDetectionService()


@router.get("")
async def detect_anomalies(
    city: str = Query(..., description="City name"),
):
    """
    Detect weather anomalies using Isolation Forest.
    Returns anomaly dates and severity scores.
    """
    try:
        historical_data = generate_mock_temperature_data(city, days=90)
        result = anomaly_service.detect(historical_data)
        
        return {
            "city": city,
            "total_days_analyzed": len(historical_data),
            "anomalies_detected": len(result["anomaly_indices"]),
            "anomaly_dates": result["anomaly_indices"],
            "anomaly_scores": result["scores"],
            "severity": result["severity"],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e
