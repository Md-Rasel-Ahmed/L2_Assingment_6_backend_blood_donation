import z from "zod"
const BloodGroupEnum = z.enum([
  "A_POSITIVE",
  "A_NEGATIVE",
  "B_POSITIVE",
  "B_NEGATIVE",
  "AB_POSITIVE",
  "AB_NEGATIVE",
  "O_POSITIVE",
  "O_NEGATIVE"
]);

export const createDonorZodSchema = z.object({
  body: z.object({
    bloodGroup: BloodGroupEnum,

    isAvailable: z.boolean("isAvailable must be a boolean").optional(),
    lastDonatedAt: z.string("lastDonatedAt must be a valid date string").optional(),
    totalDonations: z.number("totalDonations must be a number").optional(),
  }),
});