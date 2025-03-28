import { AccountRoleEnum } from "@/model/enum/account-role.enum";
import { BaseEntityWithUser } from "../base.entity";

export interface Account extends BaseEntityWithUser {
  email: string;
  password: string;
  role: AccountRoleEnum;
  contactDetailsId: number;
  personalCode: string;
}
