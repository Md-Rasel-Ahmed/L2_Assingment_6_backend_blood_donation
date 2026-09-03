import z from "zod"

export const createUserZodSchema = z.object({
  body: z.object({
    name: z.string("Name must be a string").optional(),

    email: z
      .string("Email is required")
      .email("Invalid email address"),

    password: z
      .string("Password must be a string")
      .min(6, "Password must be at least 6 characters long")
      .optional(),

    phone: z.string("Phone number must be a string").optional(),
    district: z.string("District must be a string").optional(),
    upazila: z.string("Upazila must be a string").optional(),
    address: z.string("Address must be a string").optional(),
  }),
});
export const loginUserZodSchema = z.object({
  body: z.object({

    email: z
      .string("Email is required")
      .email("Invalid email address"),

    password: z
      .string("Password must be a string")
      .min(6, "Password must be at least 6 characters long")
      .optional(),

    
  }),
});