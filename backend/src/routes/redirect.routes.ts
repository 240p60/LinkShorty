import { Router } from "express";
import { handleRedirect } from "@controllers/redirect.controller";
import { validateShortCodeParam } from "@middleware/validate.middleware";
import { redirectLimiter } from "@middleware/rateLimit.middleware";

const router = Router();

// GET /:shortCode - Redirect to original URL
router.get("/:shortCode", redirectLimiter, validateShortCodeParam, handleRedirect);

export default router;
