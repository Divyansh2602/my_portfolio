import { z } from "zod";

/** Shared contact validation — used client-side (RHF) and server-side. */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(80, "Name is too long"),
  email: z.email("Enter a valid email").max(120),
  message: z
    .string()
    .trim()
    .min(10, "Tell me a bit more")
    .max(2000, "Message is too long"),
});

export type ContactInput = z.infer<typeof contactSchema>;

/** Honeypot field name — must arrive empty; bots fill it. Deliberately
 *  non-semantic so browser autofill / password managers leave it alone
 *  (a name like "company"/"email" gets autofilled and drops real users). */
export const HONEYPOT = "hp_token";
