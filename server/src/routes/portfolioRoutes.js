import { Router } from "express";
import { body } from "express-validator";
import {
  createPortfolioController,
  deletePortfolioSectionItemController,
  readPortfolio,
  seedPortfolioController,
  updatePortfolioController,
} from "../controllers/portfolioController.js";
import { protect } from "../middleware/authMiddleware.js";

const portfolioValidationRules = [
  body("personal.name").optional().trim().notEmpty().withMessage("Personal name is required."),
  body("personal.email").optional().isEmail().withMessage("Personal email must be valid."),
  body("summary").optional().isString().trim(),
  body("experience").optional().isArray(),
  body("projects").optional().isArray(),
  body("skills").optional().isObject(),
  body("education").optional().isArray(),
  body("certifications").optional().isArray(),
  body("isActive").optional().isBoolean(),
];

export const portfolioRoutes = Router();

portfolioRoutes.get("/", readPortfolio);

portfolioRoutes.post("/", protect, portfolioValidationRules, createPortfolioController);
portfolioRoutes.put("/:id", protect, portfolioValidationRules, updatePortfolioController);
portfolioRoutes.delete("/:id/:section/:itemId", protect, deletePortfolioSectionItemController);

portfolioRoutes.post("/seed", protect, seedPortfolioController);
