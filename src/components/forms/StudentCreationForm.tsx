"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { accountSchema, AccountFormData } from "@/model/schema/account.schema";
import { GenderEnum } from "@/model/enum/gender.enum";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { PersonalInfoForm } from "./PersonalInfoForm";
import { AddressForm } from "./AddressForm";
import { format } from "date-fns";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { jsPDF } from "jspdf";
import { useForm } from "react-hook-form";
import { post } from "@/app/fetch";
import { Account } from "@/model/entity/users/account.entity";
import { User, MapPin, Save, X, BadgeCheck } from "lucide-react";

export const StudentCreationForm: React.FC = () => {
	const [isSubmitting, setIsSubmitting] = useState(false);
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
				street: "",
				number: "",
				complement: "",
				zipCode: "",
				city: "",
				state: "",
				country: "Belgique",
			},
		},
	});

	const onSubmit = async (data: AccountFormData) => {
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
				"/security/create-student/",
				formattedData
			);

			if (response.success) {
				await new Promise((resolve) => setTimeout(resolve, 1500));
				setIsSubmitting(false);
				toast.success("Étudiant créé avec succès", {
					description: `L'étudiant ${data.contactDetails.firstName} ${data.contactDetails.lastName} a été créé avec succès. Vous allez être redirigé...`,
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

				// Fonction pour générer le PDF une fois l'image chargée
				const generatePDF = () => {
					// Titre principal - plus bas pour laisser de la place au logo
					doc.setFontSize(24);
					doc.setTextColor(
						titleColor[0],
						titleColor[1],
						titleColor[2]
					);
					doc.setFont("helvetica", "bold");
					doc.text(
						"Informations du compte étudiant",
						pageWidth / 2,
						margin + 30,
						{ align: "center" }
					);

					// Ligne de séparation
					doc.setDrawColor(
						titleColor[0],
						titleColor[1],
						titleColor[2]
					);
					doc.setLineWidth(0.5);
					doc.line(
						margin,
						margin + 35,
						pageWidth - margin,
						margin + 35
					);

					// Informations personnelles - Titre
					doc.setFontSize(16);
					doc.setTextColor(
						subtitleColor[0],
						subtitleColor[1],
						subtitleColor[2]
					);
					doc.text("Informations personnelles", margin, margin + 50);

					// Informations personnelles - Contenu
					doc.setFontSize(12);
					doc.setTextColor(textColor[0], textColor[1], textColor[2]);
					doc.setFont("helvetica", "normal");
					doc.text(
						`Nom: ${result.contactDetails.lastName}`,
						margin,
						margin + 65
					);
					doc.text(
						`Prénom: ${result.contactDetails.firstName}`,
						margin,
						margin + 75
					);
					doc.text(`Email: ${result.email}`, margin, margin + 85);
					doc.text(
						`Téléphone: ${result.contactDetails.phoneNumber}`,
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
					doc.text(
						`Rue: ${result.address.street}`,
						margin,
						margin + 130
					);
					doc.text(
						`Ville: ${result.address.city}`,
						margin,
						margin + 140
					);
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
				};

				// Gestionnaire pour les erreurs de chargement d'image
				img.onerror = () => {
					console.error(
						"Erreur de chargement du logo, génération du PDF sans logo"
					);
					// Générer le PDF sans logo
					generatePDF();
				};

				// Démarrer le chargement de l'image
				img.onload = generatePDF;
				img.src = logoPath;

				// Redirection après un court délai
				setTimeout(() => {
					router.push("/student/list");
				}, 1000);
			} else {
				throw new Error(response.message || "Une erreur est survenue");
			}
		} catch (error) {
			setIsSubmitting(false);
			toast.error("Erreur lors de la création", {
				description:
					"Une erreur est survenue lors de la création de l'étudiant. Veuillez réessayer.",
				duration: 5000,
			});
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-8"
			>
				<div className="grid gap-8">
					<Card className="border-none shadow-sm">
						<CardContent className="p-6">
							<div className="space-y-6">
								<div className="flex items-center gap-3">
									<div className="bg-primary/10 p-2 rounded-full">
										<User className="h-5 w-5 text-primary" />
									</div>
									<div>
										<h3 className="text-lg font-semibold">
											Informations personnelles
										</h3>
										<p className="text-sm text-muted-foreground">
											Renseignez les informations
											personnelles de l'étudiant
										</p>
									</div>
								</div>
								<PersonalInfoForm
									control={form.control}
									isEditing={false}
									disabled={isSubmitting}
								/>
							</div>
						</CardContent>
					</Card>

					<Card className="border-none shadow-sm">
						<CardContent className="p-6">
							<div className="space-y-6">
								<div className="flex items-center gap-3">
									<div className="bg-primary/10 p-2 rounded-full">
										<MapPin className="h-5 w-5 text-primary" />
									</div>
									<div>
										<h3 className="text-lg font-semibold">
											Adresse
										</h3>
										<p className="text-sm text-muted-foreground">
											Renseignez l'adresse de l'étudiant
										</p>
									</div>
								</div>
								<AddressForm
									control={form.control}
									disabled={isSubmitting}
								/>
							</div>
						</CardContent>
					</Card>
				</div>

				<div className="flex justify-end gap-4 pt-4">
					<Button
						type="button"
						variant="outline"
						onClick={() => router.push("/student/list")}
						className="flex items-center gap-2"
						disabled={isSubmitting}
					>
						<X className="h-4 w-4" />
						Annuler
					</Button>
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
								<Save className="h-4 w-4" />
								<span>Créer l'étudiant</span>
							</>
						)}
					</Button>
				</div>
			</form>
		</Form>
	);
};
