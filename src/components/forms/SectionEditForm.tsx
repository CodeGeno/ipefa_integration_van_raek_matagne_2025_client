"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useState, useEffect, useReducer } from "react";
import { get } from "@/app/fetch";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

// Fonction utilitaire pour valider les valeurs enum
const isValidEnum = (value: any, enumObject: object): boolean => {
	return Object.keys(enumObject).includes(value);
};

// Fonction pour trouver la clé d'une énumération à partir de sa valeur
const getEnumKeyByValue = (
	enumObj: any,
	value: string | undefined
): string | undefined => {
	if (!value) return undefined;

	// Si la valeur est déjà une clé de l'enum, la retourner directement
	if (Object.keys(enumObj).includes(value)) {
		console.log(
			`Valeur '${value}' est déjà une clé d'enum, retournée directement`
		);
		return value;
	}

	// Sinon, chercher la clé correspondant à la valeur
	const keys = Object.keys(enumObj);
	for (const key of keys) {
		if (enumObj[key] === value) {
			console.log(`Clé trouvée: '${key}' pour la valeur '${value}'`);
			return key;
		}
	}

	console.log(`Aucune clé trouvée pour la valeur '${value}'`);
	return undefined;
};

// Fonction pour convertir une clé d'énumération en sa valeur
const getEnumValueByKey = (
	enumObj: any,
	key: string | undefined
): string | undefined => {
	if (!key) return undefined;

	if (key in enumObj) {
		return enumObj[key];
	}

	return key; // Si ce n'est pas une clé, retourner la valeur telle quelle
};

// Options statiques pour les selects
const typeOptions = Object.entries(SectionTypeEnum).map(([key, value]) => ({
	key,
	value: key,
	label: value,
}));

const categoryOptions = Object.entries(SectionCategoryEnum).map(
	([key, value]) => ({
		key,
		value: key,
		label: value,
	})
);

