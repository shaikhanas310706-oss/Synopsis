"""
Automated API verification suite for SynapseIQ Python Backend.
"""
import requests
import json
import sys

BASE = "http://localhost:5000/api"

def run_tests():
    print("Starting SynapseIQ Automated Python Verification Suite...\n")
    
    # 1. Health check
    res = requests.get(f"{BASE}/health")
    assert res.status_code == 200, f"Health check failed: {res.text}"
    health = res.json()
    print(f"[OK] [Health Check]: {health['status']} - {health['platform']}")

    # 2. Curriculum test
    res = requests.get(f"{BASE}/curriculum")
    assert res.status_code == 200, f"Curriculum failed: {res.text}"
    cur = res.json()
    print(f"[OK] [Curriculum]: Loaded {len(cur['courses'])} courses with active learner '{cur['activeLearner']['name']}' (Level {cur['activeLearner']['level']})")

    # 3. Adaptive Question Selection test
    res = requests.post(f"{BASE}/adaptive/next-question", json={"conceptId": "backprop"})
    assert res.status_code == 200, f"Adaptive next question failed: {res.text}"
    q_data = res.json()
    q = q_data["question"]
    print(f"[OK] [IRT Adaptive Engine]: Calibrated question '{q['title']}' (Difficulty b={q['difficulty']}, Bloom={q['bloomLevel']})")

    # 4. Submit Answer with Metacognitive Confidence
    opt_id = q["options"][0]["id"]
    res = requests.post(f"{BASE}/adaptive/submit-answer", json={
        "questionId": q["id"],
        "selectedOptionId": opt_id,
        "confidence": "high",
        "conceptId": "backprop"
    })
    assert res.status_code == 200, f"Submit answer failed: {res.text}"
    sub = res.json()
    print(f"[OK] [BKT Mastery Engine]: Prior={sub['priorMastery']}% -> Updated={sub['updatedMastery']}%, Correct={sub['isCorrect']}, XP Gained=+{sub['xpGained']}")
    print(f"[OK] [Metacognition Evaluation]: {sub['calibration']['type']} - \"{sub['calibration']['note']}\"")

    # 5. Socratic AI Tutor Chat test
    res = requests.post(f"{BASE}/tutor/chat", json={
        "message": "Give me an intuitive analogy for backpropagation",
        "conceptId": "backprop"
    })
    assert res.status_code == 200, f"Tutor chat failed: {res.text}"
    tutor = res.json()
    print(f"[OK] [Socratic AI Tutor ('Nova')]: Responded in mode '{tutor['mode']}' for concept '{tutor['concept']}'")

    # 6. Student Analytics & Retention Forecast
    res = requests.get(f"{BASE}/analytics/student")
    assert res.status_code == 200, f"Analytics failed: {res.text}"
    analytics = res.json()
    prec = analytics["cognitiveMetrics"]["metacognitiveCalibration"] * 100
    print(f"[OK] [Cognitive Analytics]: Metacognitive Precision={prec:.1f}%, Competency Radar Axes={len(analytics['radar'])}, Forgetting Forecast Items={len(analytics['forgettingForecast'])}")

    # 7. Educator Cohort Telemetry
    res = requests.get(f"{BASE}/educator/cohort")
    assert res.status_code == 200, f"Cohort failed: {res.text}"
    cohort = res.json()
    c = cohort["cohort"]
    print(f"[OK] [Educator Studio]: Cohort '{c['cohortName']}', Class Mastery={c['classAverageMastery']}%, At-Risk Students={c['atRiskStudentsCount']}, Bottleneck Concepts={len(c['conceptBottlenecks'])}")

    print("\n==================================================")
    print("ALL 7 CORE PLATFORM SYSTEMS VERIFIED ON PYTHON!")
    print("==================================================")

if __name__ == "__main__":
    try:
        run_tests()
    except Exception as e:
        print(f"❌ Error during verification: {e}")
        sys.exit(1)
