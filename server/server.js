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

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Database connection with smart auto-fallback
const primaryUri = process.env.MONGODB_URI;
const localFallbackUri = "mongodb://127.0.0.1:27017/travelindia";

const connectDB = async () => {
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

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/trips", tripsRoutes);
app.use("/api/admin", adminRoutes);

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
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API available at http://localhost:${PORT}/api`);
});
