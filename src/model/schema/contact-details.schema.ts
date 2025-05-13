import { z } from "zod";
import { GenderEnum } from "../enum/gender.enum";

export const contactDetailsSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  birthDate: z
    .date({
      required_error: "La date de naissance est requise",
      invalid_type_error: "Format de date invalide",
    })
    .max(
      new Date(
        new Date().getFullYear() - 18,
        new Date().getMonth(),
        new Date().getDate()
      ),
      {
        message: "Vous devez avoir au moins 18 ans pour créer un compte",
      }
    ),
  gender: z.enum(Object.keys(GenderEnum) as [string, ...string[]]),
  phoneNumber: z.string().min(1, "Le numéro de téléphone est requis"),
});
