import { Request, Response } from "express";

export const testAuth = async (req: Request, res: Response) => {
    res.json("hi test");
};
