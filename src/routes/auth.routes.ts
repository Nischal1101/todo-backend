import { Router } from "express";
import asyncErrorHandler from "../utils/asyncErrorHandler";
import { loginUser, registerUser } from "../controllers/auth.controller";
const router = Router();

router.route("/register").post(asyncErrorHandler(registerUser));
router.route("/login").post(asyncErrorHandler(loginUser));

export default router;
