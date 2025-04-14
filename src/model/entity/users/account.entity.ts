import { AccountRoleEnum } from "@/model/enum/account-role.enum";
import { BaseEntityWithUser } from "../base.entity";
import { ContactDetails } from "./contact-details.entity";
import { Address } from "./address.entity";
export interface Account {
	account_id: number;
	email: string;
	password: string;
	role: AccountRoleEnum;
	contact_details: ContactDetails;
	student_email: string;
	employee_email: string;
	address: Address;
	personalCode: string;
}
