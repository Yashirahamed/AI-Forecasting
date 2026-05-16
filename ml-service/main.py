from fastapi import FastAPI
from routers import forecast, anomaly
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="WeatherCast AI ML Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(forecast.router, prefix="/forecast", tags=["Forecast"])
app.include_router(anomaly.router, prefix="/anomaly", tags=["Anomaly"])

@app.get("/")
async def root():
    return {"message": "WeatherCast AI ML Microservice is online"}
