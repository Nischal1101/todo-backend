import { config } from "dotenv";
config();

const { PORT, NODE_ENV, DATABASE_URL } = process.env;
export const Config = {
    PORT,
    NODE_ENV,
    DATABASE_URL,
};
