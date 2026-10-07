import math
import uuid
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, Field

from data.store import get_store, save_store
from engine.adaptive_engine import (
    calculate_fisher_information,
    calculate_irt_probability,
    calculate_sm2,
    evaluate_calibration,
    select_next_adaptive_question,
    update_bkt_mastery,
)
from engine.ai_tutor_engine import generate_socratic_response

router = APIRouter(prefix="/api")


# --- Pydantic Request Models ---
class SwitchRoleRequest(BaseModel):
    role: str

class NextQuestionRequest(BaseModel):
    conceptId: str
    answeredQuestionIds: Optional[List[str]] = Field(default_factory=list)

class SubmitAnswerRequest(BaseModel):
    questionId: str
    selectedOptionId: str
    confidence: Optional[str] = "medium"
    conceptId: str

class TutorChatRequest(BaseModel):
    message: str
    conceptId: Optional[str] = None
    questionContext: Optional[Dict[str, Any]] = None
    apiKey: Optional[str] = None

class SrsReviewRequest(BaseModel):
    cardId: str
    rating: int

class QuestionOption(BaseModel):
    text: str
    isCorrect: bool
    explanation: Optional[str] = "Standard feedback explanation."
    misconceptionType: Optional[str] = None

class CreateQuestionRequest(BaseModel):
    conceptId: str
    difficulty: Optional[float] = 0.5
    bloomLevel: Optional[str] = "Application"
    title: str
    questionText: str
    codeSnippet: Optional[str] = None
    options: List[Dict[str, Any]]
    hints: Optional[List[str]] = None


# --- 1. Health Check ---
@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "platform": "SynapseIQ Adaptive Engine (Python FastAPI)"
    }


# --- 2. Curriculum & Courses ---
@router.get("/curriculum")
def get_curriculum():
    store = get_store()
    learner = store.get("activeLearner", {})
    domain_mastery = learner.get("domainMastery", {})

    courses_with_mastery = []
    for course in store.get("courses", []):
        nodes_with_status = []
        for node in course.get("nodes", []):
            node_id = node.get("id")
            mastery = domain_mastery.get(node_id, 0.0)

            # Node is unlocked if all prerequisites have mastery >= 0.60
            prereqs = node.get("prerequisites", [])
            prereqs_met = all(domain_mastery.get(p_id, 0.0) >= 0.60 for p_id in prereqs)

            status = "locked"
            if prereqs_met:
                if mastery >= 0.85:
                    status = "mastered"
                elif mastery >= 0.40:
                    status = "in_progress"
                else:
                    status = "available"

            node_copy = dict(node)
            node_copy["masteryScore"] = round(mastery * 100)
            node_copy["status"] = status
            node_copy["prereqsMet"] = prereqs_met
            nodes_with_status.append(node_copy)

        course_copy = dict(course)
        course_copy["nodes"] = nodes_with_status
        courses_with_mastery.append(course_copy)

    return {
        "courses": courses_with_mastery,
        "activeLearner": learner
    }


# --- 3. User Profile & Preferences ---
@router.get("/user/profile")
def get_user_profile():
    store = get_store()
    return {"learner": store.get("activeLearner", {})}


@router.post("/user/switch-role")
def switch_user_role(req: SwitchRoleRequest):
    store = get_store()
    if req.role in ["student", "educator"]:
        store["activeLearner"]["role"] = req.role
        save_store()
    return {"success": True, "activeLearner": store.get("activeLearner", {})}


# --- 4. Adaptive Diagnostic Engine ---
@router.post("/adaptive/next-question")
def get_next_question(req: NextQuestionRequest):
    store = get_store()
    if not req.conceptId:
        raise HTTPException(status_code=400, detail="conceptId is required")

    current_mastery = store.get("activeLearner", {}).get("domainMastery", {}).get(req.conceptId, 0.2)
    question = select_next_adaptive_question(
        store.get("questions", []),
        req.conceptId,
        current_mastery,
        req.answeredQuestionIds or []
    )

    if not question:
        raise HTTPException(status_code=404, detail="No questions found for concept")

    estimated_prob = calculate_irt_probability(
        current_mastery,
        question.get("difficulty", 0.5),
        question.get("discrimination", 1.3),
        question.get("guessing", 0.25)
    )

    sanitized_question = {
        "id": question["id"],
        "conceptId": question.get("conceptId"),
        "difficulty": question.get("difficulty", 0.5),
        "bloomLevel": question.get("bloomLevel", "Application"),
        "title": question.get("title", ""),
        "questionText": question.get("questionText", ""),
        "codeSnippet": question.get("codeSnippet"),
        "options": [
            {"id": opt["id"], "text": opt["text"]}
            for opt in question.get("options", [])
        ],
        "estimatedSuccessProb": round(estimated_prob * 100)
    }

    return {
        "question": sanitized_question,
        "currentMastery": round(current_mastery * 100)
    }


