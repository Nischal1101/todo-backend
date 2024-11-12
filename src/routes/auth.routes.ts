import { Router } from "express";
import asyncErrorHandler from "../utils/asyncErrorHandler";
import {
    loginUser,
    logoutUser,
    registerUser,
} from "../controllers/auth.controller";
const router = Router();

router.route("/register").post(asyncErrorHandler(registerUser));
router.route("/login").post(asyncErrorHandler(loginUser));
router.route("/logout").post(asyncErrorHandler(logoutUser));

export default router;
