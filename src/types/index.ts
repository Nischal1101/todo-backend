import { Request } from "express";

export interface ReturnResponse {
    status: "success" | "error";
    message: string;
    data: object[] | object;
    token?: object;
}

export interface UserData {
    name: string;
    email: string;
    password: string;
    role?: "admin" | "user";
}

export interface IRegisterUserRequest extends Request {
    body: UserData;
}
export interface ILoginUserRequest extends Request {
    body: {
        email: string;
        password: string;
    };
}
