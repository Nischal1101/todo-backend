import { Request, Response } from "express";

const notFoundError = (req: Request, res: Response) => {
    return res.status(404).json({
        status: "error",
        message: `${req.originalUrl} not found on this server`,
        data: {},
    });
};
export default notFoundError;
