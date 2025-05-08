import { GenderEnum } from "@/model/enum/gender.enum";
import { BaseEntity } from "@/model/entity/base.entity";

export interface ContactDetails extends BaseEntity {
	addressId: number;
	firstName: string;
	lastName: string;
	birthDate: Date;
	gender: GenderEnum;
	phoneNumber: string;
}
