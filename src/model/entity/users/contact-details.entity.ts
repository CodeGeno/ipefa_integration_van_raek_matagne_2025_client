import { GenderEnum } from "@/model/enum/gender.enum";
import { BaseEntityWithUser } from "@/model/entity/base.entity";

export interface ContactDetails extends BaseEntityWithUser {
	first_name: string;
	last_name: string;
	birth_date: Date;
	gender: GenderEnum;
	phone_number: string;
	addressId: number;
}
