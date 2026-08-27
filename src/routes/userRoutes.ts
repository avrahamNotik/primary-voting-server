import { Router } from "express";

import {
  getMeController,
  loginUserController,
  logoutUserController,
  registerUserController,
} from "../controllers/userController";

import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/register", registerUserController);

router.post("/login", loginUserController);

router.get("/me", authMiddleware, getMeController);

router.post("/logout", logoutUserController);

export default router;
