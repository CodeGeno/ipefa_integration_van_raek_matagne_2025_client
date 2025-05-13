import { AccountRoleEnum } from "@/model/enum/account-role.enum";
import { BaseEntity } from "../base.entity";
import { ContactDetails } from "./contact-details.entity";
import { Address } from "./address.entity";
export interface Account extends BaseEntity {
	password: string;
	contactDetails: ContactDetails;
	email: string;
	address: Address;
	identifier: string;
	role: AccountRoleEnum;
}
