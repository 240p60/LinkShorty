import {
  createLink,
  deleteLink,
  getAllLinks,
  getLink,
  getLinkClicks,
  getLinkStats,
} from "@controllers/links.controller";
import { authMiddleware } from "@middleware/auth.middleware";
import { apiLimiter, createLinkLimiter } from "@middleware/rateLimit.middleware";
import {
  validateCustomCode,
  validateShortCodeParam,
  validateUrlMiddleware,
} from "@middleware/validate.middleware";
import { Router } from "express";

const router = Router();

// Apply authentication to all routes
router.use(authMiddleware);

// Apply rate limiting to all routes
router.use(apiLimiter);

// GET /api/links - Get all links
router.get("/", getAllLinks);

// POST /api/links - Create a new link
router.post("/", createLinkLimiter, validateUrlMiddleware, validateCustomCode, createLink);

// GET /api/links/:shortCode - Get a single link
router.get("/:shortCode", validateShortCodeParam, getLink);

// DELETE /api/links/:shortCode - Delete a link
router.delete("/:shortCode", validateShortCodeParam, deleteLink);

// GET /api/links/:shortCode/clicks - Get clicks for a link
router.get("/:shortCode/clicks", validateShortCodeParam, getLinkClicks);

// GET /api/links/:shortCode/stats - Get stats for a link
router.get("/:shortCode/stats", validateShortCodeParam, getLinkStats);

export default router;
