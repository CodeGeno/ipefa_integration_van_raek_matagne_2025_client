"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useContext } from "react";
import { AccountContext } from "@/app/context";

export function LoginForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	interface LoginFormProps {
		email: string;
		password: string;
	}
	const [formData, setFormData] = useState<LoginFormProps>({
		email: "",
		password: "",
	});
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log(formData);
		fetch("http://localhost:8000/api/security/login/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(formData),
		})
			.then((res) => res.json())
			.then((data) => setUser(data))
			.catch((err) => console.error("Erreur:", err));
	};
	const [user, setUser] = useContext(AccountContext);
	return (
		<div
			className={cn("flex flex-col gap-6", className)}
			{...props}
		>
			<Card className="overflow-hidden">
				<CardContent className="grid p-0 md:grid-cols-2">
					<form
						className="p-6 md:p-8"
						onSubmit={handleSubmit}
					>
						<div className="flex flex-col gap-6">
							<div className="flex flex-col items-center text-center">
								<h1 className="text-2xl font-bold">
									Connexion
								</h1>
								<p className="text-balance text-muted-foreground">
									Connectez-vous à votre compte scolaire
								</p>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="email">Email</Label>
								<Input
									name="email"
									type="email"
									placeholder="m@example.com"
									required
									value={formData.email}
									onChange={handleChange}
								/>
							</div>
							<div className="grid gap-2">
								<div className="flex items-center">
									<Label htmlFor="password">Password</Label>
									<a
										href="#"
										className="ml-auto text-sm underline-offset-2 hover:underline"
									>
										Mot de passe oublié?
									</a>
								</div>
								<Input
									id="password"
									name="password"
									type="password"
									required
									value={formData.password}
									onChange={handleChange}
								/>
							</div>
							<Button
								type="submit"
								className="w-full"
							>
								Connexion
							</Button>
						</div>
					</form>
					<div className="relative hidden bg-muted md:block">
						<img
							src="https://i.pinimg.com/736x/56/59/d3/5659d3cc7968ba91c75f9576625cd553.jpg"
							alt="Image"
							className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
						/>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
