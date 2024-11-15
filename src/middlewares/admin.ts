import { NextFunction, Request, Response } from "express";
import CustomErrorHandler from "../utils/CustomErrorHandler";

export const admin = (req: Request, res: Response, next: NextFunction) => {
    if (req.user.role === admin) next();
    else return next(new CustomErrorHandler(403, "unauthorized"));
};
