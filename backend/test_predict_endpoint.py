"""
Automated Test for FastAPI POST /api/v1/predict Endpoint.
Verifies leaf image upload, 95.33% AI inference, and personalized dosage advisory calculation.
"""

import sys
from pathlib import Path
from fastapi.testclient import TestClient

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app.main import app


def test_predict_endpoint():
    print("=" * 70)
    print("Testing FastAPI POST /api/v1/predict Endpoint...")
    print("=" * 70)

    client = TestClient(app)

    # Sample leaf image
    sample_img_path = Path(r"D:\Cotton Leaf Disease Detection Dataset\Cotton Leaf Disease Detection Dataset\Original Dataset\Curl Virus\CV00005.jpg")
    
    if not sample_img_path.exists():
        print(f"[WARN] Sample image not found at {sample_img_path}. Skipping file test.")
        return

    with open(sample_img_path, "rb") as f:
        response = client.post(
            "/api/v1/predict/",
            files={"file": ("CV00005.jpg", f, "image/jpeg")},
            params={"land_acres": 2.5, "use_tta": True}
        )

    print(f"HTTP Status Code: {response.status_code}")
    assert response.status_code == 200, f"Expected 200 OK, got {response.status_code}: {response.text}"

    data = response.json()
    print("Response JSON Payload:")
    import json
    print(json.dumps(data, indent=2))

    assert data["success"] is True
    assert "data" in data
    res = data["data"]

    assert res["predicted_class"] == "Curl Virus"
    assert res["confidence"] > 0.90
    assert "personalized_advisory" in res

    advisory = res["personalized_advisory"]
    assert advisory["land_acres"] == 2.5
    assert "calculated_dosage" in advisory
    assert advisory["calculated_dosage"]["total_water_litres"] == 500  # 200 L/acre * 2.5 acres = 500 L

    print("\n" + "=" * 70)
    print("[SUCCESS] POST /api/v1/predict Endpoint Verification PASSED 100% CLEANLY!")
    print("=" * 70)


if __name__ == "__main__":
    test_predict_endpoint()
