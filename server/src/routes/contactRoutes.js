import { Router } from "express";
import rateLimit from "express-rate-limit";
import { createContactMessage } from "../controllers/contactController.js";

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
});

export const contactRoutes = Router();

contactRoutes.post("/", contactLimiter, createContactMessage);
