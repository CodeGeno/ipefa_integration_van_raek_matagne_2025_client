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
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { jsPDF } from "jspdf";

export const StudentCreationForm: React.FC = () => {
	const { toast } = useToast();
	const router = useRouter();
	const form = useForm<AccountFormData>({
		resolver: zodResolver(accountSchema),
		defaultValues: {
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

	const onSubmit = async (data: AccountFormData) => {
		try {
			let formattedData = { ...data };
			formattedData.contactDetails.birthDate = format(
				data.contactDetails.birthDate,
				"yyyy-MM-dd"
			) as unknown as Date;
			console.log(formattedData);

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
			toast({
				title: "Compte créé avec succès",
				description: "Le compte a été créé avec succès",
			});

			const result = await response.json();
			const doc = new jsPDF();

			// Exemple de contenu
			doc.text("Informations du compte", 10, 10);
			doc.text(
				`Nom: ${result.data.contactDetails.firstName} ${result.data.contactDetails.lastName}`,
				10,
				20
			);
			doc.text(`Email: ${result.data.email}`, 10, 30);
			doc.text(
				`Téléphone: ${result.data.contactDetails.phoneNumber}`,
				10,
				40
			);

			doc.text(
				`Adresse: ${result.data.address.street}, ${result.data.address.city}, ${result.data.address.zipCode}, ${result.data.address.country}`,
				10,
				50
			);
			doc.text(`Mot de passe: ${result.data.password}`, 10, 60);
			// Sauvegarde du fichier avec le nom basé sur le prénom et le nom
			const fileName = `${result.data.contactDetails.firstName}${result.data.contactDetails.lastName}.pdf`;
			doc.output("dataurlnewwindow");
		} catch (error) {
			console.error("Erreur:", error);
		}
	};

	return (
		<div className="container max-w-2xl py-8">
			<Card>
				<CardHeader>
					<CardTitle className="text-center text-2xl">
						Création d'un compte étudiant
					</CardTitle>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-6"
						>
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
