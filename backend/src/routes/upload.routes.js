import { Router } from "express";
import { upload } from "../middleware/upload.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// POST /api/upload — field name must be "photos", accepts up to 6 images
router.post("/", requireAuth, upload.array("photos", 6), (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }
    const urls = req.files.map((f) => `/uploads/${f.filename}`);
    res.status(201).json({ urls });
  } catch (err) {
    next(err);
  }
});

export default router;