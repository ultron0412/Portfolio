import { env } from "../config/env.js";

export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(error, _req, res, _next) {
  const statusCode = error.statusCode || error.status || 500;

  res.status(statusCode).json({
    message: statusCode === 500 ? "Internal server error" : error.message,
    ...(env.nodeEnv === "development" ? { stack: error.stack } : {}),
  });
}
