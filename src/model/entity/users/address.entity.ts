import { BaseEntity } from "@/model/entity/base.entity";

export interface Address extends BaseEntity {
	street: string;
	number: string;
	complement: string;
	zipCode: string;
	city: string;
	state: string;
	country: string;
}
