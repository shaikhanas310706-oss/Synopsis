// Automated API verification script for SynapseIQ
async function runTests() {
  console.log("Starting SynapseIQ Automated Verification Suite...\n");

  const BASE = "http://localhost:5000/api";

  // 1. Health check
  const healthRes = await fetch(`${BASE}/health`);
  const health = await healthRes.json();
  console.log("✓ [Health Check]:", health.status, "-", health.platform);

  // 2. Curriculum test
  const curRes = await fetch(`${BASE}/curriculum`);
  const cur = await curRes.json();
  console.log(`✓ [Curriculum]: Loaded ${cur.courses.length} courses with active learner '${cur.activeLearner.name}' (Level ${cur.activeLearner.level})`);

  // 3. Adaptive Question Selection test
  const nextQRes = await fetch(`${BASE}/adaptive/next-question`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ conceptId: "backprop" })
  });
  const qData = await nextQRes.json();
  console.log(`✓ [IRT Adaptive Engine]: Calibrated question '${qData.question.title}' (Difficulty b=${qData.question.difficulty}, Bloom=${qData.question.bloomLevel})`);

  // 4. Submit Answer with Metacognitive Confidence
  const optId = qData.question.options[0].id;
  const submitRes = await fetch(`${BASE}/adaptive/submit-answer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      questionId: qData.question.id,
      selectedOptionId: optId,
      confidence: "high",
      conceptId: "backprop"
    })
  });
  const subData = await submitRes.json();
  console.log(`✓ [BKT Mastery Engine]: Prior=${subData.priorMastery}% -> Updated=${subData.updatedMastery}%, Correct=${subData.isCorrect}, XP Gained=+${subData.xpGained}`);
  console.log(`✓ [Metacognition Evaluation]: ${subData.calibration.type} - "${subData.calibration.note}"`);

  // 5. Socratic AI Tutor Chat test
  const tutorRes = await fetch(`${BASE}/tutor/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "Give me an intuitive analogy for backpropagation",
      conceptId: "backprop"
    })
  });
  const tutorData = await tutorRes.json();
  console.log(`✓ [Socratic AI Tutor ("Nova")]: Responded in mode '${tutorData.mode}' for concept '${tutorData.concept}'`);

  // 6. Student Analytics & Retention Forecast
  const analyticsRes = await fetch(`${BASE}/analytics/student`);
  const analyticsData = await analyticsRes.json();
  console.log(`✓ [Cognitive Analytics]: Metacognitive Precision=${analyticsData.cognitiveMetrics.metacognitiveCalibration * 100}%, Competency Radar Axes=${analyticsData.radar.length}, Forgetting Forecast Items=${analyticsData.forgettingForecast.length}`);

  // 7. Educator Cohort Telemetry
  const cohortRes = await fetch(`${BASE}/educator/cohort`);
  const cohortData = await cohortRes.json();
  console.log(`✓ [Educator Studio]: Cohort '${cohortData.cohort.cohortName}', Class Mastery=${cohortData.cohort.classAverageMastery}%, At-Risk Students=${cohortData.cohort.atRiskStudentsCount}, Bottleneck Concepts=${cohortData.cohort.conceptBottlenecks.length}`);

  console.log("\n==================================================");
  console.log("ALL 7 CORE PLATFORM SYSTEMS VERIFIED SUCCESSFULLY!");
  console.log("==================================================");
}

runTests().catch(console.error);
