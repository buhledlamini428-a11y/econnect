 import multer from "multer";
import { v4 as uuid } from "uuid";
import path from "path";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

function fileFilter(req, file, cb) {
  if (!ALLOWED_TYPES.includes(file.mimetype)) {
    return cb(new Error("Only JPEG, PNG, WEBP, or GIF images are allowed"));
  }
  cb(null, true);
}

export const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 6 },
});

export function generateFileName(originalName) {
  const ext = path.extname(originalName).toLowerCase();
  return `listings/${uuid()}${ext}`;
}