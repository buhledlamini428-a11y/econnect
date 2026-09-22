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

    // Also deliver the report as a direct message to an admin, so it surfaces
    // in Messages immediately rather than only in the admin dashboard.
    const admin = await prisma.user.findFirst({ where: { role: "admin" } });
    if (admin && admin.id !== req.user.id) {
      const [userAId, userBId] = [req.user.id, admin.id].sort();
      const convo = await prisma.conversation.upsert({
        where: { listingId_userAId_userBId: { listingId: report.listingId || null, userAId, userBId } },
        update: {},
        create: { listingId: report.listingId || null, userAId, userBId },
      });

      const reasonLabel = report.reason.replace(/_/g, " ");
      const messageBody = [
        `New report submitted.`,
        `Reason: ${reasonLabel}`,
        report.details ? `Details: ${report.details}` : null,
        report.listingId ? `Listing ID: ${report.listingId}` : null,
        report.reportedUserId ? `Reported user ID: ${report.reportedUserId}` : null,
      ].filter(Boolean).join("\n");

      await prisma.message.create({
        data: { conversationId: convo.id, senderId: req.user.id, content: messageBody },
      });
      await prisma.conversation.update({ where: { id: convo.id }, data: { lastMessageAt: new Date() } });

      await prisma.notification.create({
        data: { userId: admin.id, type: "report", title: "New report submitted", body: `${reasonLabel} — from ${req.user.fullName}` },
      });
    }

    res.status(201).json({ report, message: "Report submitted for admin review" });
  } catch (err) {
    next(err);
  }
});

export default router;