import { z } from "zod";

export const userLoginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email bos birakilamaz.")
    .email("Gecerli bir email adresi yazmalisin."),
  password: z.string().min(1, "Sifre bos birakilamaz."),
  redirectTo: z.string().trim().optional(),
});
