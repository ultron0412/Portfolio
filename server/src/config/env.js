import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();
const configDir = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(configDir, "..", "..", ".env") });

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  mongoUri:
    process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ayush_portfolio",
  jwtSecret: process.env.JWT_SECRET || "change-this-secret-in-production",
  jwtExpire: process.env.JWT_EXPIRE || "7d",
  clientOrigins: (
    process.env.FRONTEND_URL ||
    process.env.CLIENT_ORIGIN ||
    "http://localhost:8080,http://localhost:5173"
  )
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
};
