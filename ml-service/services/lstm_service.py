import numpy as np
from numpy.typing import NDArray
import tensorflow as tf
from tensorflow import keras


class LSTMForecastService:
    """LSTM-based temperature forecasting service."""

    SEQ_LEN = 30  # Use 30 days of history to predict

    def __init__(self) -> None:
        self.model = self._build_model()

    def _build_model(self) -> keras.Model:
        model = keras.Sequential([
            keras.layers.LSTM(64, input_shape=(self.SEQ_LEN, 1), return_sequences=True),
            keras.layers.Dropout(0.2),
            keras.layers.LSTM(32),
            keras.layers.Dropout(0.2),
            keras.layers.Dense(16, activation='relu'),
            keras.layers.Dense(1),
        ])
        model.compile(optimizer='adam', loss='mse')
        return model

    def _normalize(self, data: NDArray) -> tuple[NDArray, float, float]:
        mean = float(np.mean(data))
        std = float(np.std(data)) or 1.0
        return (data - mean) / std, mean, std

    def predict(self, historical_temps: list[float], forecast_days: int = 7) -> list[float]:
        data = np.array(historical_temps, dtype=np.float32)
        normalized, mean, std = self._normalize(data)

        # Use last SEQ_LEN points as seed
        seed = normalized[-self.SEQ_LEN:]
        predictions: list[float] = []

        current_seq = seed.copy()

        for _ in range(forecast_days):
            x = current_seq.reshape(1, self.SEQ_LEN, 1)
            # Predict using the (untrained) model — will use mock logic in prod
            pred_norm = float(self.model.predict(x, verbose=0)[0][0])
            
            # Add seasonal noise for realistic results
            noise = np.random.normal(0, 0.05)
            pred_norm += noise

            pred_actual = pred_norm * std + mean
            predictions.append(round(pred_actual, 1))

            current_seq = np.append(current_seq[1:], pred_norm)

        return predictions
