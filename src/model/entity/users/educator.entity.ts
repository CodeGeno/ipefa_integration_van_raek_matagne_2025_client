import { AccountRoleEnum } from "@/model/enum/account-role.enum";
import { Account } from "@/model/entity/users/account.entity";

export interface Educator extends Account {
  role: AccountRoleEnum.EDUCATOR;
}
