"use client";
import { AccountContext } from "@/app/context";
import { LoginForm } from "@/components/login-form";
import { useEffect } from "react";
import { useContext } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
	const router = useRouter();
	const { accountData } = useContext(AccountContext);
	useEffect(() => {
		if (accountData.role != "" && accountData.token != "") {
			router.push("/");
		}
	}, [accountData]);
	return (
		<div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
			<div className="w-full max-w-sm md:max-w-3xl">
				<LoginForm />
			</div>
		</div>
	);
}
