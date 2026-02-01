import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { PrismaClient } from "@prisma/client";
import { linksRoutes, redirectRoutes } from "@routes/index";
import { errorHandler, notFoundHandler } from "@middleware/error.middleware";
import { initRedis } from "@services/cache.service";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
);

// Parse JSON bodies
app.use(express.json());

// Trust proxy (for rate limiting behind reverse proxy)
app.set("trust proxy", 1);

// Health check endpoint
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API routes
app.use("/api/links", linksRoutes);

// Redirect routes (must be after API routes)
app.use("/", redirectRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../dist")));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(__dirname, "../../dist/index.html"));
  });
}

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

// Database connections
async function connectDatabases(): Promise<void> {
  // Connect to MongoDB
  const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/shortlink";
  await mongoose.connect(mongoUri);
  console.log("MongoDB connected");

  // Test Prisma connection
  await prisma.$connect();
  console.log("PostgreSQL connected");

  // Initialize Redis (non-blocking)
  await initRedis();
}

// Start server
async function start(): Promise<void> {
  try {
    await connectDatabases();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\nShutting down gracefully...");
  await prisma.$disconnect();
  await mongoose.disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\nShutting down gracefully...");
  await prisma.$disconnect();
  await mongoose.disconnect();
  process.exit(0);
});

start();
