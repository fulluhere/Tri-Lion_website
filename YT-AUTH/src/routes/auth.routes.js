import { Router} from "express";
import * as authController from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login)
authRouter.get("/get-me", verifyToken, authController.getMe)
authRouter.get("/refresh-token", authController.refreshToken)
authRouter.get("/logout", authController.logout)
authRouter.get("/logout-all", authController.logoutAll)
authRouter.post("/verify-email", authController.verifyEmail)
authRouter.post("/forgot-password", authController.forgotPassword);
authRouter.post("/reset-password", authController.resetPassword);

export default authRouter;