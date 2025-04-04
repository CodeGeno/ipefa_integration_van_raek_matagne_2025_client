import { z } from "zod";
import { AccountRoleEnum } from "@/model/enum/account-role.enum";
import { GenderEnum } from "@/model/enum/gender.enum";

export const addressSchema = z.object({
  street: z.string().min(1, "La rue est requise"),
  number: z.string().min(1, "Le numéro de rue est requis"),
  complement: z.string().optional(),
  zip_code: z.string().min(1, "Le code postal est requis"),
  city: z.string().min(1, "La ville est requise"),
  state: z.string().min(1, "La province est requise"),
  country: z.string().min(1, "Le pays est requis"),
});

export const contactDetailsSchema = z.object({
  first_name: z.string().min(1, "Le prénom est requis"),
  last_name: z.string().min(1, "Le nom est requis"),
  birth_date: z.date({
    required_error: "La date de naissance est requise",
    invalid_type_error: "Format de date invalide",
  }),
  gender: z.nativeEnum(GenderEnum, {
    required_error: "Le genre est requis",
  }),
  phone_number: z.string().min(1, "Le numéro de téléphone est requis"),
});

export const accountSchema = z.object({
  contact_details: contactDetailsSchema,
  address: addressSchema,
});

export type AccountFormData = z.infer<typeof accountSchema>;
