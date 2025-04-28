"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { accountSchema, AccountFormData } from "@/model/schema/account.schema";
import { AccountRoleEnum } from "@/model/enum/account-role.enum";
import { GenderEnum } from "@/model/enum/gender.enum";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { PersonalInfoForm } from "./PersonalInfoForm";
import { AddressForm } from "./AddressForm";
import { format } from "date-fns";
import {
	employeeSchema,
	EmployeeFormData,
} from "@/model/schema/employee.schema";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export const EmployeeCreationForm: React.FC = () => {
	const form = useForm<EmployeeFormData>({
		resolver: zodResolver(employeeSchema),
		defaultValues: {
			role: AccountRoleEnum.EDUCATOR,
			contactDetails: {
				firstName: "",
				lastName: "",
				birthDate: new Date(),
				gender: GenderEnum.MALE,
				phoneNumber: "",
			},
			address: {
				street: "123 rue de la paix ",
				number: "123",
				complement: "app 123",
				zipCode: "123456",
				city: "Paris",
				state: "Île-de-France",
				country: "France",
			},
		},
	});

	const onSubmit = async (data: EmployeeFormData) => {
		console.log(data);
		try {
			// Convertir les données en snake_case pour le backend
			const formattedData = {
				contactDetails: {
					firstName: data.contactDetails.firstName,
					lastName: data.contactDetails.lastName,
					birthDate: format(
						data.contactDetails.birthDate,
						"yyyy-MM-dd"
					),
					gender: data.contactDetails.gender,
					phoneNumber: data.contactDetails.phoneNumber,
				},
				address: {
					street: data.address.street,
					number: data.address.number,
					complement: data.address.complement,
					zipCode: data.address.zipCode,
					city: data.address.city,
					state: data.address.state,
					country: data.address.country,
				},
			};

			const response = await fetch(
				"http://127.0.0.1:8000/api/security/create-student/",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(formattedData),
				}
			);

			if (!response.ok) {
				const errorMessage = await response.text();
				throw new Error(
					`Erreur lors de la soumission des données: ${response.status} ${errorMessage}`
				);
			}

			const result = await response.json();
			console.log("rez", result);
		} catch (error) {
			console.error("Erreur:", error);
		}
	};

	return (
		<div className="container max-w-2xl py-8">
			<Card>
				<CardHeader>
					<CardTitle className="text-center text-2xl">
						Création d'un compte employé
					</CardTitle>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-6"
						>
							<Select
								onValueChange={(value) =>
									form.setValue(
										"role",
										value as AccountRoleEnum
									)
								} // Correction ici
								defaultValue={form.getValues("role")}
							>
								<SelectTrigger>
									<SelectValue placeholder="Sélectionnez un rôle" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value={AccountRoleEnum.TEACHER}>
										Enseignant
									</SelectItem>
									<SelectItem
										value={AccountRoleEnum.EDUCATOR}
									>
										{" "}
										{/* Ajoutez d'autres rôles si nécessaire */}
										Éducateur
									</SelectItem>
									{/* Ajoutez d'autres SelectItem ici si nécessaire */}
								</SelectContent>
							</Select>
							{/* Informations personnelles */}
							<PersonalInfoForm control={form.control} />
							{/* Adresse */}
							<AddressForm control={form.control} />
							<div className="flex justify-center">
								<Button
									type="submit"
									size="lg"
								>
									Créer le compte
								</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
};
