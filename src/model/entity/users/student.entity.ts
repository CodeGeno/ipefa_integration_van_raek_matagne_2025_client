import { AccountRoleEnum } from "@/model/enum/account-role.enum";
import { Account } from "@/model/entity/users/account.entity";

export interface Student extends Account {
	identifier: string;
	role: AccountRoleEnum.STUDENT;
}
