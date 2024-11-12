import { NextFunction, Request, Response } from "express";
import CustomErrorHandler from "./CustomErrorHandler";

const asyncErrorHandler =
    (
        fn: (
            req: Request,
            res: Response,
            next: NextFunction,
        ) => Promise<unknown>,
    ) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req, res, next);
        } catch (err: unknown) {
            if (err instanceof CustomErrorHandler)
                return next(new CustomErrorHandler(500, err.message));
        }
    };

export default asyncErrorHandler;
