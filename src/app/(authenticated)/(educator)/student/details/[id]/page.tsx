"use client";

import { get } from "@/app/fetch";
import { Student } from "@/model/entity/users/student.entity";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Section } from "@/model/entity/ue/section.entity";
import DisplaySectionRegistration from "../section-registration";
const StudentDetailsPage = () => {
	const { id } = useParams();
	const [student, setStudent] = useState<Student>();
	const [displayMode, setDisplayMode] = useState<"none" | "section" | "ue">(
		"none"
	);

	const getStudent = async () => {
		const response = await get<Student>(`/security/student/${id}/`);
		if (response.success) {
			setStudent(response.data);
			console.log(response.data);
		}
	};
	useEffect(() => {
		getStudent();
	}, []);

	return (
		<div className="container mx-auto py-6">
			<h1 className="text-3xl font-bold mb-6">Détails de l'étudiant</h1>
			<Card className="mb-6">
				<CardHeader>
					<CardTitle>Informations personnelles</CardTitle>
					<CardDescription>
						Détails de contact de l'étudiant
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-2">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<p className="text-sm font-medium text-muted-foreground">
								Nom
							</p>
							<p className="text-lg">
								{`${student?.contactDetails.firstName} ${student?.contactDetails.lastName}`}
							</p>
						</div>
						<div>
							<p className="text-sm font-medium text-muted-foreground">
								Email
							</p>
							<p className="text-lg">{student?.email}</p>
						</div>
						<div>
							<p className="text-sm font-medium text-muted-foreground">
								Téléphone
							</p>
							<p className="text-lg">
								{student?.contactDetails.phoneNumber ||
									"Non spécifié"}
							</p>
						</div>
						<div>
							<p className="text-sm font-medium text-muted-foreground">
								Matricule
							</p>
							<p className="text-lg">
								{student?.contactDetails?.identifier}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			<Separator className="my-6" />

			<div className="flex flex-col sm:flex-row gap-4">
				<Button
					className="w-full sm:w-auto"
					onClick={() =>
						setDisplayMode(
							displayMode === "section" ? "none" : "section"
						)
					}
					variant="default"
				>
					Inscrire à une section
				</Button>
				<Button
					variant="secondary"
					className="w-full sm:w-auto"
					onClick={() =>
						setDisplayMode(displayMode === "ue" ? "none" : "ue")
					}
				>
					Inscrire à une UE
				</Button>
			</div>
			{displayMode === "section" && (
				<DisplaySectionRegistration key="section" />
			)}
			{displayMode === "ue" && <DisplayUERegistration key="ue" />}
		</div>
	);
};

const DisplayUERegistration = () => {
	return (
		<div className="mt-6">
			<h2 className="text-xl font-semibold mb-4">Inscription à une UE</h2>
			<Card>
				<CardContent className="flex justify-center items-center p-8">
					<div className="text-center">
						<p className="text-muted-foreground mb-2">
							Cette fonctionnalité n'est pas encore disponible.
						</p>
						<p className="text-sm text-muted-foreground">
							Vous pourrez bientôt inscrire cet étudiant à des UE
							spécifiques.
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default StudentDetailsPage;
