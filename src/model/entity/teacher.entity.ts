import { AccountRoleEnum } from "../enum/account-role.enum";
import { Account } from "./account.entity";

export interface Teacher extends Account {
  matricule: string;
  role: AccountRoleEnum.TEACHER;
}
