import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(120),
  email: z.email("Please enter a valid email."),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  lookingToBuild: z
    .string()
    .trim()
    .min(2, "Tell Naman what you are looking to build.")
    .max(400),
  message: z.string().trim().min(10, "Please add a short message.").max(4000),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const chatRequestSchema = z.object({
  message: z.string().trim().min(1, "Enter a question.").max(2000),
  sessionId: z.string().trim().min(8).max(128).optional(),
  sessionToken: z.string().trim().min(8).max(128).optional(),
});

export const speechRequestSchema = z.object({
  text: z.string().trim().min(1, "Enter text to speak.").max(4000),
});
