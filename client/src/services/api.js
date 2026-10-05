const API_BASE = "/api";

export const api = {
  // Curriculum
  async getCurriculum() {
    const res = await fetch(`${API_BASE}/curriculum`);
    if (!res.ok) throw new Error("Failed to load curriculum");
    return res.json();
  },

  // User & Profile
  async getUserProfile() {
    const res = await fetch(`${API_BASE}/user/profile`);
    if (!res.ok) throw new Error("Failed to load user profile");
    return res.json();
  },

  async switchRole(role) {
    const res = await fetch(`${API_BASE}/user/switch-role`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role })
    });
    if (!res.ok) throw new Error("Failed to switch role");
    return res.json();
  },

  // Adaptive Diagnostic Engine
  async getNextAdaptiveQuestion(conceptId, answeredQuestionIds = []) {
    const res = await fetch(`${API_BASE}/adaptive/next-question`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conceptId, answeredQuestionIds })
    });
    if (!res.ok) throw new Error("Failed to fetch adaptive question");
    return res.json();
  },

  async submitAnswer(questionId, selectedOptionId, confidence, conceptId) {
    const res = await fetch(`${API_BASE}/adaptive/submit-answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId, selectedOptionId, confidence, conceptId })
    });
    if (!res.ok) throw new Error("Failed to submit answer");
    return res.json();
  },

  // Socratic AI Tutor
  async sendTutorMessage(message, conceptId, questionContext = null, apiKey = null) {
    const res = await fetch(`${API_BASE}/tutor/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, conceptId, questionContext, apiKey })
    });
    if (!res.ok) throw new Error("Failed to communicate with tutor");
    return res.json();
  },

  // Spaced Repetition (SRS)
  async getSrsCards() {
    const res = await fetch(`${API_BASE}/srs/cards`);
    if (!res.ok) throw new Error("Failed to fetch SRS cards");
    return res.json();
  },

  async reviewSrsCard(cardId, rating) {
    const res = await fetch(`${API_BASE}/srs/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cardId, rating })
    });
    if (!res.ok) throw new Error("Failed to review card");
    return res.json();
  },

  // Student Analytics
  async getStudentAnalytics() {
    const res = await fetch(`${API_BASE}/analytics/student`);
    if (!res.ok) throw new Error("Failed to fetch analytics");
    return res.json();
  },

  // Educator Studio
  async getEducatorCohort() {
    const res = await fetch(`${API_BASE}/educator/cohort`);
    if (!res.ok) throw new Error("Failed to fetch cohort data");
    return res.json();
  },

  async createQuestion(questionData) {
    const res = await fetch(`${API_BASE}/educator/create-question`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(questionData)
    });
    if (!res.ok) throw new Error("Failed to create question");
    return res.json();
  }
};
