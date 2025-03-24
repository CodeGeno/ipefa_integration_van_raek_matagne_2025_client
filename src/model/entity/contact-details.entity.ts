import { GenderEnum } from "../enum/gender.enum";
import { BaseEntityWithUser } from "./base.entity";

export interface ContactDetails extends BaseEntityWithUser {
  firstName: string;
  lastName: string;
  birthDate: Date;
  gender: GenderEnum;
  phoneNumber: string;
  addressId: number;
}
