import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import path from "node:path";
import rateLimit from "express-rate-limit";
import { fileURLToPath } from "node:url";
import { env } from "./config/env.js";
import { authRoutes } from "./routes/authRoutes.js";
import { contactRoutes } from "./routes/contactRoutes.js";
import { healthRoutes } from "./routes/healthRoutes.js";
import { portfolioRoutes } from "./routes/portfolioRoutes.js";
import { uploadRoutes } from "./routes/uploadRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

export const app = express();
const serverRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

app.set("trust proxy", 1);
app.use(helmet());
app.use(
  cors({
    origin: env.clientOrigins,
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 200,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

app.use("/uploads", express.static(path.resolve(serverRoot, "uploads")));

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/upload", uploadRoutes);

app.use(notFound);
app.use(errorHandler);
