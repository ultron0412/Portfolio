import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import { env } from "../config/env.js";
import { User } from "../models/User.js";

function createToken(userId) {
  return jwt.sign({ userId }, env.jwtSecret, { expiresIn: env.jwtExpire });
}

function throwValidationError(req) {
  const result = validationResult(req);
  if (result.isEmpty()) {
    return;
  }

  const error = new Error(result.array()[0]?.msg || "Validation failed.");
  error.statusCode = 400;
  throw error;
}

export async function login(req, res, next) {
  try {
    throwValidationError(req);

    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();
    const password = String(req.body.password || "");

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = createToken(user._id.toString());
    res.json({
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function me(req, res, next) {
  try {
    res.json({
      data: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (error) {
    next(error);
  }
}
