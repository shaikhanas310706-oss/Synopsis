import express from "express";
import { v4 as uuidv4 } from "uuid";
import { getStore, saveStore } from "../data/store.js";
import {
  selectNextAdaptiveQuestion,
  updateBktMastery,
  calculateSm2,
  evaluateCalibration,
  calculateIrtProbability
} from "../engine/adaptiveEngine.js";
import { generateSocraticResponse } from "../engine/aiTutorEngine.js";

const router = express.Router();

// --- Health Check ---
router.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString(), platform: "SynapseIQ Adaptive Engine" });
});

// --- Curriculum & Courses ---
router.get("/curriculum", (req, res) => {
  const store = getStore();
  const learner = store.activeLearner;

  // Augment course nodes with user's live mastery and unlock status
  const coursesWithMastery = store.courses.map((course) => {
    const nodesWithStatus = course.nodes.map((node) => {
      const mastery = learner.domainMastery[node.id] || 0.0;
      
      // Node is unlocked if all prerequisites have mastery >= 0.60
      const prereqsMet = node.prerequisites.every(
        (pId) => (learner.domainMastery[pId] || 0) >= 0.60
      );

      let status = "locked";
      if (prereqsMet) {
        if (mastery >= 0.85) status = "mastered";
        else if (mastery >= 0.40) status = "in_progress";
        else status = "available";
      }

      return {
        ...node,
        masteryScore: Math.round(mastery * 100),
        status,
        prereqsMet
      };
    });

    return {
      ...course,
      nodes: nodesWithStatus
    };
  });

  res.json({
    courses: coursesWithMastery,
    activeLearner: learner
  });
});

// --- User Profile & Preferences ---
router.get("/user/profile", (req, res) => {
  const store = getStore();
  res.json({ learner: store.activeLearner });
});

router.post("/user/switch-role", (req, res) => {
  const store = getStore();
  const { role } = req.body;
  if (role === "student" || role === "educator") {
    store.activeLearner.role = role;
    saveStore();
  }
  res.json({ success: true, activeLearner: store.activeLearner });
});

// --- Adaptive Diagnostic Engine ---
router.post("/adaptive/next-question", (req, res) => {
  const store = getStore();
  const { conceptId, answeredQuestionIds = [] } = req.body;

  if (!conceptId) {
    return res.status(400).json({ error: "conceptId is required" });
  }

  const currentMastery = store.activeLearner.domainMastery[conceptId] || 0.2;
  const question = selectNextAdaptiveQuestion(
    store.questions,
    conceptId,
    currentMastery,
    answeredQuestionIds
  );

  if (!question) {
    return res.status(404).json({ error: "No questions found for concept" });
  }

  // Calculate predicted success probability for transparency
  const estimatedProbability = calculateIrtProbability(
    currentMastery,
    question.difficulty,
    question.discrimination,
    question.guessing
  );

  // Return question without revealing the answers in advance
  const sanitizedQuestion = {
    id: question.id,
    conceptId: question.conceptId,
    difficulty: question.difficulty,
    bloomLevel: question.bloomLevel,
    title: question.title,
    questionText: question.questionText,
    codeSnippet: question.codeSnippet,
    options: question.options.map((opt) => ({
      id: opt.id,
      text: opt.text
    })),
    estimatedSuccessProb: Math.round(estimatedProbability * 100)
  };

  res.json({
    question: sanitizedQuestion,
    currentMastery: Math.round(currentMastery * 100)
  });
});

router.post("/adaptive/submit-answer", (req, res) => {
  const store = getStore();
  const { questionId, selectedOptionId, confidence = "medium", conceptId } = req.body;

  const question = store.questions.find((q) => q.id === questionId);
  if (!question) {
    return res.status(404).json({ error: "Question not found" });
  }

  const selectedOpt = question.options.find((o) => o.id === selectedOptionId);
  const correctOpt = question.options.find((o) => o.isCorrect);
  const isCorrect = selectedOpt ? selectedOpt.isCorrect : false;

  // 1. Calculate Bayesian Knowledge Tracing (BKT) update
  const priorMastery = store.activeLearner.domainMastery[conceptId] || 0.2;
  const updatedMastery = updateBktMastery(priorMastery, isCorrect, confidence);
  store.activeLearner.domainMastery[conceptId] = updatedMastery;

  // 2. Metacognitive calibration rating
  const calibration = evaluateCalibration(confidence, isCorrect);

  // 3. XP & Progression rewards
  let xpGained = isCorrect ? Math.round(question.difficulty * 100) + 20 : 5;
  if (confidence === "high" && isCorrect) xpGained += 15; // Confidence reward

  store.activeLearner.xp += xpGained;
  store.activeLearner.cognitiveMetrics.totalQuestionsAnswered += 1;

  // Level progression
  const newLevel = Math.floor(store.activeLearner.xp / 400) + 1;
  const leveledUp = newLevel > store.activeLearner.level;
  store.activeLearner.level = newLevel;

  // Metacognitive rolling average update
  const currentCalibration = store.activeLearner.cognitiveMetrics.metacognitiveCalibration;
  store.activeLearner.cognitiveMetrics.metacognitiveCalibration =
    Math.round(((currentCalibration * 9 + calibration.score) / 10) * 100) / 100;

  // If learner struggled, add or schedule a spaced repetition review card
  if (!isCorrect) {
    const existingCard = store.activeLearner.srsCards.find((c) => c.conceptId === conceptId);
    if (!existingCard) {
      store.activeLearner.srsCards.push({
        id: `srs_${uuidv4().substring(0, 8)}`,
        conceptId,
        front: question.questionText,
        back: `${correctOpt.text} - ${correctOpt.explanation}`,
        intervalDays: 1,
        repetitions: 0,
        easeFactor: 2.3,
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString(),
        masteryLevel: "Critical"
      });
    }
  }

  saveStore();

  res.json({
    isCorrect,
    selectedOption: selectedOpt,
    correctOption: correctOpt,
    priorMastery: Math.round(priorMastery * 100),
    updatedMastery: Math.round(updatedMastery * 100),
    xpGained,
    leveledUp,
    newLevel,
    calibration,
    misconception: !isCorrect && selectedOpt?.misconceptionType ? selectedOpt.misconceptionType : null,
    explanation: selectedOpt?.explanation || correctOpt.explanation,
    activeLearner: store.activeLearner
  });
});

