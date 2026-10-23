const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth");
const donorRoutes = require("./routes/donors");
const requestRoutes = require("./routes/requests");

const app = express();
app.use(cors());
app.use(express.json());

// Cached DB connection helper for Serverless / Local environments
async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI environment variable is missing.");
    return;
  }
  try {
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
  }
}

// Connect on startup
connectDB();

// Database connection check middleware
app.use("/api", async (req, res, next) => {
  if (req.path === "/health") return next();
  if (mongoose.connection.readyState !== 1) {
    await connectDB();
  }
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: "Database not connected. Please verify your MongoDB Atlas connection and ensure 0.0.0.0/0 is whitelisted in Atlas Network Access."
    });
  }
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/donors", donorRoutes);
app.use("/api/requests", requestRoutes);

app.get("/api/health", (req, res) => res.json({
  status: "ok",
  database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
}));

const PORT = process.env.PORT || 5000;

// Listen when run directly as entry script (local standalone development)
if (require.main === module) {
  app.listen(PORT, () => console.log(`LifeLink API running on port ${PORT}`));
}

module.exports = app;
