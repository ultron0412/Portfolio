import mongoose from "mongoose";

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 160 },
    subject: { type: String, required: true, trim: true, maxlength: 160 },
    message: { type: String, required: true, trim: true, maxlength: 4000 },
    source: { type: String, default: "portfolio", trim: true },
  },
  { timestamps: true },
);

export const ContactMessage = mongoose.model("ContactMessage", contactMessageSchema);