// --- Socratic AI Tutor Chat ---
router.post("/tutor/chat", async (req, res) => {
  const store = getStore();
  const { message, conceptId, questionContext, apiKey } = req.body;

  try {
    const response = await generateSocraticResponse({
      message,
      conceptId,
      learnerProfile: store.activeLearner,
      currentQuestion: questionContext,
      apiKey
    });

    res.json(response);
  } catch (error) {
    console.error("Tutor error:", error);
    res.status(500).json({ error: "Failed to generate tutor response" });
  }
});

// --- Spaced Repetition (SRS) Endpoints ---
router.get("/srs/cards", (req, res) => {
  const store = getStore();
  const now = new Date();
  const cards = store.activeLearner.srsCards.map((card) => ({
    ...card,
    isDue: new Date(card.dueDate) <= now
  }));
  res.json({ cards });
});

router.post("/srs/review", (req, res) => {
  const store = getStore();
  const { cardId, rating } = req.body; // rating: 0-5

  const cardIndex = store.activeLearner.srsCards.findIndex((c) => c.id === cardId);
  if (cardIndex === -1) {
    return res.status(404).json({ error: "Card not found" });
  }

  const updatedCard = calculateSm2(store.activeLearner.srsCards[cardIndex], rating);
  store.activeLearner.srsCards[cardIndex] = updatedCard;
  store.activeLearner.xp += rating >= 3 ? 15 : 5;

  saveStore();
  res.json({ success: true, updatedCard, xp: store.activeLearner.xp });
});

// --- Learner Analytics & Retention Forecast ---
router.get("/analytics/student", (req, res) => {
  const store = getStore();
  const learner = store.activeLearner;

  // Radar competencies across 5 cognitive vectors
  const radar = [
    { metric: "Mathematical Rigor", score: Math.round(((learner.domainMastery.math_foundations || 0.8) + (learner.domainMastery.backprop || 0.6)) * 50) },
    { metric: "Algorithmic Intuition", score: Math.round(((learner.domainMastery.gradient_descent || 0.7) + (learner.domainMastery.neural_networks || 0.8)) * 50) },
    { metric: "System Scale & Concurrency", score: Math.round(((learner.domainMastery.concurrency || 0.7) + (learner.domainMastery.caching || 0.5)) * 50) },
    { metric: "Fault Tolerance", score: Math.round(((learner.domainMastery.consensus || 0.4) + (learner.domainMastery.db_internals || 0.6)) * 50) },
    { metric: "Metacognitive Precision", score: Math.round(learner.cognitiveMetrics.metacognitiveCalibration * 100) }
  ];

  // Ebbinghaus Forgetting Curve Forecast across active concepts
  const forgettingForecast = Object.entries(learner.domainMastery).slice(0, 6).map(([key, mastery]) => {
    // R = e^(-t/S)
    const stabilityDays = Math.max(1, Math.round(mastery * 14));
    return {
      concept: key.replace(/_/g, " "),
      currentMastery: Math.round(mastery * 100),
      projectedIn7Days: Math.round(mastery * Math.exp(-7 / stabilityDays) * 100),
      stabilityDays,
      needsReview: mastery * Math.exp(-7 / stabilityDays) < 0.55
    };
  });

  res.json({
    cognitiveMetrics: learner.cognitiveMetrics,
    radar,
    forgettingForecast,
    recentTelemetry: learner.recentTelemetry,
    xp: learner.xp,
    level: learner.level,
    streak: learner.streak
  });
});

// --- Educator Studio Endpoints ---
router.get("/educator/cohort", (req, res) => {
  const store = getStore();
  res.json({ cohort: store.cohortTelemetry });
});

router.post("/educator/create-question", (req, res) => {
  const store = getStore();
  const { conceptId, difficulty, bloomLevel, title, questionText, codeSnippet, options, hints } = req.body;

  if (!conceptId || !title || !questionText || !options || options.length < 2) {
    return res.status(400).json({ error: "Missing required question fields" });
  }

  const newQuestion = {
    id: `q_custom_${uuidv4().substring(0, 8)}`,
    conceptId,
    difficulty: parseFloat(difficulty) || 0.5,
    discrimination: 1.3,
    guessing: 0.25,
    bloomLevel: bloomLevel || "Application",
    title,
    questionText,
    codeSnippet: codeSnippet || null,
    options: options.map((opt, idx) => ({
      id: `opt_${idx + 1}`,
      text: opt.text,
      isCorrect: Boolean(opt.isCorrect),
      explanation: opt.explanation || "Standard feedback explanation.",
      misconceptionType: opt.misconceptionType || null
    })),
    hints: hints && hints.length > 0 ? hints : ["Review the core definition and examine edge cases."]
  };

  store.questions.push(newQuestion);
  saveStore();

  res.json({ success: true, question: newQuestion });
});

export default router;
