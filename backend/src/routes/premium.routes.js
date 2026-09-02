import { Router } from "express";
import { v4 as uuid } from "uuid";
import prisma from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// GET /api/premium/plans — pricing pulled from AdminSetting so admins can change it without a deploy
router.get("/plans", async (req, res, next) => {
  try {
    const settings = await prisma.adminSetting.findMany();
    const price = (key, fallback) => Number(settings.find((s) => s.key === key)?.value ?? fallback);

    res.json({
      currency: "SZL",
      plans: [
        { key: "verified_badge", label: "Verified Badge", price: price("price_verified_badge_monthly", 200), period: "monthly" },
        { key: "featured_listing", label: "Featured Listing", price: price("price_featured_listing", 50), period: "one-time" },
        { key: "boost_listing", label: "Boost Listing", price: price("price_boost_listing", 50), period: "one-time" },
        { key: "priority_placement", label: "Priority Placement", price: price("price_priority_placement", 75), period: "one-time" },
        { key: "business_profile", label: "Business Profile", price: price("price_business_profile", 150), period: "monthly" },
      ],
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/premium/subscribe
// NOTE: this records the intent + a pending payment. Wire a real
// payment-provider callback to flip payment/subscription status to "completed"/"active".
router.post("/subscribe", requireAuth, async (req, res, next) => {
  try {
    const { plan, listingId } = req.body;
    const settings = await prisma.adminSetting.findMany();
    const priceMap = {
      verified_badge: Number(settings.find((s) => s.key === "price_verified_badge_monthly")?.value ?? 200),
      featured_listing: Number(settings.find((s) => s.key === "price_featured_listing")?.value ?? 50),
      boost_listing: Number(settings.find((s) => s.key === "price_boost_listing")?.value ?? 50),
      priority_placement: Number(settings.find((s) => s.key === "price_priority_placement")?.value ?? 75),
      business_profile: Number(settings.find((s) => s.key === "price_business_profile")?.value ?? 150),
    };
    const price = priceMap[plan];
    if (!price) return res.status(400).json({ error: "Unknown plan" });

    const reference = `ECN-${uuid().slice(0, 8).toUpperCase()}`;
    const payment = await prisma.payment.create({
      data: { userId: req.user.id, amount: price, currency: "SZL", purpose: plan, provider: "manual", status: "pending", reference },
    });

    res.status(201).json({
      payment,
      message: "Payment initiated. Complete payment with your provider using this reference, then it will be confirmed.",
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/premium/confirm/:reference — simulate a payment-provider webhook confirming payment
router.post("/confirm/:reference", requireAuth, async (req, res, next) => {
  try {
    const payment = await prisma.payment.findUnique({ where: { reference: req.params.reference } });
    if (!payment || payment.userId !== req.user.id) return res.status(404).json({ error: "Payment not found" });

    await prisma.payment.update({ where: { id: payment.id }, data: { status: "completed" } });

    if (payment.purpose === "verified_badge") {
      await prisma.user.update({
        where: { id: req.user.id },
        data: { isVerifiedBadge: true, verifiedBadgeExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
      });
      await prisma.subscription.create({
        data: { userId: req.user.id, plan: "verified_badge", price: payment.amount, endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
      });
    }
    if (["featured_listing", "boost_listing", "priority_placement"].includes(payment.purpose) && req.body.listingId) {
      await prisma.listing.update({
        where: { id: req.body.listingId },
        data: { isFeatured: true, featuredUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) },
      });
    }

    res.json({ message: "Payment confirmed", payment });
  } catch (err) {
    next(err);
  }
});

export default router;