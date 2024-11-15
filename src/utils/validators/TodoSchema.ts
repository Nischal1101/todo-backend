import z from "zod";
const priorityValues = ["high", "medium", "low"] as const;

export const TodoSchema = z.object({
    description: z
        .string({ required_error: " description is  a required field" })
        .min(8, { message: "description must contain at least 8 chars" }),
    title: z
        .string({ required_error: "title is  a required field" })
        .min(5, { message: "title must contain at least 5 chars" }),
    // file: z.instanceof(File, {
    //     message: "File should be an image.",
    // }),
    priority: z.enum(priorityValues).default("medium"),
    dueDate: z.string().refine(
        (date) => {
            const parsedDate = new Date(date);
            return !isNaN(parsedDate.getTime()) && parsedDate > new Date();
        },
        {
            message: "Due date must be a valid future date",
        },
    ),
});

export type todoSchema = z.infer<typeof TodoSchema>;
