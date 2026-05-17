import numpy as np
import hashlib


# City-specific base temperatures (India + global cities)
CITY_TEMPS: dict[str, float] = {
    "chennai": 32.0, "mumbai": 29.0, "delhi": 28.0, "bangalore": 24.0,
    "kolkata": 30.0, "hyderabad": 28.0, "pune": 26.0, "ahmedabad": 31.0,
    "jaipur": 30.0, "bhubaneswar": 31.0, "london": 12.0, "new york": 15.0,
    "tokyo": 16.0, "paris": 14.0, "sydney": 20.0,
}


def generate_mock_temperature_data(city: str, days: int = 60) -> list[float]:
    """
    Generate realistic mock historical temperature data for a city.
    Uses a deterministic seed based on city name for reproducibility.
    """
    seed = int(hashlib.md5(city.lower().encode()).hexdigest()[:8], 16) % (2**32)
    rng = np.random.default_rng(seed)

    base_temp = CITY_TEMPS.get(city.lower(), 25.0)

    # Generate with seasonal trend + gaussian noise
    t = np.arange(days, dtype=float)
    seasonal = 3.0 * np.sin(2 * np.pi * t / 365.0)
    noise = rng.normal(0, 1.5, days)
    temps = base_temp + seasonal + noise

    return [round(float(v), 1) for v in temps]