@router.post("/adaptive/submit-answer")
def submit_adaptive_answer(req: SubmitAnswerRequest):
    store = get_store()
    question = next((q for q in store.get("questions", []) if q.get("id") == req.questionId), None)
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    selected_opt = next((o for o in question.get("options", []) if o.get("id") == req.selectedOptionId), None)
    correct_opt = next((o for o in question.get("options", []) if o.get("isCorrect")), None)
    is_correct = bool(selected_opt.get("isCorrect")) if selected_opt else False

    # 1. Calculate Bayesian Knowledge Tracing (BKT) update
    prior_mastery = store.get("activeLearner", {}).get("domainMastery", {}).get(req.conceptId, 0.2)
    updated_mastery = update_bkt_mastery(prior_mastery, is_correct, req.confidence or "medium")
    store["activeLearner"]["domainMastery"][req.conceptId] = updated_mastery

    # 2. Metacognitive calibration rating
    calibration = evaluate_calibration(req.confidence or "medium", is_correct)

    # 3. XP & Progression rewards
    xp_gained = round(question.get("difficulty", 0.5) * 100) + 20 if is_correct else 5
    if (req.confidence == "high") and is_correct:
        xp_gained += 15

    store["activeLearner"]["xp"] += xp_gained
    store["activeLearner"]["cognitiveMetrics"]["totalQuestionsAnswered"] += 1

    # Level progression
    new_level = (store["activeLearner"]["xp"] // 400) + 1
    leveled_up = new_level > store["activeLearner"]["level"]
    store["activeLearner"]["level"] = new_level

    # Metacognitive rolling average update
    current_cal = store["activeLearner"]["cognitiveMetrics"]["metacognitiveCalibration"]
    store["activeLearner"]["cognitiveMetrics"]["metacognitiveCalibration"] = (
        round(((current_cal * 9.0 + calibration["score"]) / 10.0), 2)
    )

    # If learner struggled, add or schedule a spaced repetition review card
    if not is_correct:
        existing_card = next(
            (c for c in store["activeLearner"].get("srsCards", []) if c.get("conceptId") == req.conceptId),
            None
        )
        if not existing_card:
            due_date = (datetime.now(timezone.utc) + timedelta(hours=12)).isoformat()
            store["activeLearner"].setdefault("srsCards", []).append({
                "id": f"srs_{uuid.uuid4().hex[:8]}",
                "conceptId": req.conceptId,
                "front": question.get("questionText", ""),
                "back": f"{correct_opt.get('text', '')} - {correct_opt.get('explanation', '')}" if correct_opt else "",
                "intervalDays": 1,
                "repetitions": 0,
                "easeFactor": 2.3,
                "dueDate": due_date,
                "masteryLevel": "Critical"
            })

    save_store()

    misconception = selected_opt.get("misconceptionType") if (not is_correct and selected_opt) else None
    explanation = (selected_opt.get("explanation") if selected_opt else None) or (
        correct_opt.get("explanation") if correct_opt else ""
    )

    return {
        "isCorrect": is_correct,
        "selectedOption": selected_opt,
        "correctOption": correct_opt,
        "priorMastery": round(prior_mastery * 100),
        "updatedMastery": round(updated_mastery * 100),
        "xpGained": xp_gained,
        "leveledUp": leveled_up,
        "newLevel": new_level,
        "calibration": calibration,
        "misconception": misconception,
        "explanation": explanation,
        "activeLearner": store["activeLearner"]
    }


# --- 5. Socratic AI Tutor Chat ---
@router.post("/tutor/chat")
def tutor_chat(req: TutorChatRequest):
    store = get_store()
    try:
        response = generate_socratic_response(
            message=req.message,
            concept_id=req.conceptId,
            learner_profile=store.get("activeLearner"),
            current_question=req.questionContext,
            api_key=req.apiKey
        )
        return response
    except Exception as err:
        print("Tutor error:", err)
        raise HTTPException(status_code=500, detail="Failed to generate tutor response")


# --- 6. Spaced Repetition (SRS) Endpoints ---
@router.get("/srs/cards")
def get_srs_cards():
    store = get_store()
    now = datetime.now(timezone.utc)
    cards = []
    for card in store.get("activeLearner", {}).get("srsCards", []):
        is_due = False
        due_date_str = card.get("dueDate")
        if due_date_str:
            try:
                due_dt = datetime.fromisoformat(due_date_str.replace("Z", "+00:00"))
                is_due = due_dt <= now
            except Exception:
                is_due = False
        cards.append({**card, "isDue": is_due})
    return {"cards": cards}


@router.post("/srs/review")
def review_srs_card(req: SrsReviewRequest):
    store = get_store()
    cards = store.get("activeLearner", {}).get("srsCards", [])
    card_index = next((i for i, c in enumerate(cards) if c.get("id") == req.cardId), -1)
    if card_index == -1:
        raise HTTPException(status_code=404, detail="Card not found")

    updated_card = calculate_sm2(cards[card_index], req.rating)
    cards[card_index] = updated_card
    store["activeLearner"]["xp"] += 15 if req.rating >= 3 else 5

    save_store()
    return {
        "success": True,
        "updatedCard": updated_card,
        "xp": store["activeLearner"]["xp"]
    }


# --- 7. Learner Analytics & Retention Forecast ---
@router.get("/analytics/student")
def get_student_analytics():
    store = get_store()
    learner = store.get("activeLearner", {})
    domain_mastery = learner.get("domainMastery", {})

    # Radar competencies across 5 cognitive vectors
    radar = [
        {
            "metric": "Mathematical Rigor",
            "score": round(((domain_mastery.get("math_foundations", 0.8) + domain_mastery.get("backprop", 0.6)) * 50))
        },
        {
            "metric": "Algorithmic Intuition",
            "score": round(((domain_mastery.get("gradient_descent", 0.7) + domain_mastery.get("neural_networks", 0.8)) * 50))
        },
        {
            "metric": "System Scale & Concurrency",
            "score": round(((domain_mastery.get("concurrency", 0.7) + domain_mastery.get("caching", 0.5)) * 50))
        },
        {
            "metric": "Fault Tolerance",
            "score": round(((domain_mastery.get("consensus", 0.4) + domain_mastery.get("db_internals", 0.6)) * 50))
        },
        {
            "metric": "Metacognitive Precision",
            "score": round(learner.get("cognitiveMetrics", {}).get("metacognitiveCalibration", 0.85) * 100)
        }
    ]

    # Ebbinghaus Forgetting Curve Forecast across active concepts (first 6)
    forgetting_forecast = []
    items = list(domain_mastery.items())[:6]
    for key, mastery in items:
        stability_days = max(1, round(mastery * 14))
        projected = round(mastery * math.exp(-7.0 / stability_days) * 100)
        needs_review = (mastery * math.exp(-7.0 / stability_days)) < 0.55
        forgetting_forecast.append({
            "concept": key.replace("_", " "),
            "currentMastery": round(mastery * 100),
            "projectedIn7Days": projected,
            "stabilityDays": stability_days,
            "needsReview": needs_review
        })

    return {
        "cognitiveMetrics": learner.get("cognitiveMetrics", {}),
        "radar": radar,
        "forgettingForecast": forgetting_forecast,
        "recentTelemetry": learner.get("recentTelemetry"),
        "xp": learner.get("xp", 0),
        "level": learner.get("level", 1),
        "streak": learner.get("streak", 0)
    }


# --- 8. Educator Studio Endpoints ---
@router.get("/educator/cohort")
def get_cohort_telemetry():
    store = get_store()
    return {"cohort": store.get("cohortTelemetry", {})}


@router.post("/educator/create-question")
def create_custom_question(req: CreateQuestionRequest):
    store = get_store()
    if not req.conceptId or not req.title or not req.questionText or not req.options or len(req.options) < 2:
        raise HTTPException(status_code=400, detail="Missing required question fields")

    new_question = {
        "id": f"q_custom_{uuid.uuid4().hex[:8]}",
        "conceptId": req.conceptId,
        "difficulty": float(req.difficulty) if req.difficulty is not None else 0.5,
        "discrimination": 1.3,
        "guessing": 0.25,
        "bloomLevel": req.bloomLevel or "Application",
        "title": req.title,
        "questionText": req.questionText,
        "codeSnippet": req.codeSnippet or None,
        "options": [
            {
                "id": f"opt_{idx + 1}",
                "text": opt.get("text", ""),
                "isCorrect": bool(opt.get("isCorrect")),
                "explanation": opt.get("explanation") or "Standard feedback explanation.",
                "misconceptionType": opt.get("misconceptionType") or None
            }
            for idx, opt in enumerate(req.options)
        ],
        "hints": req.hints if (req.hints and len(req.hints) > 0) else ["Review the core definition and examine edge cases."]
    }

    store.setdefault("questions", []).append(new_question)
    save_store()

    return {"success": True, "question": new_question}
