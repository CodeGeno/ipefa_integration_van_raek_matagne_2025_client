import { z } from "zod";
import { AccountRoleEnum } from "@/model/enum/account-role.enum";
import { GenderEnum } from "@/model/enum/gender.enum";

export const addressSchema = z.object({
  street: z.string().min(1, "La rue est requise"),
  streetNumber: z.string().min(1, "Le numéro de rue est requis"),
  complement: z.string().optional(),
  zipCode: z.string().min(1, "Le code postal est requis"),
  city: z.string().min(1, "La ville est requise"),
  state: z.string().min(1, "La province est requise"),
  country: z.string().min(1, "Le pays est requis"),
});

export const contactDetailsSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  birthDate: z.date({
    required_error: "La date de naissance est requise",
    invalid_type_error: "Format de date invalide",
  }),
  gender: z.nativeEnum(GenderEnum, {
    required_error: "Le genre est requis",
  }),
  phoneNumber: z.string().min(1, "Le numéro de téléphone est requis"),
});

export const accountSchema = z.object({
  contactDetails: contactDetailsSchema,
  address: addressSchema,
});

export type AccountFormData = z.infer<typeof accountSchema>;
