import z from "zod";
export const LoginSchema = z.object({
    email: z
        .string({ required_error: "email is a required field" })
        .email({ message: "email should be in correct format" }),
    password: z
        .string({ required_error: "password is a required field" })
        .min(5, { message: "Password should be at least 5 chars long" }),
});
export type loginSchema = z.infer<typeof LoginSchema>;
