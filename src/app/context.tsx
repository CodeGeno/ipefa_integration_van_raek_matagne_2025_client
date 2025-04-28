import { createContext } from "react";
import { Account } from "@/model/entity/users/account.entity";

interface AccountData {
	token: string;
	role: string;
	account?: Account;
}

interface AccountContextType {
	accountData: AccountData;
	setAccountData: (data: AccountData) => void;
	handleUnauthorized: () => void;
}

export const AccountContext = createContext<AccountContextType>({
	accountData: { token: "", role: "" },
	setAccountData: () => {},
	handleUnauthorized: () => {},
});
