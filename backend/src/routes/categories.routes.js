import { Router } from "express";
import prisma from "../lib/prisma.js";

const router = Router();

// GET /api/categories?type=JOB
router.get("/", async (req, res, next) => {
  try {
    const { type } = req.query;
    const categories = await prisma.category.findMany({
      where: type ? { type: String(type).toUpperCase() } : undefined,
      orderBy: { name: "asc" },
    });
    res.json({ categories });
  } catch (err) {
    next(err);
  }
});

export default router;