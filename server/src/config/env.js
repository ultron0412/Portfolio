import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();
const configDir = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(configDir, "..", "..", ".env") });

const nodeEnv = process.env.NODE_ENV || "development";
const isProduction = nodeEnv === "production";
const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || "";

if (!mongoUri && isProduction) {
  throw new Error("Missing MONGODB_URI (or MONGO_URI) in production environment.");
}

const jwtSecret = process.env.JWT_SECRET || "change-this-secret-in-production";
if (isProduction && jwtSecret === "change-this-secret-in-production") {
  console.warn("Warning: JWT_SECRET is using the default insecure value.");
}

const clientOriginsRaw =
  process.env.FRONTEND_URL || process.env.CLIENT_ORIGIN || "http://localhost:8080,http://localhost:5173";

export const env = {
  nodeEnv,
  port: Number(process.env.PORT || 5000),
  mongoUri: mongoUri || "mongodb://127.0.0.1:27017/ayush_portfolio",
  jwtSecret,
  jwtExpire: process.env.JWT_EXPIRE || "7d",
  clientOrigins: clientOriginsRaw
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
};
