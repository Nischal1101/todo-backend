import {
    date,
    integer,
    pgEnum,
    pgTable,
    serial,
    text,
    timestamp,
    varchar,
} from "drizzle-orm/pg-core";

// Users table
export const roleEnum = pgEnum("role", ["admin", "user"]);
export const statusEnum = pgEnum("status", ["complete", "incomplete"]);
export const priorityEnum = pgEnum("priority", ["high", "medium", "low"]);

const Users = pgTable("users", {
    id: serial("id").primaryKey(),
    name: varchar("name").notNull(),
    email: varchar("email").notNull().unique(),
    password: text("password").notNull(),
    role: roleEnum("role").default("user"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Todos table
const Todos = pgTable("todos", {
    id: serial("id").primaryKey(),
    title: varchar("title").notNull(),
    description: text("description"),
    dueDate: date("due_date").notNull(),
    priority: priorityEnum("priority").default("low"),
    status: statusEnum("status").default("incomplete"),
    userId: integer("user_id")
        .references(() => Users.id, { onDelete: "cascade" })
        .notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Files table
const Files = pgTable("files", {
    id: serial("id").primaryKey(),
    fileName: varchar("file_name").notNull(),
    filePath: text("file_path").notNull(),
    todoId: integer("todo_id")
        .references(() => Todos.id, { onDelete: "cascade" })
        .notNull()
        .unique(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Notifications table
const Notifications = pgTable("notifications", {
    id: serial("id").primaryKey(),
    type: varchar("type").notNull(),
    message: text("message").notNull(),
    userId: integer("user_id")
        .references(() => Users.id)
        .notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

export { Files, Notifications, Todos, Users };
