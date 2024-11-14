import { Request } from "express";

export interface IReturnResponse {
    status: "success" | "error";
    message: string;
    data: object[] | object;
    token?: object;
}

export interface UserData {
    name: string;
    email: string;
    password: string;
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
export interface ITodoRequest extends Request {
    body: {
        title: string;
        description: string;
        dueDate: Date;
        priority: "high" | "medium" | "low";
    };
}

export interface IUpdateTodoRequest extends Request {
    body: {
        title?: string;
        description?: string;
        dueDate?: Date;
        priority?: "high" | "medium" | "low";
        userId: number;
    };
}
export interface ITodoDeleteRequest extends Request {
    body: {
        userId: number;
    };
}
