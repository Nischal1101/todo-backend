import { Router } from "express";
import asyncErrorHandler from "../utils/asyncErrorHandler";
import authenticate from "./../middlewares/authenticate";
import { TodoSchema } from "../utils/validators/TodoSchema";
import validate from "./../middlewares/validator";
import {
    getAllTodos,
    updateSpecificTodo,
    getIndividualTodo,
    deleteSpecificTodo,
    createTodo,
} from "../controllers/todo.controller";
const router = Router();

router.route("/").get(asyncErrorHandler(getAllTodos));

router
    .route("/")
    .get(authenticate, asyncErrorHandler(getIndividualTodo))
    .post(validate(TodoSchema), authenticate, asyncErrorHandler(createTodo));
router
    .route("/:id")
    .delete(authenticate, asyncErrorHandler(deleteSpecificTodo))
    .put(authenticate, asyncErrorHandler(updateSpecificTodo));

export default router;
