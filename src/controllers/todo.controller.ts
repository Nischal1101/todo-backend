import { NextFunction, Request, Response } from "express";
import db from "../db/db";
import { Todos, Users } from "../db/schema";
import CustomErrorHandler from "../utils/CustomErrorHandler";
import { eq } from "drizzle-orm";
import { IReturnResponse } from "../types";
import logger from "../config/logger";

export const getAllTodos = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        await db.select().from(Todos);
    } catch (error: unknown) {
        if (error instanceof CustomErrorHandler)
            return next(
                new CustomErrorHandler(400, "Error fetching all todos"),
            );
        else return next(new CustomErrorHandler(400, String(error)));
    }
};

export const getIndividualTodo = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const userId = Number(req.params.userid);
    let returnResponse: IReturnResponse;
    let todos;
    try {
        todos = await db
            .select()
            .from(Todos)
            .leftJoin(Users, eq(Todos.id, Users.id))
            .where(eq(Todos.userId, userId));
    } catch (error: unknown) {
        if (error instanceof CustomErrorHandler)
            return next(
                new CustomErrorHandler(400, "Error fetching individual todos"),
            );
        else return next(new CustomErrorHandler(400, String(error)));
    }
    logger.info("Individual todos has been fetched successfully ", {
        userId,
    });
    returnResponse = {
        status: "success",
        message: "User registered Successfully",
        data: todos,
    };
    return res.status(201).json(returnResponse);
};

export const createTodo = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { title, description, dueDate, priority, status } = req.body;
    await db.insert(Todos).values();
};

export const updateSpecificTodo = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {};

export const deleteSpecificTodo = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {};
