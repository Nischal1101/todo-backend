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
    getSpecificTodo,
} from "../controllers/todo.controller";
import { upload } from "../middlewares/multer";
const router = Router();

router.route("/todos").get(asyncErrorHandler(getAllTodos));
router.route("/:todoid").get(authenticate, asyncErrorHandler(getSpecificTodo));
router
    .route("/")
    .get(authenticate, asyncErrorHandler(getIndividualTodo))
    .post(
        upload.single("file"),
        validate(TodoSchema),
        authenticate,
        asyncErrorHandler(createTodo),
    );
router
    .route("/:id")
    .delete(authenticate, asyncErrorHandler(deleteSpecificTodo))
    .put(authenticate, asyncErrorHandler(updateSpecificTodo));

export default router;
