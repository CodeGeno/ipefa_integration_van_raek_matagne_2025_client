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
import { patch } from "@/app/fetch";
import { toast } from "@/hooks/use-toast";
import { Employee } from "@/model/entity/lessons/employee.entity";
import { useRouter } from "next/navigation";
export const EmployeeEditForm: React.FC<{
	employee: Employee;
	isEditing: boolean;
}> = ({ employee, isEditing }) => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();
	const form = useForm<EmployeeFormData>({
		resolver: zodResolver(employeeSchema),
		defaultValues: {
			...employee,
			contactDetails: {
				...employee.contactDetails,
				birthDate: new Date(employee.contactDetails.birthDate),
			},
		},
	});

	useEffect(() => {
		if (Object.keys(form.formState.errors).length > 0) {
			console.log("Erreurs de validation:", form.formState.errors);
		}
	}, [form]);

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
			const response = await patch(
				`/security/employee/edit/${employee.accountId}/`,
				formattedData
			);

			const result = await response;
			console.log("Résultat:", result);

			// Afficher un message de succès
			toast({
				title: "Succès",
				description: "Le compte employé a été modifié avec succès",
			});
			setTimeout(() => {
				router.push("/employee/list");
			}, 1500);
		} catch (error) {
			toast({
				title: "Erreur",
				description:
					error instanceof Error
						? error.message
						: "Une erreur est survenue lors de la modification du compte",
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="container max-w-2xl py-8">
			<Card>
				<CardHeader>
					<CardTitle className="text-center text-2xl">
						Modification d'un compte employé
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
								}
								defaultValue={employee.role}
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

							<PersonalInfoForm control={form.control} />

							<AddressForm control={form.control} />
							<div className="flex justify-center">
								<Button
									type="submit"
									size="lg"
									disabled={isSubmitting}
								>
									{form.formState.isValid
										? "Mettre à jour le compte"
										: "Veuillez corriger tous les champs"}
								</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
};
