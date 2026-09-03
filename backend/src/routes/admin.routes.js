import { Router } from "express";
import prisma from "../lib/prisma.js";
import { requireAuth, requireAdmin, sanitizeUser } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth, requireAdmin);

// GET /api/admin/stats
router.get("/stats", async (req, res, next) => {
  try {
    const [
      totalUsers, verifiedAccounts, jobsPosted, tasksPosted, servicesPosted,
      productsListed, requestsPosted, applications, reportsPending, activeSubscriptions, payments,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isVerifiedBadge: true } }),
      prisma.listing.count({ where: { type: "JOB" } }),
      prisma.listing.count({ where: { type: "TASK" } }),
      prisma.listing.count({ where: { type: "SERVICE" } }),
      prisma.listing.count({ where: { type: "PRODUCT" } }),
      prisma.listing.count({ where: { type: "REQUEST" } }),
      prisma.jobApplication.count(),
      prisma.report.count({ where: { status: "pending" } }),
      prisma.subscription.count({ where: { status: "active" } }),
      prisma.payment.findMany({ where: { status: "completed" } }),
    ]);
    const revenue = payments.reduce((s, p) => s + p.amount, 0);

    res.json({
      totalUsers, verifiedAccounts, jobsPosted, tasksPosted, servicesPosted,
      productsListed, requestsPosted, applications, reportsPending, activeSubscriptions,
      revenue, currency: "SZL",
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/users
router.get("/users", async (req, res, next) => {
  try {
    const { status, q, page = 1, pageSize = 25 } = req.query;
    const where = {};
    if (status) where.status = status;
     if (q) where.OR = [
      { fullName: { contains: q, mode: "insensitive" } },
      { username: { contains: q, mode: "insensitive" } },
      { phone: { contains: q, mode: "insensitive" } },
    ];
    const users = await prisma.user.findMany({
      where, orderBy: { createdAt: "desc" },
      skip: (Number(page) - 1) * Number(pageSize), take: Number(pageSize),
    });
    res.json({ users: users.map(sanitizeUser) });
  } catch (err) {
    next(err);
  }
});

// PUT /api/admin/users/:id/status  { status, reason }
router.put("/users/:id/status", async (req, res, next) => {
  try {
    const { status, reason } = req.body;
    const valid = ["active", "warning", "restricted", "suspended", "blocked"];
    if (!valid.includes(status)) return res.status(400).json({ error: "Invalid status" });

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { status, restrictionReason: reason || null },
    });

    await prisma.accountRestriction.create({
      data: { userId: user.id, reason: reason || "No reason given", level: status, issuedBy: req.user.id },
    });
    await prisma.notification.create({
      data: { userId: user.id, type: "account_status", title: `Account status: ${status}`, body: reason || "" },
    });
    await prisma.auditLog.create({
      data: { userId: req.user.id, action: "user_status_change", details: `${user.id} -> ${status}: ${reason || ""}` },
    });

    res.json({ user: sanitizeUser(user) });
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/users/:id/verify — approve identity verification & grant badge manually
router.post("/users/:id/verify", async (req, res, next) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { isVerifiedBadge: true, verifiedBadgeExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
    });
    res.json({ user: sanitizeUser(user) });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/listings
router.get("/listings", async (req, res, next) => {
  try {
    const { type, status } = req.query;
    const listings = await prisma.listing.findMany({
      where: { ...(type ? { type } : {}), ...(status ? { status } : {}) },
      orderBy: { createdAt: "desc" },
      include: { user: { select: { fullName: true, username: true } } },
    });
    res.json({ listings });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/admin/listings/:id
router.delete("/listings/:id", async (req, res, next) => {
  try {
    await prisma.listing.update({ where: { id: req.params.id }, data: { status: "removed" } });
    res.json({ message: "Listing removed" });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/reports
router.get("/reports", async (req, res, next) => {
  try {
    const { status = "pending" } = req.query;
    const reports = await prisma.report.findMany({
      where: { status },
      orderBy: { createdAt: "desc" },
      include: {
        reporter: { select: { fullName: true, username: true } },
        reportedUser: { select: { fullName: true, username: true } },
        listing: { select: { title: true, type: true } },
      },
    });
    res.json({ reports });
  } catch (err) {
    next(err);
  }
});

// PUT /api/admin/reports/:id  { status } — reviewed | actioned | dismissed
router.put("/reports/:id", async (req, res, next) => {
  try {
    const { status } = req.body;
    const report = await prisma.report.update({ where: { id: req.params.id }, data: { status } });
    res.json({ report });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/verification-requests
router.get("/verification-requests", async (req, res, next) => {
  try {
    const requests = await prisma.verificationRequest.findMany({
      where: { status: "pending" },
      include: { user: { select: { fullName: true, username: true, phone: true } } },
    });
    res.json({ requests });
  } catch (err) {
    next(err);
  }
});

// PUT /api/admin/verification-requests/:id  { status }
router.put("/verification-requests/:id", async (req, res, next) => {
  try {
    const { status } = req.body;
    const vr = await prisma.verificationRequest.update({
      where: { id: req.params.id },
      data: { status, reviewedBy: req.user.id, reviewedAt: new Date() },
    });
    if (status === "approved") {
      await prisma.user.update({
        where: { id: vr.userId },
        data: { isVerifiedBadge: true, verifiedBadgeExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
      });
    }
    res.json({ verificationRequest: vr });
  } catch (err) {
    next(err);
  }
});

// GET/PUT /api/admin/settings — premium pricing, changeable without redeploying
router.get("/settings", async (req, res, next) => {
  try {
    const settings = await prisma.adminSetting.findMany();
    res.json({ settings });
  } catch (err) {
    next(err);
  }
});

router.put("/settings/:key", async (req, res, next) => {
  try {
    const { value } = req.body;
    const setting = await prisma.adminSetting.upsert({
      where: { key: req.params.key },
      update: { value: String(value) },
      create: { key: req.params.key, value: String(value) },
    });
    res.json({ setting });
  } catch (err) {
    next(err);
  }
});

export default router;