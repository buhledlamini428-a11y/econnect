import { Router } from "express";
import prisma from "../lib/prisma.js";
import { requireAuth, sanitizeUser } from "../middleware/auth.js";
import { recalculateTrustScore, trustLevel } from "../utils/trustScore.js";

const router = Router();

// GET /api/users/:id — public profile
router.get("/:id", async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        skills: true,
        qualifications: true,
        listings: { where: { status: "active" }, orderBy: { createdAt: "desc" }, take: 20 },
      },
    });
    if (!user) return res.status(404).json({ error: "User not found" });

    const ratings = await prisma.rating.findMany({ where: { rateeId: user.id }, orderBy: { createdAt: "desc" }, take: 20 });
    const avgRating = ratings.length ? ratings.reduce((s, r) => s + r.stars, 0) / ratings.length : null;

    res.json({
      user: sanitizeUser(user),
      trustLevel: trustLevel(user.trustScore),
      avgRating,
      ratingsCount: ratings.length,
      recentRatings: ratings,
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/users/me — edit own profile
router.put("/me", requireAuth, async (req, res, next) => {
  try {
    const allowed = [
      "fullName", "bio", "profilePhoto", "region", "city", "area", "languages", "gender", "dateOfBirth",
    ];
    const data = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) data[key] = req.body[key];
    }
    if (data.dateOfBirth) data.dateOfBirth = new Date(data.dateOfBirth);

    const user = await prisma.user.update({ where: { id: req.user.id }, data });
    res.json({ user: sanitizeUser(user) });
  } catch (err) {
    next(err);
  }
});

// POST /api/users/me/skills
router.post("/me/skills", requireAuth, async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Skill name required" });
    const skill = await prisma.skill.create({ data: { userId: req.user.id, name } });
    res.status(201).json({ skill });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/users/me/skills/:id
router.delete("/me/skills/:id", requireAuth, async (req, res, next) => {
  try {
    await prisma.skill.deleteMany({ where: { id: req.params.id, userId: req.user.id } });
    res.json({ message: "Removed" });
  } catch (err) {
    next(err);
  }
});

// POST /api/users/me/qualifications
router.post("/me/qualifications", requireAuth, async (req, res, next) => {
  try {
    const { title, institution, year } = req.body;
    if (!title) return res.status(400).json({ error: "Title required" });
    const q = await prisma.qualification.create({
      data: { userId: req.user.id, title, institution, year: year ? Number(year) : null },
    });
    res.status(201).json({ qualification: q });
  } catch (err) {
    next(err);
  }
});

// GET /api/users/me/trust-score — recalculate and return
router.get("/me/trust-score", requireAuth, async (req, res, next) => {
  try {
    const score = await recalculateTrustScore(req.user.id);
    res.json({ trustScore: score, trustLevel: trustLevel(score) });
  } catch (err) {
    next(err);
  }
});

// POST /api/users/:id/block
router.post("/:id/block", requireAuth, async (req, res, next) => {
  try {
    if (req.params.id === req.user.id) return res.status(400).json({ error: "Cannot block yourself" });
    await prisma.blockedUser.upsert({
      where: { blockerId_blockedId: { blockerId: req.user.id, blockedId: req.params.id } },
      update: {},
      create: { blockerId: req.user.id, blockedId: req.params.id },
    });
    res.json({ message: "User blocked" });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/users/:id/block
router.delete("/:id/block", requireAuth, async (req, res, next) => {
  try {
    await prisma.blockedUser.deleteMany({ where: { blockerId: req.user.id, blockedId: req.params.id } });
    res.json({ message: "User unblocked" });
  } catch (err) {
    next(err);
  }
});

export default router;