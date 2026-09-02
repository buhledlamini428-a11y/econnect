// E-connect Trust Score engine.
// Score is intentionally NOT based solely on star ratings — it blends
// reliability signals so a new, honest user isn't unfairly penalised
// and a popular-but-risky user isn't over-rewarded.
import prisma from "../lib/prisma.js";

const WEIGHTS = {
  avgRating: 30, // out of 5 stars, scaled to 30 points
  completedJobs: 20, // capped contribution
  verifiedIdentity: 15,
  accountAge: 10, // capped contribution
  reviewVolume: 10, // capped contribution
  reportsPenalty: -20, // capped penalty
  cancelledPenalty: -10, // capped penalty
};

export async function recalculateTrustScore(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return null;

  const ratings = await prisma.rating.findMany({ where: { rateeId: userId } });
  const reportsAgainst = await prisma.report.count({
    where: { reportedUserId: userId, status: { in: ["reviewed", "actioned"] } },
  });

  const avgStars = ratings.length ? ratings.reduce((s, r) => s + r.stars, 0) / ratings.length : 0;
  const accountAgeDays = (Date.now() - new Date(user.memberSince).getTime()) / (1000 * 60 * 60 * 24);

  let score = 0;
  score += (avgStars / 5) * WEIGHTS.avgRating;
  score += Math.min(user.completedJobsCount / 10, 1) * WEIGHTS.completedJobs;
  score += user.isPhoneVerified || user.isEmailVerified ? WEIGHTS.verifiedIdentity : 0;
  score += Math.min(accountAgeDays / 180, 1) * WEIGHTS.accountAge; // full credit after ~6 months
  score += Math.min(ratings.length / 20, 1) * WEIGHTS.reviewVolume;
  score += Math.min(reportsAgainst, 4) * (WEIGHTS.reportsPenalty / 4);
  score += Math.min(user.cancelledJobsCount, 5) * (WEIGHTS.cancelledPenalty / 5);

  // Base floor so brand-new accounts start at a fair, non-zero score
  score = Math.round(Math.max(0, Math.min(100, 40 + score)));

  await prisma.user.update({ where: { id: userId }, data: { trustScore: score } });
  return score;
}

export function trustLevel(score) {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Average";
  if (score >= 30) return "Low";
  return "Restricted";
}