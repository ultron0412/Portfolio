import { validationResult } from "express-validator";
import {
  createPortfolio,
  deletePortfolioSectionItem,
  getPortfolio,
  seedPortfolio,
  updatePortfolio,
} from "../services/portfolioService.js";

function throwValidationError(req) {
  const result = validationResult(req);
  if (result.isEmpty()) {
    return;
  }

  const error = new Error(result.array()[0]?.msg || "Validation failed.");
  error.statusCode = 400;
  throw error;
}

export async function readPortfolio(_req, res, next) {
  try {
    const portfolio = await getPortfolio();
    res.json({ data: portfolio });
  } catch (error) {
    next(error);
  }
}

export async function createPortfolioController(req, res, next) {
  try {
    throwValidationError(req);
    const portfolio = await createPortfolio(req.body);
    res.status(201).json({ data: portfolio });
  } catch (error) {
    next(error);
  }
}

export async function updatePortfolioController(req, res, next) {
  try {
    throwValidationError(req);
    const portfolio = await updatePortfolio(req.params.id, req.body);
    res.json({ data: portfolio });
  } catch (error) {
    next(error);
  }
}

export async function deletePortfolioSectionItemController(req, res, next) {
  try {
    const portfolio = await deletePortfolioSectionItem(
      req.params.id,
      req.params.section,
      req.params.itemId,
    );
    res.json({ data: portfolio });
  } catch (error) {
    next(error);
  }
}

export async function seedPortfolioController(req, res, next) {
  try {
    const portfolio = await seedPortfolio({ overwrite: req.query.overwrite === "true" });
    res.status(201).json({ data: portfolio });
  } catch (error) {
    next(error);
  }
}
