import { ContactMessage } from "../models/ContactMessage.js";

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function createContactMessage(req, res, next) {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();
    const subject = String(req.body.subject || "").trim();
    const message = String(req.body.message || "").trim();

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "Name, email, subject, and message are required." });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Please provide a valid email address." });
    }

    const contactMessage = await ContactMessage.create({ name, email, subject, message });

    res.status(201).json({
      data: {
        id: contactMessage._id,
        createdAt: contactMessage.createdAt,
      },
      message: "Message received.",
    });
  } catch (error) {
    next(error);
  }
}
