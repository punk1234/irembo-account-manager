import express from "express";
import { Container } from "typedi";
import C from "../constants";
import { AuthController } from "../controllers/auth.controller";
import { requireAuth } from "../middlewares";

const router = express.Router();
const controller = Container.get(AuthController);

router.post("/register", controller.register);
router.post("/login", controller.login);

router.post(
  "/twoFa/verify",
  requireAuth({ tokenType: C.AuthTokenType.VERIFY_2FA }),
  controller.verifyTwoFa,
);

router.post("/password/reset/send-link", controller.sendPasswordResetLink);

export default router;
