import { Router } from "express";
import asyncErrorHandler from "../utils/asyncErrorHandler";
import { getAllUsers, deleteUser } from "../controllers/user.controller";
import { admin } from "../middlewares/admin";
const router = Router();

router.route("/user").post(admin,asyncErrorHandler(getAllUsers));
router.route("/user/:userid").delete(admin,asyncErrorHandler(deleteUser));

export default router;
