import os
import sys
# Ensure the current directory is in the Python search path for robust imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import forecast, anomaly

app = FastAPI(
    title="WeatherCast AI — ML Microservice",
    description="LSTM-based weather forecasting and anomaly detection powered by TensorFlow/Keras and Scikit-learn.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(forecast.router, prefix="/forecast", tags=["Forecast"])
app.include_router(anomaly.router, prefix="/anomaly", tags=["Anomaly"])


@app.get("/")
async def root():
    return {
        "service": "WeatherCast AI ML Microservice",
        "status": "running",
        "endpoints": ["/forecast", "/anomaly", "/docs"],
    }


@app.get("/health")
async def health():
    return {"status": "healthy"}
