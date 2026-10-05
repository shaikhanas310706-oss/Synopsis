// Adaptive Learning Engine (Rule-Based AI Personalization)
// Analyzes student performance across subjects and dynamically classifies
// competencies into Strong (>=80%), Average (50-79%), and Weak (<50%).

import { storageService } from "./storage";

export const PERFORMANCE_THRESHOLDS = {
  STRONG_MIN: 80,
  AVERAGE_MIN: 50
};

// Recommended modules mapped by topic and level
const TOPIC_KNOWLEDGE_BASE = {
  "Computer Networks": {
    weakFocus: "OSI 7-Layer Model & Subnetting Basics",
    weakAction: "Your Computer Networks score is 45% (Weak Area). We strongly recommend revising the OSI 7-layer architecture and TCP/IP handshakes before attempting your next quiz.",
    averageAction: "You have a fair understanding of Computer Networks (60%). Focus on routing protocols (OSPF, BGP) and DNS resolution to boost your mastery.",
    strongAction: "Exceptional mastery in Computer Networks! You are ready to explore Software Defined Networking (SDN) and Network Security.",
    lessonSlug: "cn-101",
    subTopics: ["Physical & Data Link Layers", "IPv4/IPv6 Subnetting", "TCP vs UDP Handshakes", "DNS & HTTP/HTTPS"]
  },
  "Python": {
    weakFocus: "Control Flow, Lists & Functions",
    weakAction: "Python score is below 50%. Focus on basic syntax, list comprehensions, and function scopes with step-by-step interactive exercises.",
    averageAction: "Python is on track at Average level. Solidify Object-Oriented Programming (Classes, Inheritance) and Exception Handling.",
    strongAction: "You are excelling in Python (82%)! Progress to Generators, Decorators, and Vectorized Data Analysis.",
    lessonSlug: "py-101",
    subTopics: ["Variables & Loops", "Functions & Scope", "OOP Principles", "Decorators & Generators"]
  },
  "DBMS": {
    weakFocus: "Relational Algebra & Normal Forms",
    weakAction: "DBMS score is currently low. Revise ER diagrams, primary/foreign key constraints, and 1NF/2NF/3NF Normalization.",
    averageAction: "Your DBMS score is 68% (Average). Strengthen SQL Multi-Table Joins, Subqueries, and ACID Transaction Properties.",
    strongAction: "Great grasp of DBMS concepts! Dive into Query Optimization, B+ Tree Indexing, and NoSQL Document Stores.",
    lessonSlug: "db-101",
    subTopics: ["ER Modeling", "Normalization (1NF - BCNF)", "SQL Joins & Aggregates", "Transactions & Concurrency"]
  },
  "Cloud Computing": {
    weakFocus: "Virtualization & Cloud Service Models (IaaS/PaaS/SaaS)",
    weakAction: "Cloud fundamentals need reinforcement. Focus on virtualization, cloud deployment models, and shared responsibility frameworks.",
    averageAction: "Cloud Computing is solid at 76% (Average). Deepen your knowledge of Serverless Architectures, S3 Storage Classes, and VPCs.",
    strongAction: "Strong Cloud proficiency! Advance to Multi-Region High Availability, Kubernetes Orchestration, and Terraform IAC.",
    lessonSlug: "cc-101",
    subTopics: ["Cloud Fundamentals", "AWS/Azure Core Services", "Serverless Functions", "Cloud Security & IAM"]
  },
  "Artificial Intelligence": {
    weakFocus: "Problem Formulation & Uninformed Search",
    weakAction: "AI foundation is below threshold. Review State-Space search trees, Breadth-First and Depth-First algorithms.",
    averageAction: "Good progress in AI. Practice A* Heuristic Search, Minimax with Alpha-Beta Pruning, and Constraint Satisfaction.",
    strongAction: "Outstanding AI score (88%)! Ready to advance to Neural Networks, Deep Learning, and Transformer Attention mechanisms.",
    lessonSlug: "ai-101",
    subTopics: ["Heuristic Search (A*)", "Adversarial Search", "Knowledge Representation", "Neural Foundations"]
  },
  "Data Structures": {
    weakFocus: "Arrays, Linked Lists & Time Complexity",
    weakAction: "Data Structures score is below average. Revise Big-O notation, pointers, and Singly/Doubly Linked Lists.",
    averageAction: "Average performance in DSA. Practice Stack/Queue applications and Binary Search Tree traversals.",
    strongAction: "High proficiency in DSA! Tackle Graph algorithms (Dijkstra, Topological Sort) and Dynamic Programming.",
    lessonSlug: "dsa-101",
    subTopics: ["Arrays & Strings", "Linked Lists & Stacks", "Trees & Graphs", "Dynamic Programming"]
  }
};

