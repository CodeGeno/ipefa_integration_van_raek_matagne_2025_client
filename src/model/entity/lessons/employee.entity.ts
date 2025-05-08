import { Account } from "../users/account.entity";

export interface Employee extends Account {
	matricule: string;
}
