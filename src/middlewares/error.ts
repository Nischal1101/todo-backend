import { NextFunction, Request, Response } from "express";
import CustomErrorHandler from "../utils/CustomErrorHandler";
import logger from "../config/logger";

const error = (
    err: CustomErrorHandler,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction,
) => {
    logger.error(err.message);

    const statusCode = err.statusCode || 500;
    return res.status(statusCode).json({
        status: "error",
        message: err.message,
        stack: err.stack || "no",
        data: {},
    });
};

export default error;
