import { NextFunction, Request, Response } from "express";
import db from "../db/db";
import { Todos } from "../db/schema";
import CustomErrorHandler from "../utils/CustomErrorHandler";

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

export const getSpecificTodo = async (req: Request, res: Response) => {};

export const createTodo = async (req: Request, res: Response) => {};

export const updateSpecificTodo = async (req: Request, res: Response) => {};

export const deleteSpecificTodo = async (req: Request, res: Response) => {};
