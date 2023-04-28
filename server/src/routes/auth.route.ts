import express from "express";
import { Container } from "typedi";
import { AuthController } from "../controllers/auth.controller";

const router = express.Router();
const controller = Container.get(AuthController);

router.post("/register", controller.register);
router.post("/login", controller.login);

export default router;
