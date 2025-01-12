const { z } = require("zod");

const registerSchema = z.object({
    name: z
        .string()
        .min(1, "Name is required")
        .max(50, "Name must be less than 50 characters"),
    email: z
        .string()
        .email("Invalid email address")
        .optional()
        .or(z.literal("").transform(() => undefined)), // Allow optional email
    phone_number: z
        .string()
        .regex(/^\+?[0-9]{10,15}$/, "Invalid phone number")
        .optional()
        .or(z.literal("").transform(() => undefined)), // Allow optional phone number
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

const loginSchema = z.object({
    email: z
        .string()
        .email("Invalid email address")
        .optional()
        .or(z.literal("").transform(() => undefined)), // Allow optional email
    phone_number: z
        .string()
        .regex(/^\+?[0-9]{10,15}$/, "Invalid phone number")
        .optional()
        .or(z.literal("").transform(() => undefined)), // Allow optional phone number
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

module.exports = { registerSchema, loginSchema };
