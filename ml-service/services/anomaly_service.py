import numpy as np
from numpy.typing import NDArray
from sklearn.ensemble import IsolationForest


class AnomalyDetectionService:
    """Isolation Forest-based weather anomaly detection."""

    def __init__(self, contamination: float = 0.05) -> None:
        self.model = IsolationForest(
            contamination=contamination,
            random_state=42,
            n_estimators=100,
        )

    def detect(self, temperatures: list[float]) -> dict:
        data = np.array(temperatures).reshape(-1, 1)
        
        # Fit and predict
        predictions = self.model.fit_predict(data)
        scores = self.model.score_samples(data)
        
        # Anomaly indices where prediction == -1
        anomaly_indices = [
            int(i) for i, pred in enumerate(predictions) if pred == -1
        ]
        
        # Severity based on score magnitude
        severity = "LOW"
        if len(anomaly_indices) > len(temperatures) * 0.1:
            severity = "HIGH"
        elif len(anomaly_indices) > len(temperatures) * 0.05:
            severity = "MEDIUM"

        return {
            "anomaly_indices": anomaly_indices,
            "scores": [round(float(s), 4) for s in scores.tolist()],
            "severity": severity,
        }
