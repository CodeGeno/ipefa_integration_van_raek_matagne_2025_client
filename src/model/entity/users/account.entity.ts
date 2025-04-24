import { AccountRoleEnum } from "@/model/enum/account-role.enum";
import { BaseEntityWithUser } from "../base.entity";
import { ContactDetails } from "./contact-details.entity";
import { Address } from "./address.entity";
export interface Account {
	account_id: number;
	password: string;
	contactDetails: ContactDetails;
	email: string;
	address: Address;
	personalCode: string;
}
