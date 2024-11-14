import z from "zod";
const priorityValues = ["high", "medium", "low"] as const;

export const TodoSchema = z.object({
    name: z.string({ message: "product name should be a string" }).min(4),
    description: z
        .string({ message: "product description should be string" })
        .min(8),
    title: z.string({ message: "product price should be a string" }).min(10),
    file: z.instanceof(File, {
        message: "product image should be an image",
    }),
    priority: z.enum(priorityValues).default("medium"),
    dueDate: z.date({
        required_error: "Due date is required.",
    }),
});

export type todoSchema = z.infer<typeof TodoSchema>;
