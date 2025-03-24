import { BaseEntityWithUser } from "./base.entity";

export interface Address extends BaseEntityWithUser {
  street: string;
  streetNumber: string;
  complement: string;
  zipCode: string;
  city: string;
  state: string;
  country: string;
}
