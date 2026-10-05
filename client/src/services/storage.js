// LocalStorage Service for AI Adaptive Learning Platform
// Handles demo authentication, user profile, course progress, and quiz history.

const STORAGE_KEYS = {
  USER: "ai_alp_user",
  AUTH_STATE: "ai_alp_is_logged_in",
  SUBJECT_SCORES: "ai_alp_subject_scores",
  QUIZ_HISTORY: "ai_alp_quiz_history",
  COURSE_PROGRESS: "ai_alp_course_progress",
  WEEKLY_ACTIVITY: "ai_alp_weekly_activity",
  COMPLETED_LESSONS: "ai_alp_completed_lessons",
  CUSTOM_COURSES: "ai_alp_custom_courses",
  DOUBTS_HISTORY: "ai_alp_doubts_history"
};

// Default Demo Student Profile as specified in requirements
export const DEMO_STUDENT = {
  name: "Anas Shaikh",
  email: "anas.shaikh@college.edu",
  educationLevel: "B.Tech Computer Science (3rd Year)",
  subjects: [
    "Python",
    "DBMS",
    "Computer Networks",
    "Cloud Computing",
    "Artificial Intelligence"
  ],
  streakDays: 5,
  learningHours: 24.5,
  completedLessonsCount: 18,
  totalCoursesCount: 6,
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
};

// Default Realistic Subject Scores
// Rule-based classification:
// Strong >= 80% (Python: 82%, AI: 88%)
// Average 50%-79% (DBMS: 68%, Cloud Computing: 76%)
// Weak < 50% (Computer Networks: 45%)
export const DEFAULT_SUBJECT_SCORES = {
  "Python": 82,
  "DBMS": 68,
  "Computer Networks": 45,
  "Cloud Computing": 76,
  "Artificial Intelligence": 88
};

// Initial Course Progress
export const DEFAULT_COURSE_PROGRESS = {
  "cn-101": { courseId: "cn-101", title: "Computer Networks", completedLessons: ["l1"], totalLessons: 6, progress: 16 },
  "py-101": { courseId: "py-101", title: "Python Programming", completedLessons: ["l1", "l2", "l3", "l4"], totalLessons: 6, progress: 66 },
  "db-101": { courseId: "db-101", title: "Database Management (DBMS)", completedLessons: ["l1", "l2"], totalLessons: 5, progress: 40 },
  "ai-101": { courseId: "ai-101", title: "Artificial Intelligence", completedLessons: ["l1", "l2", "l3", "l4", "l5"], totalLessons: 6, progress: 83 },
  "cc-101": { courseId: "cc-101", title: "Cloud Computing", completedLessons: ["l1", "l2", "l3"], totalLessons: 5, progress: 60 },
  "dsa-101": { courseId: "dsa-101", title: "Data Structures & Algorithms", completedLessons: ["l1"], totalLessons: 6, progress: 17 }
};

// Default Initial Quiz History
export const DEFAULT_QUIZ_HISTORY = [
  {
    id: "q_init_1",
    subject: "Artificial Intelligence",
    quizTitle: "Search Algorithms & Heuristics",
    score: 9,
    totalQuestions: 10,
    percentage: 88,
    date: "2026-09-20",
    status: "Strong"
  },
  {
    id: "q_init_2",
    subject: "Python",
    quizTitle: "OOP & Functional Programming",
    score: 8,
    totalQuestions: 10,
    percentage: 82,
    date: "2026-09-18",
    status: "Strong"
  },
  {
    id: "q_init_3",
    subject: "Cloud Computing",
    quizTitle: "AWS/Azure Architecture & S3",
    score: 7,
    totalQuestions: 10,
    percentage: 76,
    date: "2026-09-15",
    status: "Average"
  },
  {
    id: "q_init_4",
    subject: "DBMS",
    quizTitle: "SQL Joins, Normalization & ACID",
    score: 7,
    totalQuestions: 10,
    percentage: 68,
    date: "2026-09-12",
    status: "Average"
  },
  {
    id: "q_init_5",
    subject: "Computer Networks",
    quizTitle: "OSI Model & TCP/IP Protocol Stack",
    score: 4,
    totalQuestions: 10,
    percentage: 45,
    date: "2026-09-10",
    status: "Weak"
  }
];

