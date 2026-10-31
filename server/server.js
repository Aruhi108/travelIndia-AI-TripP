const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Load env vars from server/.env or current working directory .env
dotenv.config({ path: path.join(__dirname, ".env") });
dotenv.config();

// Import routes
const authRoutes = require("./routes/auth");
const aiRoutes = require("./routes/ai");
const tripsRoutes = require("./routes/trips");
const adminRoutes = require("./routes/admin");

const app = express();

// Middleware - Robust CORS for public deployments & local dev
const corsOptions = {
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root health check endpoint for deployment monitoring
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "TravelIndia AI Trip Planner API is online",
    version: "1.0.0",
    health: "/api/health"
  });
});

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Database connection with smart auto-fallback
const primaryUri = process.env.MONGODB_URI;
const localFallbackUri = "mongodb://127.0.0.1:27017/travelindia";

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;
  if (primaryUri) {
    try {
      console.log("🔄 Connecting to configured MongoDB...");
      await mongoose.connect(primaryUri, { serverSelectionTimeoutMS: 4000 });
      console.log("✅ MongoDB Connected Successfully!");
      return;
    } catch (err) {
      console.warn(`⚠️ Primary MongoDB connection failed (${err.message}).`);
    }
  }

  // Fallback to local MongoDB
  try {
    console.log("🔄 Connecting to local MongoDB (127.0.0.1:27017)...");
    await mongoose.connect(localFallbackUri, { serverSelectionTimeoutMS: 4000 });
    console.log("✅ Connected to Local MongoDB Successfully!");
  } catch (localErr) {
    console.error("❌ Both Primary and Local MongoDB connections failed:", localErr.message);
  }
};

connectDB();

// Middleware to ensure DB connection is ready on serverless calls
app.use(async (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    await connectDB();
  }
  next();
});

// Routes - Mounted on both /api and root prefix for resilience with reverse proxies & serverless
app.use("/api/auth", authRoutes);
app.use("/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/ai", aiRoutes);
app.use("/api/trips", tripsRoutes);
app.use("/trips", tripsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/admin", adminRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    geminiKeyConfigured: !!process.env.GEMINI_API_KEY
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal Server Error",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.path}`,
  });
});

const PORT = process.env.PORT || 5005;
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 API available at http://localhost:${PORT}/api`);
  });
}

module.exports = app;
