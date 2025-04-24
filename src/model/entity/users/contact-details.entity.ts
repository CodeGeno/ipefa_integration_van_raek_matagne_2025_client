import { GenderEnum } from "@/model/enum/gender.enum";
import { BaseEntityWithUser } from "@/model/entity/base.entity";

export interface ContactDetails extends BaseEntityWithUser {
	addressId: number;
	firstName: string;
	lastName: string;
	birthDate: Date;
	gender: GenderEnum;
	phoneNumber: string;
}
