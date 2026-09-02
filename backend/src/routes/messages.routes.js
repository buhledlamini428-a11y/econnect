import { Router } from "express";
import prisma from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";
import { validateBody, schemas } from "../utils/validate.js";

const router = Router();

// GET /api/messages/conversations
router.get("/conversations", requireAuth, async (req, res, next) => {
  try {
    const conversations = await prisma.conversation.findMany({
      where: { OR: [{ userAId: req.user.id }, { userBId: req.user.id }] },
      orderBy: { lastMessageAt: "desc" },
      include: {
        listing: { select: { id: true, title: true, type: true } },
        userA: { select: { id: true, fullName: true, profilePhoto: true } },
        userB: { select: { id: true, fullName: true, profilePhoto: true } },
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    });
    res.json({ conversations });
  } catch (err) {
    next(err);
  }
});

// GET /api/messages/conversations/:id
router.get("/conversations/:id", requireAuth, async (req, res, next) => {
  try {
    const convo = await prisma.conversation.findUnique({
      where: { id: req.params.id },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    });
    if (!convo) return res.status(404).json({ error: "Conversation not found" });
    if (convo.userAId !== req.user.id && convo.userBId !== req.user.id) {
      return res.status(403).json({ error: "Not part of this conversation" });
    }

    await prisma.message.updateMany({
      where: { conversationId: convo.id, senderId: { not: req.user.id }, isRead: false },
      data: { isRead: true },
    });

    res.json({ conversation: convo });
  } catch (err) {
    next(err);
  }
});

// POST /api/messages — sends a message, creating the conversation if needed
router.post("/", requireAuth, validateBody(schemas.message), async (req, res, next) => {
  try {
    const { conversationId, listingId, recipientId, content, imageUrl } = req.body;

    // Basic spam guard: block if sender fired >20 messages in the last minute
    const recentCount = await prisma.message.count({
      where: { senderId: req.user.id, createdAt: { gt: new Date(Date.now() - 60 * 1000) } },
    });
    if (recentCount > 20) return res.status(429).json({ error: "You are sending messages too quickly" });

    let convo;
    if (conversationId) {
      convo = await prisma.conversation.findUnique({ where: { id: conversationId } });
      if (!convo || (convo.userAId !== req.user.id && convo.userBId !== req.user.id)) {
        return res.status(403).json({ error: "Not part of this conversation" });
      }
    } else {
      if (!recipientId) return res.status(400).json({ error: "recipientId required to start a conversation" });

      const blocked = await prisma.blockedUser.findFirst({
        where: {
          OR: [
            { blockerId: recipientId, blockedId: req.user.id },
            { blockerId: req.user.id, blockedId: recipientId },
          ],
        },
      });
      if (blocked) return res.status(403).json({ error: "Cannot message this user" });

      const [userAId, userBId] = [req.user.id, recipientId].sort();
      convo = await prisma.conversation.upsert({
        where: { listingId_userAId_userBId: { listingId: listingId || null, userAId, userBId } },
        update: {},
        create: { listingId: listingId || null, userAId, userBId },
      });
    }

    const message = await prisma.message.create({
      data: { conversationId: convo.id, senderId: req.user.id, content, imageUrl: imageUrl || null },
    });
    await prisma.conversation.update({ where: { id: convo.id }, data: { lastMessageAt: new Date() } });

    const recipient = convo.userAId === req.user.id ? convo.userBId : convo.userAId;
    await prisma.notification.create({
      data: { userId: recipient, type: "message", title: "New message", body: content.slice(0, 100) },
    });

    res.status(201).json({ message, conversationId: convo.id });
  } catch (err) {
    next(err);
  }
});

export default router;