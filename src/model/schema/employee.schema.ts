import { z } from "zod";
import { AccountRoleEnum } from "@/model/enum/account-role.enum";
import { addressSchema } from "./address.schema";
import { contactDetailsSchema } from "./contact-details.schema";

export const employeeSchema = z.object({
	accountId: z.number(),
	role: z.enum(Object.keys(AccountRoleEnum) as [string, ...string[]]),
	contactDetails: contactDetailsSchema,
	address: addressSchema,
});

export type EmployeeFormData = z.infer<typeof employeeSchema>;
