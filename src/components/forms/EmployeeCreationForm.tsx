"use client";
import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AccountRoleEnum } from "@/model/enum/account-role.enum";
import { GenderEnum } from "@/model/enum/gender.enum";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
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
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { BadgeCheck, Loader2, Shield } from "lucide-react";
import { jsPDF } from "jspdf";
import { Account } from "@/model/entity/users/account.entity";

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
				street: "",
				number: "",
				complement: "",
				zipCode: "",
				city: "",
				state: "",
				country: "",
			},
		},
	});

	useEffect(() => {
		if (process.env.NODE_ENV === "development")
			if (Object.keys(form.formState.errors).length > 0) {
			}
	}, [form.formState.errors]);

	const onSubmit = async (data: EmployeeFormData) => {
		if (isSubmitting) return;

		try {
			setIsSubmitting(true);
			const formattedData = {
				...data,
				contactDetails: {
					...data.contactDetails,
					birthDate: format(
						data.contactDetails.birthDate,
						"yyyy-MM-dd"
					),
				},
			};

			const response = await post(
				"/security/create-employee/",
				formattedData
			);

			if (response.success) {
				await new Promise((resolve) => setTimeout(resolve, 1500));
				setIsSubmitting(false);
				toast.success("Employé créé avec succès", {
					description: `L'employé ${data.contactDetails.firstName} ${data.contactDetails.lastName} a été créé avec succès. Vous allez être redirigé...`,
					duration: 3000,
					icon: <BadgeCheck className="h-5 w-5 text-green-500" />,
				});

				const result = response.data as Account;
				const doc = new jsPDF();

				// Ajout des styles et couleurs
				const titleColor = [0, 102, 204]; // Bleu
				const subtitleColor = [64, 64, 64]; // Gris foncé
				const textColor = [0, 0, 0]; // Noir
				const highlightColor = [255, 102, 0]; // Orange

				// Configuration des marges et de la taille
				const margin = 20;
				const pageWidth = doc.internal.pageSize.width;

				// Titre principal
				doc.setFontSize(24);
				doc.setTextColor(titleColor[0], titleColor[1], titleColor[2]);
				doc.setFont("helvetica", "bold");
				doc.text(
					"Informations du compte employé",
					pageWidth / 2,
					margin + 20,
					{ align: "center" }
				);

				// Ligne de séparation
				doc.setDrawColor(titleColor[0], titleColor[1], titleColor[2]);
				doc.setLineWidth(0.5);
				doc.line(margin, margin + 25, pageWidth - margin, margin + 25);

				// Informations personnelles - Titre
				doc.setFontSize(16);
				doc.setTextColor(
					subtitleColor[0],
					subtitleColor[1],
					subtitleColor[2]
				);
				doc.text("Informations personnelles", margin, margin + 40);

				// Informations personnelles - Contenu
				doc.setFontSize(12);
				doc.setTextColor(textColor[0], textColor[1], textColor[2]);
				doc.setFont("helvetica", "normal");
				doc.text(
					`Nom: ${result.contactDetails.lastName}`,
					margin,
					margin + 55
				);
				doc.text(
					`Prénom: ${result.contactDetails.firstName}`,
					margin,
					margin + 65
				);
				doc.text(`Email: ${result.email}`, margin, margin + 75);
				doc.text(
					`Téléphone: ${result.contactDetails.phoneNumber}`,
					margin,
					margin + 85
				);
				doc.text(
					`Rôle: ${
						AccountRoleEnum[
							result.role as keyof typeof AccountRoleEnum
						]
					}`,
					margin,
					margin + 95
				);

				// Adresse - Titre
				doc.setFontSize(16);
				doc.setTextColor(
					subtitleColor[0],
					subtitleColor[1],
					subtitleColor[2]
				);
				doc.setFont("helvetica", "bold");
				doc.text("Adresse", margin, margin + 115);

				// Adresse - Contenu
				doc.setFontSize(12);
				doc.setTextColor(textColor[0], textColor[1], textColor[2]);
				doc.setFont("helvetica", "normal");
				doc.text(`Rue: ${result.address.street}`, margin, margin + 130);
				doc.text(`Ville: ${result.address.city}`, margin, margin + 140);
				doc.text(
					`Code postal: ${result.address.zipCode}`,
					margin,
					margin + 150
				);
				doc.text(
					`Pays: ${result.address.country}`,
					margin,
					margin + 160
				);

				// Informations de connexion - Titre
				doc.setFontSize(16);
				doc.setTextColor(
					subtitleColor[0],
					subtitleColor[1],
					subtitleColor[2]
				);
				doc.setFont("helvetica", "bold");
				doc.text("Informations de connexion", margin, margin + 180);

				// Informations de connexion - Contenu
				doc.setFontSize(12);
				doc.setTextColor(
					highlightColor[0],
					highlightColor[1],
					highlightColor[2]
				);
				doc.setFont("helvetica", "bold");
				doc.text(
					`Mot de passe initial: ${result.password}`,
					margin,
					margin + 195
				);

				// Note importante
				doc.setFontSize(10);
				doc.setTextColor(255, 0, 0); // Rouge
				doc.text(
					"Note importante: Veuillez changer votre mot de passe lors de votre première connexion.",
					margin,
					margin + 210
				);

				// Pied de page
				doc.setFontSize(8);
				doc.setTextColor(100, 100, 100); // Gris clair
				doc.text(
					`Document généré le ${new Date().toLocaleDateString(
						"fr-BE"
					)}`,
					pageWidth / 2,
					doc.internal.pageSize.height - 10,
					{ align: "center" }
				);

				// Affichage du PDF
				doc.output("dataurlnewwindow");

				// Redirection après un court délai
				setTimeout(() => {
					router.push("/employee/list");
				}, 1000);
			} else {
				throw new Error(response.message || "Une erreur est survenue");
			}
		} catch (error) {
			setIsSubmitting(false);
			toast.error("Erreur lors de la création", {
				description:
					"Une erreur est survenue lors de la création de l'employé. Veuillez réessayer.",
				duration: 5000,
			});
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-lg">Création d'un employé</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-6"
					>
						<div className="grid gap-6">
							<FormField
								control={form.control}
								name="role"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Rôle</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
											disabled={isSubmitting}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Sélectionner un rôle" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{Object.keys(AccountRoleEnum)
													.filter(
														(role) =>
															role !== "STUDENT"
													)
													.map((role) => (
														<SelectItem
															key={role}
															value={role}
														>
															{
																AccountRoleEnum[
																	role as keyof typeof AccountRoleEnum
																]
															}
														</SelectItem>
													))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							<PersonalInfoForm
								control={form.control}
								isEditing={false}
								disabled={isSubmitting}
							/>
							<AddressForm
								control={form.control}
								disabled={isSubmitting}
							/>
						</div>

						<div className="flex justify-end pt-4">
							<Button
								type="submit"
								className="flex items-center gap-2"
								disabled={isSubmitting}
							>
								{isSubmitting ? (
									<>
										<div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
										<span>Enregistrement...</span>
									</>
								) : (
									<>
										<Shield className="h-4 w-4" />
										<span>Enregistrer</span>
									</>
								)}
							</Button>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};
