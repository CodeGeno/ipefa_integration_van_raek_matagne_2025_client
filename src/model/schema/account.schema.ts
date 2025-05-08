import { z } from "zod";

import { addressSchema } from "./address.schema";
import { contactDetailsSchema } from "./contact-details.schema";

export const accountSchema = z.object({
	contactDetails: contactDetailsSchema,
	address: addressSchema,
});

export type AccountFormData = z.infer<typeof accountSchema>;
