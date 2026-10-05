import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import MyLearning from "./pages/MyLearning";
import Quizzes from "./pages/Quizzes";
import Quiz from "./pages/Quiz";
import Recommendations from "./pages/Recommendations";
import StudyAssistant from "./pages/StudyAssistant";
import DoubtSolver from "./pages/DoubtSolver";
import Progress from "./pages/Progress";
import Profile from "./pages/Profile";
import { storageService } from "./services/storage";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(storageService.isLoggedIn());

  const handleAuthChange = () => {
    setIsLoggedIn(storageService.isLoggedIn());
  };

  return (
    <Router>
      <Routes>
        {/* Public Landing & Auth Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLoginSuccess={handleAuthChange} />} />
        <Route path="/signup" element={<Signup onSignupSuccess={handleAuthChange} />} />

        {/* Dashboard & Core Platform Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetails />} />
        <Route path="/my-learning" element={<MyLearning />} />
        <Route path="/quizzes" element={<Quizzes />} />
        <Route path="/quiz/:id" element={<Quiz />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/study-assistant" element={<StudyAssistant />} />
        <Route path="/doubt-solver" element={<DoubtSolver />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/profile" element={<Profile />} />


        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
