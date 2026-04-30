import fs from "node:fs";
import path from "node:path";
import { Router } from "express";
import multer from "multer";
import { uploadFile } from "../controllers/uploadController.js";
import { protect } from "../middleware/authMiddleware.js";

const uploadDir = path.resolve(process.cwd(), "server", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname);
    const normalized = file.originalname
      .replace(extension, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    cb(null, `${Date.now()}-${normalized}${extension}`);
  },
});

function fileFilter(_req, file, cb) {
  const allowed = [
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/webp",
    "image/gif",
    "image/svg+xml",
  ];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
    return;
  }
  cb(new Error("Unsupported file type."));
}

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter,
});

export const uploadRoutes = Router();

uploadRoutes.post("/", protect, upload.single("file"), uploadFile);
