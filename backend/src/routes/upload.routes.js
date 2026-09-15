 import { Router } from "express";
import { upload, generateFileName } from "../middleware/upload.js";
import { requireAuth } from "../middleware/auth.js";
import supabase from "../lib/supabase.js";

const router = Router();
const BUCKET = process.env.SUPABASE_BUCKET;

router.post("/", requireAuth, upload.array("photos", 6), async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const urls = [];
    for (const file of req.files) {
      const fileName = generateFileName(file.originalname);
      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(fileName, file.buffer, { contentType: file.mimetype });

      if (error) throw error;

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
      urls.push(data.publicUrl);
    }

    res.status(201).json({ urls });
  } catch (err) {
    next(err);
  }
});

export default router;