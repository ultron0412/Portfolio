import { Router } from "express";
import { body } from "express-validator";
import { login, me } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

export const authRoutes = Router();

authRoutes.post(
  "/login",
  [
    body("email").trim().isEmail().withMessage("Valid email is required."),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters."),
  ],
  login,
);

authRoutes.get("/me", protect, me);
