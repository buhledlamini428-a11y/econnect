import { Router } from "express";
import prisma from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";
import { validateBody, schemas } from "../utils/validate.js";
import { recalculateTrustScore } from "../utils/trustScore.js";

const router = Router();

// POST /api/ratings
router.post("/", requireAuth, validateBody(schemas.rating), async (req, res, next) => {
  try {
    const { rateeId } = req.body;
    if (rateeId === req.user.id) {
      return res.status(400).json({ error: "You cannot rate yourself" });
    }

    const rating = await prisma.rating.create({
      data: { ...req.body, raterId: req.user.id },
    });

    await recalculateTrustScore(rateeId);
    res.status(201).json({ rating });
  } catch (err) {
    if (err.code === "P2002") return res.status(409).json({ error: "You already rated this user for this listing" });
    next(err);
  }
});

// GET /api/ratings/user/:id
router.get("/user/:id", async (req, res, next) => {
  try {
    const ratings = await prisma.rating.findMany({
      where: { rateeId: req.params.id },
      orderBy: { createdAt: "desc" },
      include: { rater: { select: { fullName: true, profilePhoto: true } } },
    });
    res.json({ ratings });
  } catch (err) {
    next(err);
  }
});

export default router;