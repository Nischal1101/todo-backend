import { drizzle } from "drizzle-orm/postgres-js";
import { Config } from "../config";
const db = drizzle(Config.DATABASE_URL as string);

export default db;
