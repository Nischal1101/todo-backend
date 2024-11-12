import { config } from "dotenv";
config();

const {
    PORT,
    NODE_ENV,
    DATABASE_URL,
    JWT_ACCESS_SECRET,
    ACCESS_TOKEN_EXPIRY_TIME,
} = process.env;
export const Config = {
    PORT,
    NODE_ENV,
    DATABASE_URL,
    JWT_ACCESS_SECRET,
    ACCESS_TOKEN_EXPIRY_TIME,
};
