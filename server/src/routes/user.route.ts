import express from "express";
import { Container } from "typedi";
import { requireAuth } from "../middlewares";
import { AccountVerificationController } from "../controllers/account-verification.controller";

const router = express.Router();
const verificationController = Container.get(AccountVerificationController);

router.put(
  "/:userId/account/verification/status",
  requireAuth({ forAdmin: true }),
  verificationController.updateAccountVerificationStatus,
);

router.get(
  "/verification-requests",
  // requireAuth({ forAdmin: true }),
  verificationController.getAccountVerificationRequests,
);

export default router;
