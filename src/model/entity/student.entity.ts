import { AccountRoleEnum } from "../enum/account-role.enum";
import { Account } from "./account.entity";

export interface Student extends Account {
  matricule: string;
  role: AccountRoleEnum.STUDENT;
}
