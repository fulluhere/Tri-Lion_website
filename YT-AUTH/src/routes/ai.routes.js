// backend/src/routes/ai.routes.js
import { Router } from "express";
import { getHint } from "../controllers/ai.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { getSubmissionAnalysis } from "../controllers/ai.controller.js";


const router = Router();
router.post("/hint", verifyToken, getHint);
// backend/src/routes/ai.routes.js
router.post("/report", verifyToken, getSubmissionAnalysis);
export default router;