export const adaptiveLearningService = {
  // Classify a single score
  classifyScore(score) {
    if (score >= PERFORMANCE_THRESHOLDS.STRONG_MIN) return "Strong";
    if (score >= PERFORMANCE_THRESHOLDS.AVERAGE_MIN) return "Average";
    return "Weak";
  },

  // Perform full analysis of active student data
  analyzeStudentPerformance() {
    const scores = storageService.getSubjectScores();
    const quizHistory = storageService.getQuizHistory();
    const courseProgress = storageService.getCourseProgress();

    const strongSubjects = [];
    const averageSubjects = [];
    const weakSubjects = [];

    Object.entries(scores).forEach(([subject, score]) => {
      const classification = this.classifyScore(score);
      const kb = TOPIC_KNOWLEDGE_BASE[subject] || {
        weakFocus: "Core Principles",
        weakAction: `Revisit foundational concepts in ${subject}.`,
        averageAction: `Complete practice problems in ${subject}.`,
        strongAction: `Advance to higher-order challenges in ${subject}.`,
        lessonSlug: "courses",
        subTopics: ["Foundations", "Intermediate", "Advanced"]
      };

      const item = {
        subject,
        score,
        classification,
        focusArea: classification === "Weak" ? kb.weakFocus : kb.subTopics[2] || kb.weakFocus,
        actionAdvice: classification === "Weak" ? kb.weakAction : classification === "Average" ? kb.averageAction : kb.strongAction,
        lessonSlug: kb.lessonSlug,
        subTopics: kb.subTopics
      };

      if (classification === "Strong") strongSubjects.push(item);
      else if (classification === "Average") averageSubjects.push(item);
      else weakSubjects.push(item);
    });

    // Calculate overall average across all subjects
    const totalScoreSum = Object.values(scores).reduce((a, b) => a + b, 0);
    const overallAverage = Math.round(totalScoreSum / Math.max(1, Object.keys(scores).length));

    // Dynamic Top Priority Recommendation
    let primaryRecommendation = null;
    if (weakSubjects.length > 0) {
      // Prioritize the weakest subject
      const lowest = [...weakSubjects].sort((a, b) => a.score - b.score)[0];
      primaryRecommendation = {
        type: "CRITICAL_REVIEW",
        severity: "weak",
        title: `Priority Review: ${lowest.subject}`,
        subject: lowest.subject,
        score: lowest.score,
        message: lowest.actionAdvice,
        suggestedAction: `Revise ${lowest.focusArea}`,
        courseId: lowest.lessonSlug,
        recommendedStep: "Step 1: Revisit Foundations & Take Diagnostic Practice"
      };
    } else if (averageSubjects.length > 0) {
      const lowestAvg = [...averageSubjects].sort((a, b) => a.score - b.score)[0];
      primaryRecommendation = {
        type: "TARGETED_PRACTICE",
        severity: "average",
        title: `Boost Your Score: ${lowestAvg.subject}`,
        subject: lowestAvg.subject,
        score: lowestAvg.score,
        message: lowestAvg.actionAdvice,
        suggestedAction: `Practice ${lowestAvg.focusArea}`,
        courseId: lowestAvg.lessonSlug,
        recommendedStep: "Step 2: Solve 10 Targeted Practice Problems"
      };
    } else {
      primaryRecommendation = {
        type: "MASTERY_ACCELERATION",
        severity: "strong",
        title: "Mastery Acceleration!",
        subject: strongSubjects[0]?.subject || "AI & Computing",
        score: strongSubjects[0]?.score || 90,
        message: "You have achieved Strong mastery across your current topics! You are ready for capstone projects and research papers.",
        suggestedAction: "Explore Advanced Topics",
        courseId: "courses",
        recommendedStep: "Unlock Capstone Project Challenges"
      };
    }

    // Dynamic 5-Step Recommended Learning Path
    const learningPathSubject = weakSubjects[0]?.subject || averageSubjects[0]?.subject || "Computer Networks";
    const learningPath = [
      {
        stepNumber: 1,
        title: "Revise Basics & Mental Models",
        description: `Revisit fundamental architecture of ${learningPathSubject}. Focus on ${TOPIC_KNOWLEDGE_BASE[learningPathSubject]?.weakFocus || "core building blocks"}.`,
        status: "in_progress",
        estimatedMinutes: 15,
        badgeText: "Foundational"
      },
      {
        stepNumber: 2,
        title: "Watch Recommended Concept Lesson",
        description: `Study the interactive visual breakdown with key concepts and notes in the ${learningPathSubject} module.`,
        status: "next",
        estimatedMinutes: 20,
        badgeText: "Visual Learning"
      },
      {
        stepNumber: 3,
        title: "Interactive Practice Questions",
        description: "Solve 5 guided scenario questions with step-by-step feedback to cement the theory.",
        status: "locked",
        estimatedMinutes: 15,
        badgeText: "Application"
      },
      {
        stepNumber: 4,
        title: "Take Adaptive Mini Quiz",
        description: "Verify your improved mastery. Score >= 80% to lift this subject out of the Weak classification.",
        status: "locked",
        estimatedMinutes: 10,
        badgeText: "Evaluation"
      },
      {
        stepNumber: 5,
        title: "Unlock Advanced Concept",
        description: `Automatically unlock higher-tier topics in ${learningPathSubject} and earn 100 XP.`,
        status: "locked",
        estimatedMinutes: 5,
        badgeText: "Milestone"
      }
    ];

    return {
      scores,
      overallAverage,
      strongSubjects,
      averageSubjects,
      weakSubjects,
      primaryRecommendation,
      learningPath,
      totalQuizzesTaken: quizHistory.length,
      recentPerformance: quizHistory.slice(0, 3)
    };
  }
};
