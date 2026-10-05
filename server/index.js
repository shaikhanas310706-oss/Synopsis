import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import apiRoutes from "./routes/api.js";
import { initStore } from "./data/store.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize data persistence store
initStore();

// Middlewares
app.use(cors({ origin: "*" }));
app.use(express.json());

// Request logger for dev insights
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use("/api", apiRoutes);

// Root greeting
app.get("/", (req, res) => {
  res.json({
    name: "SynapseIQ AI Adaptive Learning Engine",
    version: "1.0.0",
    docs: "/api/health"
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server Unhandled Error:", err);
  res.status(500).json({ error: "Internal Server Error", message: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 SynapseIQ Adaptive Server running on http://localhost:${PORT}`);
});
