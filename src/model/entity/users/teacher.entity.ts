import { AccountRoleEnum } from "@/model/enum/account-role.enum";
import { Account } from "@/model/entity/users/account.entity";

export interface Teacher extends Account {
  matricule: string;
  role: AccountRoleEnum.TEACHER;
}
