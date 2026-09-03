import { Router } from "express";
import prisma from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";
import { validateBody, schemas } from "../utils/validate.js";

const router = Router();

// GET /api/listings — search + filter + sort
// query: type, category, q, region, city, minPrice, maxPrice, employmentType,
//        verifiedOnly, sort (newest|closest|rating|price_low|price_high|relevant)
router.get("/", async (req, res, next) => {
  try {
    const {
      type, category, q, region, city, minPrice, maxPrice,
      employmentType, verifiedOnly, sort = "newest", page = 1, pageSize = 20,
    } = req.query;

    const where = { status: "active" };
    if (type) where.type = String(type).toUpperCase();
    if (category) where.categoryId = category;
    if (region) where.region = region;
    if (city) where.city = city;
    if (employmentType) where.employmentType = employmentType;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }
        if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ];
    }
    
    if (verifiedOnly === "true") {
      where.user = { isVerifiedBadge: true };
    }

    let orderBy = { createdAt: "desc" };
    if (sort === "price_low") orderBy = { price: "asc" };
    if (sort === "price_high") orderBy = { price: "desc" };
    // "closest" requires device coordinates from the client; "rating" is applied post-fetch below.

    const listings = await prisma.listing.findMany({
      where,
      orderBy: [{ isFeatured: "desc" }, orderBy],
      skip: (Number(page) - 1) * Number(pageSize),
      take: Number(pageSize),
      include: {
        category: true,
        user: { select: { id: true, fullName: true, username: true, profilePhoto: true, trustScore: true, isVerifiedBadge: true } },
      },
    });

    res.json({ listings, page: Number(page), pageSize: Number(pageSize) });
  } catch (err) {
    next(err);
  }
});

// GET /api/listings/:id
router.get("/:id", async (req, res, next) => {
  try {
    const listing = await prisma.listing.findUnique({
      where: { id: req.params.id },
      include: {
        category: true,
        user: {
          select: {
            id: true, fullName: true, username: true, profilePhoto: true,
            trustScore: true, isVerifiedBadge: true, memberSince: true, city: true, region: true,
          },
        },
      },
    });
    if (!listing) return res.status(404).json({ error: "Listing not found" });

    await prisma.listing.update({ where: { id: listing.id }, data: { viewsCount: { increment: 1 } } });
    res.json({ listing });
  } catch (err) {
    next(err);
  }
});

// POST /api/listings — create (jobs/tasks/services/products/requests share this endpoint)
router.post("/", requireAuth, validateBody(schemas.listingCreate), async (req, res, next) => {
  try {
    const body = req.body;
    const listing = await prisma.listing.create({
      data: {
        type: body.type,
        title: body.title,
        description: body.description,
        categoryId: body.categoryId || null,
        userId: req.user.id,
        price: body.price ?? null,
        priceType: body.priceType || null,
        employmentType: body.employmentType || null,
        vacancies: body.vacancies ?? null,
        applicationDeadline: body.applicationDeadline ? new Date(body.applicationDeadline) : null,
        requirements: body.requirements || null,
        skillsRequired: body.skillsRequired || null,
        experienceRequired: body.experienceRequired || null,
        contactMethod: body.contactMethod || null,
        durationValue: body.durationValue ?? null,
        durationUnit: body.durationUnit || null,
        condition: body.condition || null,
        region: body.region || req.user.region,
        city: body.city || req.user.city,
        area: body.area || req.user.area,
        photos: body.photos ? JSON.stringify(body.photos) : null,
      },
    });
    res.status(201).json({ listing });
  } catch (err) {
    next(err);
  }
});

// PUT /api/listings/:id — owner-only edit
router.put("/:id", requireAuth, async (req, res, next) => {
  try {
    const existing = await prisma.listing.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: "Listing not found" });
    if (existing.userId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not allowed to edit this listing" });
    }

    const allowed = [
      "title", "description", "price", "priceType", "employmentType", "vacancies",
      "requirements", "skillsRequired", "experienceRequired", "contactMethod",
      "durationValue", "durationUnit", "condition", "region", "city", "area", "status", "photos",
    ];
    const data = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) data[key] = req.body[key];
    }
    if (data.photos) data.photos = JSON.stringify(data.photos);

    const listing = await prisma.listing.update({ where: { id: req.params.id }, data });
    res.json({ listing });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/listings/:id — owner-only
router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const existing = await prisma.listing.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: "Listing not found" });
    if (existing.userId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not allowed to delete this listing" });
    }
    await prisma.listing.delete({ where: { id: req.params.id } });
    res.json({ message: "Listing deleted" });
  } catch (err) {
    next(err);
  }
});

// POST /api/listings/:id/apply — for JOB-type listings
router.post("/:id/apply", requireAuth, async (req, res, next) => {
  try {
    const listing = await prisma.listing.findUnique({ where: { id: req.params.id } });
    if (!listing) return res.status(404).json({ error: "Listing not found" });
    if (listing.type !== "JOB") return res.status(400).json({ error: "Only job listings accept applications" });

    const application = await prisma.jobApplication.create({
      data: { listingId: listing.id, applicantId: req.user.id, message: req.body.message || null },
    });

    await prisma.notification.create({
      data: {
        userId: listing.userId,
        type: "application",
        title: "New application received",
        body: `${req.user.fullName} applied to "${listing.title}"`,
      },
    });

    res.status(201).json({ application });
  } catch (err) {
    if (err.code === "P2002") return res.status(409).json({ error: "You already applied to this listing" });
    next(err);
  }
});

// POST /api/listings/:id/save — bookmark a listing
router.post("/:id/save", requireAuth, async (req, res, next) => {
  try {
    const saved = await prisma.savedListing.upsert({
      where: { userId_listingId: { userId: req.user.id, listingId: req.params.id } },
      update: {},
      create: { userId: req.user.id, listingId: req.params.id },
    });
    res.status(201).json({ saved });
  } catch (err) {
    next(err);
  }
});

// GET /api/listings/me/saved
router.get("/me/saved", requireAuth, async (req, res, next) => {
  try {
    const saved = await prisma.savedListing.findMany({
      where: { userId: req.user.id },
      include: { listing: true },
      orderBy: { createdAt: "desc" },
    });
    res.json({ saved });
  } catch (err) {
    next(err);
  }
});

export default router;