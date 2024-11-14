import z from "zod";
export const RegisterSchema = z.object({
    email: z
        .string({ required_error: "email is a required field" })
        .email({ message: "email should be in correct format" }),
    password: z
        .string({ required_error: "password is a required field" })
        .min(5, { message: "Password should be at least 5 chars long" }),
    name: z
        .string({ required_error: "name is a required field" })
        .min(4, { message: "name should be at least 4 chars long" }),
});

export type registerSchema = z.infer<typeof RegisterSchema>;