export const SectionEditForm = ({ id }: { id: string }) => {
	const router = useRouter();
	const [section, setSection] = useState<Section | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	// Forcer le rendu du formulaire
	const [, forceUpdate] = useReducer((x) => x + 1, 0);
	// États pour suivre les valeurs des Select
	const [selectedType, setSelectedType] = useState<string | undefined>(
		undefined
	);
	const [selectedCategory, setSelectedCategory] = useState<
		string | undefined
	>(undefined);

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

		// Afficher les options disponibles pour le debug
		console.log("Type options:", typeOptions);
		console.log("Category options:", categoryOptions);
	}, [id]);

	const fetchSection = async () => {
		try {
			setIsLoading(true);
			const response = await get<Section>(`/section/${id}`);

			if (response.success && response.data) {
				const sectionData = response.data;
				console.log("Données de section reçues:", sectionData);
				console.log(
					"Type d'énumération reçu:",
					sectionData.sectionType,
					typeof sectionData.sectionType
				);
				console.log(
					"Catégorie d'énumération reçue:",
					sectionData.sectionCategory,
					typeof sectionData.sectionCategory
				);

				setSection(sectionData);

				// Vérifions les clés disponibles dans les enums
				console.log(
					"SectionTypeEnum keys:",
					Object.keys(SectionTypeEnum)
				);
				console.log(
					"SectionTypeEnum values:",
					Object.values(SectionTypeEnum)
				);
				console.log(
					"SectionCategoryEnum keys:",
					Object.keys(SectionCategoryEnum)
				);
				console.log(
					"SectionCategoryEnum values:",
					Object.values(SectionCategoryEnum)
				);

				// Convertir les valeurs en clés d'enum
				const typeKey = getEnumKeyByValue(
					SectionTypeEnum,
					sectionData.sectionType
				);
				const categoryKey = getEnumKeyByValue(
					SectionCategoryEnum,
					sectionData.sectionCategory
				);

				console.log("Type key:", typeKey, "Category key:", categoryKey);

				// Si les clés sont trouvées, définir les états
				if (typeKey && categoryKey) {
					setSelectedType(typeKey);
					setSelectedCategory(categoryKey);

					// Mise à jour des valeurs du formulaire
					form.reset({
						name: sectionData.name || "",
						sectionType: typeKey as any,
						sectionCategory: categoryKey as any,
						description: sectionData.description || "",
					});
				} else {
					// Si les clés ne sont pas trouvées, utiliser directement les valeurs
					console.log(
						"Clés non trouvées, utilisation directe des valeurs"
					);
					setSelectedType(sectionData.sectionType);
					setSelectedCategory(sectionData.sectionCategory);

					form.reset({
						name: sectionData.name || "",
						sectionType: sectionData.sectionType,
						sectionCategory: sectionData.sectionCategory,
						description: sectionData.description || "",
					});
				}

				console.log(
					"Valeurs du formulaire après reset:",
					form.getValues()
				);
				console.log("Selected type:", selectedType);
				console.log("Selected category:", selectedCategory);
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

		// Le serveur attend les clés d'énumération (BACHELOR, TECHNICAL), pas besoin de conversion
		console.log("values à envoyer au serveur:", values);

		try {
			const response = await patch(
				`/section/update/${section.id}/`,
				values
			);
			if (response.success) {
				toast({
					title: "Section modifiée",
					description: "La section a été modifiée avec succès",
				});
				setTimeout(() => {
					router.push("/section/list");
				}, 1500);
			} else {
				toast({
					title: "Erreur",
					description:
						"Une erreur est survenue lors de la modification de la section",
					variant: "destructive",
				});
			}
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
			<div className="container mx-auto p-4">
				<div className="flex justify-between items-center mb-6">
					<div>
						<h1 className="text-2xl font-semibold">
							Modification de la section
						</h1>
						<p className="text-sm text-muted-foreground mt-1">
							Chargement des données...
						</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto p-4">
			<div className="flex justify-between items-center mb-6">
				<div>
					<h1 className="text-2xl font-semibold">
						Modification de la section
					</h1>
					<p className="text-sm text-muted-foreground mt-1">
						Modifiez les informations de la section
					</p>
				</div>
				<Link href="/section/list">
					<Button
						variant="outline"
						size="sm"
						className="flex items-center gap-2"
					>
						<ArrowLeft className="h-4 w-4" />
						Retour
					</Button>
				</Link>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="text-lg">
						Informations de la section
					</CardTitle>
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
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Nom de la section
											</FormLabel>
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

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="sectionType"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Type de cursus
												</FormLabel>
												<Select
													value={selectedType}
													onValueChange={(value) => {
														console.log(
															"Nouvelle valeur de type sélectionnée:",
															value
														);
														setSelectedType(value);
														form.setValue(
															"sectionType",
															value as any
														);
														console.log(
															"Valeur du formulaire après setValue:",
															form.getValues()
														);
													}}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Sélectionner durée de cursus" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{typeOptions.map(
															(option) => (
																<SelectItem
																	key={
																		option.key
																	}
																	value={
																		option.value
																	}
																>
																	{
																		option.label
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
													value={selectedCategory}
													onValueChange={(value) => {
														console.log(
															"Nouvelle valeur de catégorie sélectionnée:",
															value
														);
														setSelectedCategory(
															value
														);
														form.setValue(
															"sectionCategory",
															value as any
														);
														console.log(
															"Valeur du formulaire après setValue:",
															form.getValues()
														);
													}}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Sélectionnez un type de cursus" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{categoryOptions.map(
															(option) => (
																<SelectItem
																	key={
																		option.key
																	}
																	value={
																		option.value
																	}
																>
																	{
																		option.label
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
								</div>

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
							</div>

							<div className="flex justify-end pt-4">
								<Button
									type="submit"
									className="flex items-center gap-2"
								>
									<Save className="h-4 w-4" />
									Enregistrer
								</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
};
