import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/users.routes.js";
import categoryRoutes from "./routes/categories.routes.js";
import listingRoutes from "./routes/listings.routes.js";
import messageRoutes from "./routes/messages.routes.js";
import ratingRoutes from "./routes/ratings.routes.js";
import reportRoutes from "./routes/reports.routes.js";
import premiumRoutes from "./routes/premium.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler.js";
import notificationRoutes from "./routes/notifications.routes.js";

dotenv.config();

const app = express();

app.use(helmet());
 const allowedOrigins = [
  process.env.CLIENT_URL,
  "https://localhost", // Capacitor Android WebView origin
  "capacitor://localhost", // Capacitor iOS WebView origin (for future use)
  "http://localhost", // fallback, some Android WebView versions use plain http
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. curl, server-to-server) and any explicitly allowed origin
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
app.use(express.json({ limit: "5mb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));


// Global rate limit — protects against brute force / scraping
const globalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300 });
app.use(globalLimiter);

// Stricter limiter for auth endpoints to slow down credential stuffing
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30 });
app.use("/api/auth", authLimiter);

app.get("/api/health", (req, res) => res.json({ status: "ok", service: "econnect-backend" }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/premium", premiumRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/notifications", notificationRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`E-connect API running on http://localhost:${PORT}`));