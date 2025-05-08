"use client";
import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AccountRoleEnum } from "@/model/enum/account-role.enum";
import { GenderEnum } from "@/model/enum/gender.enum";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
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
import { post } from "@/app/fetch";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export const EmployeeCreationForm: React.FC = () => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();
	const form = useForm<EmployeeFormData>({
		resolver: zodResolver(employeeSchema),
		defaultValues: {
			role: undefined,
			contactDetails: {
				firstName: "",
				lastName: "",
				birthDate: new Date(),
				gender: undefined,
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

	useEffect(() => {
		if (process.env.NODE_ENV === "development")
			if (Object.keys(form.formState.errors).length > 0) {
				console.log("Erreurs de validation:", form.formState.errors);
			}
	}, [form.formState.errors]);

	const onSubmit = async (data: EmployeeFormData) => {
		setIsSubmitting(true);

		try {
			// Convertir les données en snake_case pour le backend
			let formattedData = {
				...data,
				contactDetails: {
					...data.contactDetails,
					birthDate: format(
						data.contactDetails.birthDate,
						"yyyy-MM-dd"
					),
				},
			};

			// Utiliser un chemin relatif pour l'API
			const response = await post(
				"/security/create-employee/",
				formattedData
			);

			if (response.success !== true) {
				toast({
					title: "Erreur",
					description: response.message,
					variant: "destructive",
				});
				return;
			} else {
				// Afficher un message de succès
				toast({
					title: "Succès",
					description: "Le compte employé a été créé avec succès",
				});

				setTimeout(() => {
					router.push("/employee/list");
				}, 3000);
			}
		} catch (error) {
			console.error("Erreur:", error);
			toast({
				title: "Erreur",
				description:
					error instanceof Error
						? error.message
						: "Une erreur est survenue lors de la création du compte",
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="flex flex-col  align-center container  py-8 w-full">
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
								form.setValue("role", value as AccountRoleEnum)
							}
							defaultValue={AccountRoleEnum.EDUCATOR}
						>
							<SelectTrigger>
								<SelectValue placeholder="Sélectionnez un rôle" />
							</SelectTrigger>
							<SelectContent>
								{Object.keys(AccountRoleEnum)
									.filter((r) => r !== "STUDENT")
									.map((role) => {
										const roleKey =
											role as keyof typeof AccountRoleEnum;
										return (
											<SelectItem
												key={role}
												value={role}
											>
												{AccountRoleEnum[roleKey]}
											</SelectItem>
										);
									})}
							</SelectContent>
						</Select>

						<PersonalInfoForm
							control={form.control}
							isEditing={false}
						/>

						<AddressForm control={form.control} />
						<div className="flex justify-center">
							<Button
								type="submit"
								size="lg"
								disabled={isSubmitting}
							>
								{form.formState.isValid
									? "Créer le compte"
									: "Veuillez remplir tous les champs"}
								{}
							</Button>
						</div>
					</form>
				</Form>
			</CardContent>
		</div>
	);
};
