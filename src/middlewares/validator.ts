/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NextFunction, Request, Response } from "express";
import CustomErrorHandler from "../utils/CustomErrorHandler";
import { ZodError, ZodSchema } from "zod";

const validate =
    (schema: ZodSchema) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const parsedBody = await schema.parseAsync(req.body);
            req.body = parsedBody;  
            next();
        } catch (error: unknown) {
            if (error instanceof ZodError) {
                return next(
                    new CustomErrorHandler(
                        422,
                        error.errors?.[0]?.message || error.message,
                    ),
                );
            } else if (error instanceof CustomErrorHandler)
                return next(new CustomErrorHandler(500, error.message));
            else return next(new CustomErrorHandler(500, String(error)));
        }
    };
export default validate;
