import { GenderEnum } from "@/model/enum/gender.enum";
import { BaseEntityWithUser } from "@/model/entity/base.entity";

export interface ContactDetails extends BaseEntityWithUser {
  firstName: string;
  lastName: string;
  birthDate: Date;
  gender: GenderEnum;
  phoneNumber: string;
  addressId: number;
}
