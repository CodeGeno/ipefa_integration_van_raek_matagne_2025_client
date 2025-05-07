import { BaseEntityWithUser } from "@/model/entity/base.entity";

export interface Address extends BaseEntityWithUser {
	addressId: number;
	street: string;
	number: string;
	complement: string;
	zipCode: string;
	city: string;
	state: string;
	country: string;
}
