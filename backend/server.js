require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const postRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:5173",
  "https://sprint-11-bice.vercel.app",
  ...(process.env.FRONTEND_URL || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS: frontend origin is not authorized"));
    }
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Sprint 11 API is running",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

app.get("/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

app.use((error, req, res, next) => {
  if (error.message?.startsWith("CORS:")) {
    return res.status(403).json({ message: error.message });
  }
  if (error.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ message: "Image must be 5MB or smaller" });
  }
  console.error("Unhandled server error:", error);
  res.status(500).json({ message: "Internal server error" });
});

const startServer = async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI is missing. Add it to your .env file.");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Atlas connected successfully.");
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  } catch (error) {
    console.error("Startup error:", error.message);
    process.exit(1);
  }
};

startServer();
