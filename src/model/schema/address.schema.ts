import { z } from "zod";

export const addressSchema = z.object({
	street: z.string().min(1, "La rue est requise"),
	number: z.string().min(1, "Le numéro de rue est requis"),
	complement: z.string().optional(),
	zipCode: z.string().min(1, "Le code postal est requis"),
	city: z.string().min(1, "La ville est requise"),
	state: z.string().min(1, "La province est requise"),
	country: z.string().min(1, "Le pays est requis"),
});
