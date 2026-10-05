/**
 * SynapseIQ Adaptive Diagnostic & Learning Engine
 * Incorporates Item Response Theory (IRT 3PL), Bayesian Knowledge Tracing (BKT),
 * Metacognition Calibration, and SuperMemo SM-2 Spaced Repetition.
 */

// --- Item Response Theory (IRT 3-Parameter Logistic) ---
export const calculateIrtProbability = (theta, b, a = 1.3, c = 0.25) => {
  // theta: learner ability, b: item difficulty, a: discrimination, c: pseudo-guessing
  const exponent = -1.7 * a * (theta - b);
  return c + (1 - c) / (1 + Math.exp(exponent));
};

export const calculateFisherInformation = (theta, b, a = 1.3, c = 0.25) => {
  const p = calculateIrtProbability(theta, b, a, c);
  const q = 1 - p;
  const pPrime = (1.7 * a * (1 - c) * Math.exp(-1.7 * a * (theta - b))) / Math.pow(1 + Math.exp(-1.7 * a * (theta - b)), 2);
  return Math.pow(pPrime, 2) / (p * q + 1e-9);
};

/**
 * Select the optimal next question for a learner based on current mastery and history
 */
export const selectNextAdaptiveQuestion = (questions, conceptId, currentMastery, answeredQuestionIds = []) => {
  // Filter questions for this concept that haven't been answered yet in this session
  const candidateQuestions = questions.filter(
    (q) => q.conceptId === conceptId && !answeredQuestionIds.includes(q.id)
  );

  if (candidateQuestions.length === 0) {
    // If all answered in session, fall back to any question for concept or related prereqs
    const allForConcept = questions.filter((q) => q.conceptId === conceptId);
    if (allForConcept.length > 0) {
      return allForConcept[Math.floor(Math.random() * allForConcept.length)];
    }
    return questions[0];
  }

  // Learner ability theta estimated from currentMastery [0, 1] mapped to difficulty scale [0.1, 0.9]
  const estimatedTheta = Math.max(0.1, Math.min(0.95, currentMastery));

  // Find candidate maximizing Fisher Information (zone of proximal development)
  let bestQuestion = candidateQuestions[0];
  let maxInfo = -1;

  for (const q of candidateQuestions) {
    const info = calculateFisherInformation(estimatedTheta, q.difficulty, q.discrimination || 1.3, q.guessing || 0.25);
    if (info > maxInfo) {
      maxInfo = info;
      bestQuestion = q;
    }
  }

  return bestQuestion;
};

// --- Bayesian Knowledge Tracing (BKT) Update ---
export const updateBktMastery = (priorMastery, isCorrect, confidence = "medium") => {
  // Standard BKT parameters
  let pTrans = 0.14; // transition probability P(T)
  let pSlip = 0.08;  // slip probability P(S) (knew it but made slip)
  let pGuess = 0.22; // guess probability P(G) (didn't know it but guessed)

  // Metacognitive adaptation of slip and guess parameters
  if (confidence === "high" && !isCorrect) {
    // High confidence mistake indicates strong conceptual misconception, not just a slip
    pSlip = 0.02; 
  } else if (confidence === "low" && isCorrect) {
    // Low confidence correct answer was almost certainly a guess
    pGuess = 0.45;
  } else if (confidence === "high" && isCorrect) {
    // High confidence correct answer indicates genuine mastery
    pGuess = 0.10;
  }

  const pL = Math.max(0.01, Math.min(0.99, priorMastery));

  let posteriorP;
  if (isCorrect) {
    const numerator = pL * (1 - pSlip);
    const denominator = numerator + (1 - pL) * pGuess;
    posteriorP = numerator / (denominator + 1e-9);
  } else {
    const numerator = pL * pSlip;
    const denominator = numerator + (1 - pL) * (1 - pGuess);
    posteriorP = numerator / (denominator + 1e-9);
  }

  // Knowledge accumulation step
  const updatedMastery = posteriorP + (1 - posteriorP) * pTrans;
  return Math.round(Math.max(0.05, Math.min(0.99, updatedMastery)) * 100) / 100;
};

// --- SuperMemo SM-2 Spaced Repetition Algorithm ---
export const calculateSm2 = (currentCard, rating) => {
  // rating: 0-5 (0=complete blackout, 3=correct with hesitation, 5=perfect recall)
  let { repetitions = 0, intervalDays = 1, easeFactor = 2.5 } = currentCard;

  if (rating >= 3) {
    if (repetitions === 0) {
      intervalDays = 1;
    } else if (repetitions === 1) {
      intervalDays = 6;
    } else {
      intervalDays = Math.round(intervalDays * easeFactor);
    }
    repetitions += 1;
  } else {
    repetitions = 0;
    intervalDays = 1;
  }

  // Update ease factor: EF' = EF + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02))
  easeFactor = easeFactor + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;

  const nextDueDate = new Date(Date.now() + intervalDays * 24 * 60 * 60 * 1000).toISOString();

  return {
    ...currentCard,
    repetitions,
    intervalDays,
    easeFactor: Math.round(easeFactor * 100) / 100,
    dueDate: nextDueDate,
    masteryLevel: rating >= 4 ? "Mastered" : rating === 3 ? "Review Needed" : "Critical"
  };
};

// --- Metacognitive Calibration Rating ---
export const evaluateCalibration = (confidence, isCorrect) => {
  // Evaluates whether learner is accurately self-aware of knowledge state
  if ((confidence === "high" && isCorrect) || (confidence === "low" && !isCorrect)) {
    return { score: 1.0, type: "Accurately Calibrated", note: "Your self-assessment matched your performance." };
  }
  if (confidence === "medium") {
    return { score: 0.7, type: "Moderate Calibration", note: "Appropriate caution exercised." };
  }
  if (confidence === "high" && !isCorrect) {
    return { score: 0.2, type: "Overconfident Misconception", note: "Careful: you were confident in an incorrect assumption. Review the breakdown below." };
  }
  // low confidence but correct
  return { score: 0.5, type: "Underconfident Insight", note: "You knew more than you gave yourself credit for!" };
};
