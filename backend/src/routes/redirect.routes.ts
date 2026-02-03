import { handleRedirect } from "@controllers/redirect.controller";
import { redirectLimiter } from "@middleware/rateLimit.middleware";
import { validateShortCodeParam } from "@middleware/validate.middleware";
import { Router } from "express";

const router = Router();

// GET /:shortCode - Redirect to original URL
router.get("/:shortCode", redirectLimiter, validateShortCodeParam, handleRedirect);

export default router;
