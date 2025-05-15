"use client";
import { Section } from "@/model/entity/ue/section.entity";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { get, post } from "@/app/fetch";
import { Student } from "@/model/entity/users/student.entity";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { SectionTypeEnum } from "@/model/enum/section-type.enum";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, User, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
	sectionId: z.string({
		required_error: "Veuillez sélectionner une section",
	}),
	cycle: z.string({
		required_error: "Veuillez sélectionner un cycle",
	}),
});

const SectionRegistrationPage = () => {
	const { studentId } = useParams();
	const [sections, setSections] = useState<Section[]>([]);
	const [student, setStudent] = useState<Student>();
	const [selectedSectionType, setSelectedSectionType] =
		useState<SectionTypeEnum | null>(null);
	const { toast } = useToast();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	});

	const fetchSections = async () => {
		const response = await get<Section[]>("/section/list/");
		if (response.success && response.data) {
			console.log(response.data);
			setSections(response.data);
		}
	};

	const fetchStudent = async () => {
		const response = await get<Student>(`/security/student/${studentId}`);
		if (response.success && response.data) {
			setStudent(response.data);
		}
	};

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			const response = await post(`/ue-management/register-section/`, {
				studentId: studentId,
				sectionId: values.sectionId,
				cycle: parseInt(values.cycle),
			});
			console.log(response);
			if (response.success) {
				toast({
					title: "Inscription réussie",
					description:
						"L'étudiant a été inscrit à la section avec succès",
				});
			} else {
				toast({
					variant: "destructive",
					title: "Erreur",
					description:
						"Une erreur est survenue lors de l'inscription",
				});
			}
		} catch (error) {
			toast({
				variant: "destructive",
				title: "Erreur",
				description: "Une erreur est survenue lors de l'inscription",
			});
		}
	};

	useEffect(() => {
		fetchSections();
		fetchStudent();
	}, []);

	const handleSectionChange = (sectionId: string) => {
		const section = sections.find((s) => s.id.toString() === sectionId);
		setSelectedSectionType(section?.sectionType || null);
		form.setValue("cycle", "");
	};

	return (
		<div className="container mx-auto py-10 space-y-6">
			<CardHeader>
				<CardTitle>Informations de l'étudiant</CardTitle>
				<CardDescription>
					Détails de l'étudiant à inscrire
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="flex flex-wrap gap-6">
					<div className="flex-1 min-w-[250px] space-y-2">
						<div className="flex items-center space-x-2">
							<User className="h-4 w-4 text-muted-foreground" />
							<span className="text-sm font-medium text-muted-foreground">
								Nom complet
							</span>
						</div>
						<p className="text-lg font-medium">
							{student?.contactDetails?.firstName}{" "}
							{student?.contactDetails?.lastName}
						</p>
					</div>
					<div className="flex-1 min-w-[250px] space-y-2">
						<div className="flex items-center space-x-2">
							<Mail className="h-4 w-4 text-muted-foreground" />
							<span className="text-sm font-medium text-muted-foreground">
								Email
							</span>
						</div>
						<p className="text-lg font-medium">{student?.email}</p>
					</div>
					<div className="flex-1 min-w-[250px] space-y-2">
						<div className="flex items-center space-x-2">
							<Phone className="h-4 w-4 text-muted-foreground" />
							<span className="text-sm font-medium text-muted-foreground">
								Téléphone
							</span>
						</div>
						<p className="text-lg font-medium">
							{student?.contactDetails?.phoneNumber ||
								"Non spécifié"}
						</p>
					</div>
					<div className="flex-1 min-w-[250px] space-y-2">
						<div className="flex items-center space-x-2">
							<GraduationCap className="h-4 w-4 text-muted-foreground" />
							<span className="text-sm font-medium text-muted-foreground">
								Matricule
							</span>
						</div>
						<p className="text-lg font-medium">
							{student?.identifier}
						</p>
					</div>
				</div>
			</CardContent>

			<Separator />

			{/* Formulaire d'inscription */}

			<CardHeader>
				<CardTitle>Inscription à une section</CardTitle>
				<CardDescription>
					Sélectionnez la section et le cycle pour l'inscription
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-8"
					>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<FormField
								control={form.control}
								name="sectionId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Section</FormLabel>
										<Select
											onValueChange={(value) => {
												field.onChange(value);
												handleSectionChange(value);
											}}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Sélectionnez une section" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{sections.map((section) => (
													<SelectItem
														key={section.id}
														value={section.id.toString()}
													>
														<div className="flex items-center space-x-2">
															<span>
																{section.name}
															</span>
															<Badge variant="outline">
																{
																	section.sectionType
																}
															</Badge>
														</div>
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
								name="cycle"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Cycle</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
											disabled={!selectedSectionType}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Sélectionnez un cycle" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{selectedSectionType ===
													SectionTypeEnum.BACHELOR && (
													<>
														<SelectItem value="1">
															Bloc 1
														</SelectItem>
														<SelectItem value="2">
															Bloc 2
														</SelectItem>
														<SelectItem value="3">
															Bloc 3
														</SelectItem>
													</>
												)}
												{selectedSectionType ===
													SectionTypeEnum.MASTER && (
													<>
														<SelectItem value="1">
															Master 1
														</SelectItem>
														<SelectItem value="2">
															Master 2
														</SelectItem>
													</>
												)}
												{!selectedSectionType && (
													<SelectItem
														value=""
														disabled
													>
														Sélectionnez d'abord une
														section
													</SelectItem>
												)}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<Button type="submit">Inscrire à la section</Button>
					</form>
				</Form>
			</CardContent>
		</div>
	);
};

export default SectionRegistrationPage;
