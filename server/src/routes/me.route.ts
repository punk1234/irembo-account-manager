import express from "express";
import { Container } from "typedi";
import { imageMimeTypeValidator, requireAuth } from "../middlewares";
import { UserController } from "../controllers/user.controller";
import { AccountVerificationController } from "../controllers/account-verification.controller";

const router = express.Router();

const controller = Container.get(UserController);
const verificationController = Container.get(AccountVerificationController);

router.get("/profile", requireAuth(), controller.getProfile);
router.post(
  "/account/verification",
  requireAuth({ forAdmin: false }),
  imageMimeTypeValidator("images"),
  verificationController.initiateAccountVerification,
);

export default router;
