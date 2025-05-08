"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { SectionTypeEnum } from "@/model/enum/section-type.enum";
import { SectionCategoryEnum } from "@/model/enum/section-category.enum";
import { patch } from "@/app/fetch";
import { sectionSchema, SectionFormData } from "@/model/schema/section.schema";
import { Textarea } from "@/components/ui/textarea";
import { Section } from "@/model/entity/ue/section.entity";
import { useState, useEffect } from "react";
import { get } from "@/app/fetch";

export const SectionEditForm = ({ id }: { id: string }) => {
	const router = useRouter();
	const [section, setSection] = useState<Section | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// Initialisation du formulaire avec React Hook Form
	const form = useForm<SectionFormData>({
		resolver: zodResolver(sectionSchema),
		// On initialise avec des valeurs vides
		defaultValues: {
			name: "",
			sectionType: undefined,
			sectionCategory: undefined,
			description: "",
		},
	});

	useEffect(() => {
		fetchSection();
	}, [id]);

	const fetchSection = async () => {
		try {
			setIsLoading(true);
			const response = await get<Section>(`/section/${id}`);
			const sectionData = response.data;

			if (sectionData) {
				setSection(sectionData);

				// Conversion des enums en chaînes pour le formulaire
				const sectionTypeKey = Object.keys(SectionTypeEnum).find(
					(key) =>
						SectionTypeEnum[key as keyof typeof SectionTypeEnum] ===
						sectionData.sectionType
				);

				const sectionCategoryKey = Object.keys(
					SectionCategoryEnum
				).find(
					(key) =>
						SectionCategoryEnum[
							key as keyof typeof SectionCategoryEnum
						] === sectionData.sectionCategory
				);

				// Mise à jour des valeurs du formulaire après chargement des données
				form.reset({
					name: sectionData.name || "",
					sectionType: sectionTypeKey,
					sectionCategory: sectionCategoryKey,
					description: sectionData.description || "",
				});
			} else {
				toast({
					title: "Erreur",
					description: "Données de section invalides",
					variant: "destructive",
				});
			}
		} catch (error) {
			console.error("Erreur de chargement:", error);
			toast({
				title: "Erreur",
				description:
					"Impossible de récupérer les données de la section",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	// Fonction de soumission du formulaire
	const onSubmit = async (values: SectionFormData) => {
		if (!section) return;

		try {
			await patch(`/section/update/${section.sectionId}/`, values);
			toast({
				title: "Section modifiée",
				description: "La section a été modifiée avec succès",
			});
			setTimeout(() => {
				router.push("/section/list");
			}, 1500);
		} catch (error) {
			console.error("Erreur de soumission:", error);
			toast({
				title: "Erreur",
				description:
					"Une erreur est survenue lors de la modification de la section",
				variant: "destructive",
			});
		}
	};

	if (isLoading) {
		return (
			<>
				<CardHeader>
					<CardTitle>Modification de la section</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex justify-center items-center py-8">
						Chargement des données...
					</div>
				</CardContent>
			</>
		);
	}

	return (
		<>
			<CardHeader>
				<CardTitle>Modification de la section</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4"
					>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nom de la Section</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder="Ex: Bachelier en Informatique"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="sectionType"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Type de cursus</FormLabel>
									<Select
										onValueChange={field.onChange}
										value={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Sélectionner durée de cursus" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{Object.keys(SectionTypeEnum).map(
												(key) => (
													<SelectItem
														key={key}
														value={key}
													>
														{
															SectionTypeEnum[
																key as keyof typeof SectionTypeEnum
															]
														}
													</SelectItem>
												)
											)}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="sectionCategory"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Catégorie</FormLabel>
									<Select
										onValueChange={field.onChange}
										value={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Sélectionnez un type de cursus" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{Object.keys(
												SectionCategoryEnum
											).map((key) => (
												<SelectItem
													key={key}
													value={key}
												>
													{
														SectionCategoryEnum[
															key as keyof typeof SectionCategoryEnum
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
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Ex: Cette section est destinée aux étudiants qui souhaitent devenir informaticiens"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex w-full">
							<Button
								className="w-full"
								type="submit"
							>
								Enregistrer les modifications
							</Button>
						</div>
					</form>
				</Form>
			</CardContent>
		</>
	);
};
