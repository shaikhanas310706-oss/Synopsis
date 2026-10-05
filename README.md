# SynapseIQ — AI Adaptive Learning Platform

> A full-stack intelligent adaptive learning platform powered by **Item Response Theory (IRT 3PL)**, **Bayesian Knowledge Tracing (BKT)**, and **Socratic AI Tutoring**.

![SynapseIQ Architecture](https://img.shields.io/badge/Architecture-Full--Stack%20Vite%20%2B%20Express-cyan?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active%20%26%20Verified-emerald?style=for-the-badge)
![Theme](https://img.shields.io/badge/Design-Obsidian%20Glassmorphism-indigo?style=for-the-badge)

---

## 🌟 Core Innovations

1. **Item Response Theory (IRT 3-Parameter Logistic Model)**
   - Calibrates item difficulty ($b$), discrimination ($a$), and pseudo-guessing ($c$).
   - Maximizes Fisher Information to dynamically select questions right at the learner's **Zone of Proximal Development (ZPD)**.

2. **Bayesian Knowledge Tracing (BKT)**
   - Computes real-time latent concept mastery $P(L_{t+1})$ based on prior mastery, slip rates $P(S)$, guess rates $P(G)$, and transition probabilities $P(T)$.

3. **Metacognitive Calibration Engine**
   - Incorporates confidence ratings (*Low/Guessing*, *Medium/Reasoned*, *High/Certain*) before submission to detect and diagnose overconfidence traps and conceptual slips.

4. **Socratic AI Tutor ("Nova")**
   - Context-aware conversational AI embedded across lessons and quizzes.
   - Generates guided inquiries, analogies, and targeted counter-examples instead of dry textbook definitions.
   - Built-in heuristic reasoning engine (100% operational offline) with optional OpenAI/Gemini API key support.

5. **Spaced Repetition & Retention Forecasting**
   - **Ebbinghaus Forgetting Curve**: Forecasts 7-day memory decay ($R = e^{-t/S}$) with early-warning decay alerts.
   - **SuperMemo (SM-2)**: Interactive 3D flip card drills automatically generated from previous quiz mistakes.

6. **Interactive Code & Simulation Sandbox**
   - Live Python-like runtime simulation with instant test case evaluation and **Automated AI Code Review** (time complexity, tensor shapes, gradient flow analysis).

7. **Educator Studio & Curriculum Builder**
   - Class cohort telemetry: Class average mastery, active student counts, and at-risk drop-off warnings.
   - Concept bottleneck analysis highlighting concepts with highest failure rates and diagnosed misconceptions.
   - Live form for teachers to author and inject new calibrated questions directly into the database.

---

## 🚀 Quickstart Guide

### Prerequisites
- [Node.js](https://nodejs.org/) v18+ (tested on v24.18.0)
- npm v10+

### Starting Both Servers

From the root directory (`c:/Users/DELL/Desktop/Education`):

```bash
# Start backend server (Port 5000)
npm run server

# Start frontend dev server (Port 5173)
npm run client
```

Or run them individually:
```bash
# Terminal 1 - Backend
cd server
node index.js

# Terminal 2 - Frontend
cd client
npm run dev
```

### URLs
- **Web App**: [http://localhost:5173](http://localhost:5173)
- **REST API & Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 📁 Repository Structure

```
├── README.md                      # Project documentation
├── package.json                   # Root orchestrator scripts
├── server/                        # Backend REST API (Port 5000)
│   ├── package.json
│   ├── index.js                   # Express server entry point & CORS
│   ├── routes/
│   │   └── api.js                 # 14 REST endpoints
│   ├── engine/
│   │   ├── adaptiveEngine.js      # IRT 3PL, BKT, SM-2, Metacognition algorithms
│   │   └── aiTutorEngine.js       # Socratic reasoning engine + LLM integration
│   ├── data/
│   │   ├── seedData.js            # Comprehensive curricula & question banks
│   │   ├── store.js               # File-backed atomic persistence layer
│   │   └── db.json                # Atomic JSON database
│   └── test_api.mjs               # Automated verification test suite
└── client/                        # Frontend Single-Page App (Port 5173)
    ├── package.json
    ├── vite.config.js             # Vite config with /api proxy
    ├── index.html                 # Plus Jakarta Sans & JetBrains Mono fonts
    └── src/
        ├── index.css              # Bespoke Obsidian Glassmorphism Design System
        ├── main.jsx
        ├── App.jsx                # App shell, view routing, and state orchestration
        ├── utils/audio.js         # Web Audio API synthesizer chimes
        ├── services/api.js        # Centralized REST API client
        └── components/
            ├── Navbar.jsx         # Header with course switcher, learner stats, role toggle
            ├── SkillTree.jsx      # Interactive DAG skill map & BKT mastery bars
            ├── AdaptiveQuizModal.jsx # IRT testing modal with metacognitive confidence
            ├── SocraticTutor.jsx  # Floating conversational AI tutor ("Nova")
            ├── AnalyticsDashboard.jsx # SVG Radar, Forgetting curve, SM-2 flashcard deck
            ├── CodePlayground.jsx # Algorithmic code sandbox & AI reviewer
            └── EducatorStudio.jsx # Cohort metrics & adaptive item authoring
```

---

## 🧪 Running Automated Tests

Run the comprehensive 7-engine verification suite:

```bash
node server/test_api.mjs
```

This tests:
1. Health check endpoint
2. Curriculum & DAG dependency graph loading
3. IRT adaptive item selection (Fisher Information)
4. BKT mastery Bayesian update & Metacognitive Calibration
5. Socratic AI Tutor conversational generation
6. Cognitive Radar & Forgetting curve analytics
7. Educator cohort telemetry & bottleneck analysis
