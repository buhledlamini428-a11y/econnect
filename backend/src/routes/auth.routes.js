import { Router } from "express";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";
import { signToken, sanitizeUser, requireAuth } from "../middleware/auth.js";
import { validateBody, schemas } from "../utils/validate.js";
import { generateOtpCode, sendOtp } from "../utils/otp.js";

const router = Router();
const OTP_EXPIRY_MIN = Number(process.env.OTP_EXPIRY_MINUTES || 10);

// POST /api/auth/register
router.post("/register", validateBody(schemas.register), async (req, res, next) => {
  try {
    const { fullName, username, phone, email, password, dateOfBirth, gender, region, city } = req.body;

    const existing = await prisma.user.findFirst({
      where: { OR: [{ phone }, { username }, { email }] },
    });
    if (existing) {
      return res.status(409).json({ error: "An account with this phone, username, or email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        fullName, username, phone, email,
        password: hashed,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        gender, region, city,
      },
    });

    const code = generateOtpCode();
    await prisma.otp.create({
      data: {
        userId: user.id, email,
        code, purpose: "registration",
        expiresAt: new Date(Date.now() + OTP_EXPIRY_MIN * 60 * 1000),
      },
    });
    await sendOtp(email, code);

    res.status(201).json({ message: "Registered. OTP sent to email.", userId: user.id, email });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/verify-otp
router.post("/verify-otp", validateBody(schemas.verifyOtp), async (req, res, next) => {
  try {
    const { email, code } = req.body;

    const otp = await prisma.otp.findFirst({
      where: { email, code, consumed: false, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: "desc" },
    });
    if (!otp) return res.status(400).json({ error: "Invalid or expired OTP" });

    await prisma.otp.update({ where: { id: otp.id }, data: { consumed: true } });
    const user = await prisma.user.update({
      where: { email },
      data: { isEmailVerified: true, isPhoneVerified: true },
    });

    const token = signToken(user);
    res.json({ token, user: sanitizeUser(user) });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/resend-otp
router.post("/resend-otp", async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "No account with this email" });

    const code = generateOtpCode();
    await prisma.otp.create({
      data: { userId: user.id, email, code, purpose: "registration", expiresAt: new Date(Date.now() + OTP_EXPIRY_MIN * 60 * 1000) },
    });
    await sendOtp(email, code);
    res.json({ message: "OTP resent" });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login  — identifier can be phone, email, or username
router.post("/login", validateBody(schemas.login), async (req, res, next) => {
  try {
    const { identifier, password } = req.body;
    const user = await prisma.user.findFirst({
      where: { OR: [{ phone: identifier }, { email: identifier }, { username: identifier }] },
    });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    if (["suspended", "blocked"].includes(user.status)) {
      return res.status(403).json({ error: `Account is ${user.status}`, reason: user.restrictionReason });
    }

    const token = signToken(user);
    res.json({ token, user: sanitizeUser(user) });
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me
router.get("/me", requireAuth, async (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
});

export default router;