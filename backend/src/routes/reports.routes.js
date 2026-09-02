import { Router } from "express";
import prisma from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";
import { validateBody, schemas } from "../utils/validate.js";

const router = Router();

// POST /api/reports
router.post("/", requireAuth, validateBody(schemas.report), async (req, res, next) => {
  try {
    const report = await prisma.report.create({
      data: { ...req.body, reporterId: req.user.id },
    });
    res.status(201).json({ report, message: "Report submitted for admin review" });
  } catch (err) {
    next(err);
  }
});

export default router;