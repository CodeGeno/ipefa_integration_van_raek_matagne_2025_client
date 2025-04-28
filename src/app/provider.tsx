"use client";
import { Account } from "@/model/entity/users/account.entity";
import { AccountContext } from "./context";
import { createContext, useContext, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface AccountData {
	token: string;
	role: string;
	account?: Account;
}

const AppProvider = ({ children }: { children: React.ReactNode }) => {
	const [accountData, setAccountData] = useState<AccountData>({
		token: "",
		role: "",
		account: undefined,
	});
	const { toast } = useToast();
	const router = useRouter();

	useEffect(() => {
		const token = localStorage.getItem("token");
		const role = localStorage.getItem("role");
		try {
			const accountStr = localStorage.getItem("account");
			const account = accountStr ? JSON.parse(accountStr) : undefined;

			setAccountData({
				token: token || "",
				role: role || "",
				account,
			});
		} catch (error) {
			console.error("Erreur lors de la récupération du compte:", error);
			setAccountData({
				token: token || "",
				role: role || "",
			});
		}

		toast({
			title: `token: ${token || ""}`,
			description: "Vous êtes connecté avec succès",
		});
	}, []);

	const handleUnauthorized = () => {
		toast({
			title: "Vous n'êtes pas autorisé à accéder à cette page",
			description: "Vous allez être redirigé vers la page de connexion",
			variant: "destructive",
		});
		setAccountData({
			token: "",
			role: "",
			account: undefined,
		});

		// Suppression des données d'authentification du localStorage
		localStorage.removeItem("token");
		localStorage.removeItem("role");
		localStorage.removeItem("account");

		setTimeout(() => {
			router.push("/login");
		}, 2000);
	};

	return (
		<AccountContext.Provider
			value={{ accountData, setAccountData, handleUnauthorized }}
		>
			{children}
		</AccountContext.Provider>
	);
};

export default AppProvider;