// Weekly Learning Activity (Hours & Lessons per day)
export const DEFAULT_WEEKLY_ACTIVITY = [
  { day: "Mon", hours: 3.5, lessons: 4, score: 85 },
  { day: "Tue", hours: 2.0, lessons: 2, score: 70 },
  { day: "Wed", hours: 4.5, lessons: 5, score: 90 },
  { day: "Thu", hours: 1.5, lessons: 2, score: 65 },
  { day: "Fri", hours: 3.0, lessons: 3, score: 80 },
  { day: "Sat", hours: 5.0, lessons: 6, score: 88 },
  { day: "Sun", hours: 4.0, lessons: 4, score: 78 }
];

export const storageService = {
  // Initialize storage if empty
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.USER)) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(DEMO_STUDENT));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SUBJECT_SCORES)) {
      localStorage.setItem(STORAGE_KEYS.SUBJECT_SCORES, JSON.stringify(DEFAULT_SUBJECT_SCORES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.COURSE_PROGRESS)) {
      localStorage.setItem(STORAGE_KEYS.COURSE_PROGRESS, JSON.stringify(DEFAULT_COURSE_PROGRESS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.QUIZ_HISTORY)) {
      localStorage.setItem(STORAGE_KEYS.QUIZ_HISTORY, JSON.stringify(DEFAULT_QUIZ_HISTORY));
    }
    if (!localStorage.getItem(STORAGE_KEYS.WEEKLY_ACTIVITY)) {
      localStorage.setItem(STORAGE_KEYS.WEEKLY_ACTIVITY, JSON.stringify(DEFAULT_WEEKLY_ACTIVITY));
    }
    if (localStorage.getItem(STORAGE_KEYS.AUTH_STATE) === null) {
      // Default logged in as demo student so preview works immediately
      localStorage.setItem(STORAGE_KEYS.AUTH_STATE, "true");
    }
  },

  // Auth
  isLoggedIn() {
    return localStorage.getItem(STORAGE_KEYS.AUTH_STATE) === "true";
  },

  login(email, password, remember = true) {
    const user = this.getUser();
    localStorage.setItem(STORAGE_KEYS.AUTH_STATE, "true");
    return { success: true, user };
  },

  signup(userData) {
    const newUser = {
      ...DEMO_STUDENT,
      name: userData.fullName || "Student",
      email: userData.email,
      educationLevel: userData.educationLevel || "Undergraduate",
      subjects: userData.subjects || DEMO_STUDENT.subjects
    };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
    localStorage.setItem(STORAGE_KEYS.AUTH_STATE, "true");
    return { success: true, user: newUser };
  },

  logout() {
    localStorage.setItem(STORAGE_KEYS.AUTH_STATE, "false");
  },

  // User Profile
  getUser() {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : DEMO_STUDENT;
  },

  updateUser(updatedFields) {
    const current = this.getUser();
    const updated = { ...current, ...updatedFields };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
    return updated;
  },

  // Subject Scores (Feeds Adaptive Learning Engine)
  getSubjectScores() {
    const data = localStorage.getItem(STORAGE_KEYS.SUBJECT_SCORES);
    return data ? JSON.parse(data) : DEFAULT_SUBJECT_SCORES;
  },

  updateSubjectScore(subject, newScore) {
    const scores = this.getSubjectScores();
    scores[subject] = Math.round(newScore);
    localStorage.setItem(STORAGE_KEYS.SUBJECT_SCORES, JSON.stringify(scores));
    return scores;
  },

  // Quiz History
  getQuizHistory() {
    const data = localStorage.getItem(STORAGE_KEYS.QUIZ_HISTORY);
    return data ? JSON.parse(data) : DEFAULT_QUIZ_HISTORY;
  },

  saveQuizResult(quizResult) {
    const history = this.getQuizHistory();
    const newEntry = {
      id: "q_" + Date.now(),
      date: new Date().toISOString().split("T")[0],
      ...quizResult
    };
    history.unshift(newEntry);
    localStorage.setItem(STORAGE_KEYS.QUIZ_HISTORY, JSON.stringify(history));

    // Update subject score with weighted average
    if (quizResult.subject && typeof quizResult.percentage === "number") {
      const currentScores = this.getSubjectScores();
      const prevScore = currentScores[quizResult.subject] || 60;
      // 60% weight to recent quiz, 40% to prior knowledge
      const updatedScore = Math.round(prevScore * 0.4 + quizResult.percentage * 0.6);
      this.updateSubjectScore(quizResult.subject, updatedScore);
    }

    return newEntry;
  },

  // Course Progress
  getCourseProgress() {
    const data = localStorage.getItem(STORAGE_KEYS.COURSE_PROGRESS);
    return data ? JSON.parse(data) : DEFAULT_COURSE_PROGRESS;
  },

  markLessonComplete(courseId, lessonId) {
    const progressMap = this.getCourseProgress();
    const course = progressMap[courseId] || {
      courseId,
      title: "Course",
      completedLessons: [],
      totalLessons: 6,
      progress: 0
    };

    if (!course.completedLessons.includes(lessonId)) {
      course.completedLessons.push(lessonId);
      course.progress = Math.round((course.completedLessons.length / course.totalLessons) * 100);
      progressMap[courseId] = course;
      localStorage.setItem(STORAGE_KEYS.COURSE_PROGRESS, JSON.stringify(progressMap));

      // Also increment student's completed lessons count
      const user = this.getUser();
      user.completedLessonsCount = (user.completedLessonsCount || 0) + 1;
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    }

    return course;
  },

  // Weekly Activity Chart Data
  getWeeklyActivity() {
    const data = localStorage.getItem(STORAGE_KEYS.WEEKLY_ACTIVITY);
    return data ? JSON.parse(data) : DEFAULT_WEEKLY_ACTIVITY;
  },

  // Custom User-Added Courses
  getCustomCourses() {
    const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_COURSES);
    return data ? JSON.parse(data) : [];
  },

  saveCustomCourse(newCourse) {
    const courses = this.getCustomCourses();
    const courseWithId = {
      ...newCourse,
      id: newCourse.id || `custom-${Date.now()}`,
      isCustom: true,
      createdAt: new Date().toISOString()
    };
    courses.unshift(courseWithId);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_COURSES, JSON.stringify(courses));

    // Initialize progress for this custom course
    const progressMap = this.getCourseProgress();
    progressMap[courseWithId.id] = {
      courseId: courseWithId.id,
      title: courseWithId.title,
      completedLessons: [],
      totalLessons: courseWithId.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 1,
      progress: 0
    };
    localStorage.setItem(STORAGE_KEYS.COURSE_PROGRESS, JSON.stringify(progressMap));

    // Increment user total courses count
    const user = this.getUser();
    user.totalCoursesCount = (user.totalCoursesCount || 6) + 1;
    this.updateUser(user);

    return courseWithId;
  },

  deleteCustomCourse(courseId) {
    let courses = this.getCustomCourses();
    courses = courses.filter((c) => c.id !== courseId);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_COURSES, JSON.stringify(courses));

    const progressMap = this.getCourseProgress();
    delete progressMap[courseId];
    localStorage.setItem(STORAGE_KEYS.COURSE_PROGRESS, JSON.stringify(progressMap));
  },

  // Doubts History
  getDoubts() {
    const data = localStorage.getItem(STORAGE_KEYS.DOUBTS_HISTORY);
    if (data) return JSON.parse(data);

    // Initial realistic pre-seeded doubts
    const initialDoubts = [
      {
        id: "d_init_1",
        subject: "Computer Networks",
        title: "Why does TCP use a 3-way handshake instead of a 2-way handshake?",
        description: "If the server sends a SYN-ACK, why does the client still need to reply with an ACK before transferring data? Wouldn't a 2-way handshake be faster?",
        codeSnippet: "",
        resolvedAt: "2026-09-21T10:30:00Z",
        aiSolution: {
          conceptExplanation: "The 3-way handshake prevents stale, delayed duplicate connection requests from corrupting the server state.",
          detailedAnalysis: `If TCP used only a 2-way handshake:
1. Suppose a client sends a SYN packet that gets stuck in a congested network router.
2. The client times out, sends a new SYN, establishes a connection, transfers data, and closes it.
3. Later, the old, delayed SYN finally arrives at the server.
4. With a 2-way handshake, the server would immediately open a new connection upon replying with SYN-ACK and allocate buffers/sockets, believing the client wants to connect! But the client has already moved on.
5. In a 3-way handshake, the server waits for the client's final ACK before declaring the connection established. The client would recognize the old sequence number and send an RST (Reset) to discard it.`,
          keyTakeaway: "The 3-way handshake guarantees that BOTH sides mutually verify each other's sequence numbers and that the request is fresh and intentional.",
          practiceTip: "Review TCP sequence number synchronization in Module 1, Lesson 2."
        }
      },
      {
        id: "d_init_2",
        subject: "DBMS",
        title: "Difference between Primary Key and Unique Key constraints",
        description: "Both enforce uniqueness, so when exactly should I use Unique Key over Primary Key?",
        codeSnippet: "CREATE TABLE Students (\n    id INT PRIMARY KEY,\n    email VARCHAR(255) UNIQUE\n);",
        resolvedAt: "2026-09-19T14:15:00Z",
        aiSolution: {
          conceptExplanation: "A table can have only ONE Primary Key, and it strictly forbids NULL values. A table can have MULTIPLE Unique Keys, and Unique columns can accept NULL values (in standard SQL).",
          detailedAnalysis: `**Comparison Table:**
- **Primary Key:** Sole clustered index (by default), mandatory identification of the tuple, NOT NULL guaranteed.
- **Unique Key:** Non-clustered index, allows business identifiers (like Email, Passport No, Phone) to be unique while permitting optional entries (NULL).`,
          keyTakeaway: "Use Primary Key for the immutable internal record identifier (like surrogate ID or roll number); use Unique Key for external natural identifiers like email.",
          practiceTip: "Check DBMS Normalization (2NF/3NF) where candidate keys are evaluated."
        }
      }
    ];

    localStorage.setItem(STORAGE_KEYS.DOUBTS_HISTORY, JSON.stringify(initialDoubts));
    return initialDoubts;
  },

  saveDoubt(doubt) {
    const doubts = this.getDoubts();
    const newDoubt = {
      id: `d_${Date.now()}`,
      resolvedAt: new Date().toISOString(),
      ...doubt
    };
    doubts.unshift(newDoubt);
    localStorage.setItem(STORAGE_KEYS.DOUBTS_HISTORY, JSON.stringify(doubts));
    return newDoubt;
  },

  deleteDoubt(doubtId) {
    let doubts = this.getDoubts();
    doubts = doubts.filter((d) => d.id !== doubtId);
    localStorage.setItem(STORAGE_KEYS.DOUBTS_HISTORY, JSON.stringify(doubts));
  },

  // Reset to default demo data
  resetDemoData() {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(DEMO_STUDENT));
    localStorage.setItem(STORAGE_KEYS.SUBJECT_SCORES, JSON.stringify(DEFAULT_SUBJECT_SCORES));
    localStorage.setItem(STORAGE_KEYS.COURSE_PROGRESS, JSON.stringify(DEFAULT_COURSE_PROGRESS));
    localStorage.setItem(STORAGE_KEYS.QUIZ_HISTORY, JSON.stringify(DEFAULT_QUIZ_HISTORY));
    localStorage.setItem(STORAGE_KEYS.WEEKLY_ACTIVITY, JSON.stringify(DEFAULT_WEEKLY_ACTIVITY));
    localStorage.removeItem(STORAGE_KEYS.CUSTOM_COURSES);
    localStorage.removeItem(STORAGE_KEYS.DOUBTS_HISTORY);
    localStorage.setItem(STORAGE_KEYS.AUTH_STATE, "true");
  }
};


// Auto initialize on module import
storageService.init();
