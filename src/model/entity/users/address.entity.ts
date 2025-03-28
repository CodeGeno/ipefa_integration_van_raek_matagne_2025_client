import { BaseEntityWithUser } from "@/model/entity/base.entity";

export interface Address extends BaseEntityWithUser {
  street: string;
  streetNumber: string;
  complement: string;
  zipCode: string;
  city: string;
  state: string;
  country: string;
}
