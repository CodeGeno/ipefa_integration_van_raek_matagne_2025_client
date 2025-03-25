import { AccountRoleEnum } from "../enum/account-role.enum";
import { Account } from "./account.entity";

export interface Educator extends Account {
  role: AccountRoleEnum.EDUCATOR;
}
