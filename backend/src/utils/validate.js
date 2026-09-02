import { z } from "zod";

export function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Validation failed", details: result.error.flatten() });
    }
    req.body = result.data;
    next();
  };
}

export const schemas = {
  register: z.object({
    fullName: z.string().min(2),
    username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_.]+$/, "Letters, numbers, dots, underscores only"),
    phone: z.string().min(8),
    email: z.string().email().optional().or(z.literal("")).optional(),
    password: z.string().min(8),
    dateOfBirth: z.string().optional(),
    gender: z.string().optional(),
    region: z.string().optional(),
    city: z.string().optional(),
  }),
  login: z.object({
    identifier: z.string().min(3), // phone, email, or username
    password: z.string().min(1),
  }),
  verifyOtp: z.object({
    phone: z.string().min(8),
    code: z.string().length(6),
  }),
  listingCreate: z.object({
    type: z.enum(["JOB", "TASK", "SERVICE", "PRODUCT", "REQUEST"]),
    title: z.string().min(3),
    description: z.string().min(10),
    categoryId: z.string().optional(),
    price: z.number().optional(),
    priceType: z.enum(["fixed", "hourly", "negotiable"]).optional(),
    employmentType: z.string().optional(),
    vacancies: z.number().optional(),
    applicationDeadline: z.string().optional(),
    requirements: z.string().optional(),
    skillsRequired: z.string().optional(),
    experienceRequired: z.string().optional(),
    contactMethod: z.string().optional(),
    durationValue: z.number().optional(),
    durationUnit: z.enum(["hours", "days", "months", "years"]).optional(),
    condition: z.enum(["new", "used"]).optional(),
    region: z.string().optional(),
    city: z.string().optional(),
    area: z.string().optional(),
    photos: z.array(z.string()).optional(),
  }),
  rating: z.object({
    listingId: z.string().optional(),
    rateeId: z.string(),
    stars: z.number().min(1).max(5),
    review: z.string().optional(),
    reliability: z.number().min(1).max(5).optional(),
    communication: z.number().min(1).max(5).optional(),
    quality: z.number().min(1).max(5).optional(),
    professionalism: z.number().min(1).max(5).optional(),
    paymentBehaviour: z.number().min(1).max(5).optional(),
  }),
  report: z.object({
    reportedUserId: z.string().optional(),
    listingId: z.string().optional(),
    reason: z.enum([
      "scam", "fraud", "fake_job", "fake_product", "harassment",
      "misleading", "inappropriate", "non_delivery", "abuse", "suspicious_account", "other",
    ]),
    details: z.string().optional(),
  }),
  message: z.object({
    conversationId: z.string().optional(),
    listingId: z.string().optional(),
    recipientId: z.string().optional(),
    content: z.string().min(1),
    imageUrl: z.string().optional(),
  }),
};