"""
SynapseIQ Adaptive Diagnostic & Learning Engine
Incorporates Item Response Theory (IRT 3PL), Bayesian Knowledge Tracing (BKT),
Metacognition Calibration, and SuperMemo SM-2 Spaced Repetition.
"""

import math
import random
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, List, Optional


def calculate_irt_probability(theta: float, b: float, a: float = 1.3, c: float = 0.25) -> float:
    """
    Item Response Theory (IRT 3-Parameter Logistic).
    theta: learner ability, b: item difficulty, a: discrimination, c: pseudo-guessing.
    """
    exponent = -1.7 * a * (theta - b)
    # Clamp exponent to avoid overflow in math.exp
    exponent = max(-30.0, min(30.0, exponent))
    return c + (1.0 - c) / (1.0 + math.exp(exponent))


def calculate_fisher_information(theta: float, b: float, a: float = 1.3, c: float = 0.25) -> float:
    """
    Calculates Fisher Information to target questions at the learner's Zone of Proximal Development.
    """
    p = calculate_irt_probability(theta, b, a, c)
    q = 1.0 - p
    exponent = -1.7 * a * (theta - b)
    exponent = max(-30.0, min(30.0, exponent))
    exp_val = math.exp(exponent)
    p_prime = (1.7 * a * (1.0 - c) * exp_val) / ((1.0 + exp_val) ** 2)
    return (p_prime ** 2) / (p * q + 1e-9)


def select_next_adaptive_question(
    questions: List[Dict[str, Any]],
    concept_id: str,
    current_mastery: float,
    answered_question_ids: Optional[List[str]] = None
) -> Optional[Dict[str, Any]]:
    """
    Select the optimal next question for a learner based on current mastery and history.
    """
    if answered_question_ids is None:
        answered_question_ids = []

    # Filter questions for this concept that haven't been answered yet in this session
    candidate_questions = [
        q for q in questions
        if q.get("conceptId") == concept_id and q.get("id") not in answered_question_ids
    ]

    if not candidate_questions:
        all_for_concept = [q for q in questions if q.get("conceptId") == concept_id]
        if all_for_concept:
            return random.choice(all_for_concept)
        return questions[0] if questions else None

    # Learner ability theta estimated from currentMastery [0, 1] mapped to difficulty scale [0.1, 0.95]
    estimated_theta = max(0.1, min(0.95, current_mastery))

    # Find candidate maximizing Fisher Information (zone of proximal development)
    best_question = candidate_questions[0]
    max_info = -1.0

    for q in candidate_questions:
        diff = q.get("difficulty", 0.5)
        disc = q.get("discrimination", 1.3)
        guess = q.get("guessing", 0.25)
        info = calculate_fisher_information(estimated_theta, diff, disc, guess)
        if info > max_info:
            max_info = info
            best_question = q

    return best_question


def update_bkt_mastery(prior_mastery: float, is_correct: bool, confidence: str = "medium") -> float:
    """
    Bayesian Knowledge Tracing (BKT) Update with metacognitive slip/guess adjustments.
    """
    p_trans = 0.14  # transition probability P(T)
    p_slip = 0.08   # slip probability P(S) (knew it but made slip)
    p_guess = 0.22  # guess probability P(G) (didn't know it but guessed)

    # Metacognitive adaptation of slip and guess parameters
    if confidence == "high" and not is_correct:
        # High confidence mistake indicates strong conceptual misconception
        p_slip = 0.02
    elif confidence == "low" and is_correct:
        # Low confidence correct answer was almost certainly a guess
        p_guess = 0.45
    elif confidence == "high" and is_correct:
        # High confidence correct answer indicates genuine mastery
        p_guess = 0.10

    p_l = max(0.01, min(0.99, prior_mastery))

    if is_correct:
        numerator = p_l * (1.0 - p_slip)
        denominator = numerator + (1.0 - p_l) * p_guess
        posterior_p = numerator / (denominator + 1e-9)
    else:
        numerator = p_l * p_slip
        denominator = numerator + (1.0 - p_l) * (1.0 - p_guess)
        posterior_p = numerator / (denominator + 1e-9)

    # Knowledge accumulation step
    updated_mastery = posterior_p + (1.0 - posterior_p) * p_trans
    return round(max(0.05, min(0.99, updated_mastery)), 2)


def calculate_sm2(current_card: Dict[str, Any], rating: int) -> Dict[str, Any]:
    """
    SuperMemo SM-2 Spaced Repetition Algorithm.
    rating: 0-5 (0=complete blackout, 3=correct with hesitation, 5=perfect recall)
    """
    repetitions = current_card.get("repetitions", 0)
    interval_days = current_card.get("intervalDays", 1)
    ease_factor = current_card.get("easeFactor", 2.5)

    if rating >= 3:
        if repetitions == 0:
            interval_days = 1
        elif repetitions == 1:
            interval_days = 6
        else:
            interval_days = round(interval_days * ease_factor)
        repetitions += 1
    else:
        repetitions = 0
        interval_days = 1

    # Update ease factor: EF' = EF + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02))
    ease_factor = ease_factor + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02))
    if ease_factor < 1.3:
        ease_factor = 1.3

    next_due_date = (datetime.now(timezone.utc) + timedelta(days=interval_days)).isoformat()

    mastery_level = "Mastered" if rating >= 4 else ("Review Needed" if rating == 3 else "Critical")

    updated = dict(current_card)
    updated.update({
        "repetitions": repetitions,
        "intervalDays": interval_days,
        "easeFactor": round(ease_factor, 2),
        "dueDate": next_due_date,
        "masteryLevel": mastery_level
    })
    return updated


def evaluate_calibration(confidence: str, is_correct: bool) -> Dict[str, Any]:
    """
    Metacognitive Calibration Rating.
    Evaluates whether learner is accurately self-aware of knowledge state.
    """
    if (confidence == "high" and is_correct) or (confidence == "low" and not is_correct):
        return {
            "score": 1.0,
            "type": "Accurately Calibrated",
            "note": "Your self-assessment matched your performance."
        }
    if confidence == "medium":
        return {
            "score": 0.7,
            "type": "Moderate Calibration",
            "note": "Appropriate caution exercised."
        }
    if confidence == "high" and not is_correct:
        return {
            "score": 0.2,
            "type": "Overconfident Misconception",
            "note": "Careful: you were confident in an incorrect assumption. Review the breakdown below."
        }
    # low confidence but correct
    return {
        "score": 0.5,
        "type": "Underconfident Insight",
        "note": "You knew more than you gave yourself credit for!"
    }
