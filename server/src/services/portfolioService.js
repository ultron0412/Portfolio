import mongoose from "mongoose";
import { defaultPortfolio } from "../data/defaultPortfolio.js";
import { Portfolio } from "../models/Portfolio.js";

function sortByOrder(collection = []) {
  return [...collection].sort((a, b) => (a.order || 0) - (b.order || 0));
}

function normalizeSkills(skills) {
  if (!skills) return new Map();
  if (skills instanceof Map) return skills;
  return new Map(Object.entries(skills));
}

function normalizePortfolio(portfolio) {
  if (!portfolio) return portfolio;

  const normalized = {
    ...portfolio,
    experience: sortByOrder(portfolio.experience),
    projects: sortByOrder(portfolio.projects),
    education: sortByOrder(portfolio.education),
    certifications: sortByOrder(portfolio.certifications),
  };

  if (portfolio.skills instanceof Map) {
    normalized.skills = Object.fromEntries(portfolio.skills.entries());
  }

  return normalized;
}

export async function getPortfolio() {
  const portfolio = await Portfolio.findOne({ isActive: true }).sort({ updatedAt: -1 }).lean();
  if (!portfolio) {
    return normalizePortfolio(defaultPortfolio);
  }
  return normalizePortfolio(portfolio);
}

export async function createPortfolio(payload) {
  const created = await Portfolio.create({
    ...payload,
    skills: normalizeSkills(payload.skills),
    isActive: payload.isActive ?? true,
  });
  return normalizePortfolio(created.toObject());
}

export async function updatePortfolio(portfolioId, payload) {
  if (!mongoose.Types.ObjectId.isValid(portfolioId)) {
    const error = new Error("Invalid portfolio id.");
    error.statusCode = 400;
    throw error;
  }

  const updated = await Portfolio.findByIdAndUpdate(
    portfolioId,
    { ...payload, ...(payload.skills ? { skills: normalizeSkills(payload.skills) } : {}) },
    { new: true, runValidators: true },
  );

  if (!updated) {
    const error = new Error("Portfolio not found.");
    error.statusCode = 404;
    throw error;
  }

  return normalizePortfolio(updated.toObject());
}

export async function deletePortfolioSectionItem(portfolioId, section, itemId) {
  if (!mongoose.Types.ObjectId.isValid(portfolioId) || !mongoose.Types.ObjectId.isValid(itemId)) {
    const error = new Error("Invalid identifier.");
    error.statusCode = 400;
    throw error;
  }

  const allowedSections = ["experience", "projects", "education", "certifications"];
  if (!allowedSections.includes(section)) {
    const error = new Error("Unsupported section for delete.");
    error.statusCode = 400;
    throw error;
  }

  const portfolio = await Portfolio.findById(portfolioId);
  if (!portfolio) {
    const error = new Error("Portfolio not found.");
    error.statusCode = 404;
    throw error;
  }

  const sectionItems = portfolio[section] || [];
  portfolio[section] = sectionItems.filter((item) => item._id.toString() !== itemId);
  await portfolio.save();

  return normalizePortfolio(portfolio.toObject());
}

export async function seedPortfolio({ overwrite = false } = {}) {
  const existing = await Portfolio.findOne({ isActive: true });
  if (existing && !overwrite) {
    return existing;
  }

  if (overwrite) {
    await Portfolio.deleteMany({});
  }

  const seedPayload = {
    ...defaultPortfolio,
    skills: normalizeSkills(defaultPortfolio.skills),
    isActive: true,
  };

  const created = await Portfolio.create(seedPayload);
  return created;
}
