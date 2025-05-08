"use client";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { get } from "@/app/fetch";
import { AcademicUE } from "@/model/entity/ue/academic-ue.entity";
import { toast } from "sonner";
enum RegistrationStatus {
	APPROVED = "AP",
	REJECTED = "NP",
}

const AcademicsUERegisterPage = () => {
	const { id } = useParams();
	const [academicUE, setAcademicUE] = useState<AcademicUE>();
	const fetchAcademicUE = async () => {
		const response = await get<AcademicUE>(
			`/ue-management/academic-ues/register/${id}/`
		);
		if (response.success) {
			setAcademicUE(response.data);
		} else {
			toast.error(response.message);
		}
	};

	useEffect(() => {
		fetchAcademicUE();
	}, [id]);
	return (
		<div className="container mx-auto py-6">
			<h1 className="text-2xl font-bold mb-6">Inscription aux UE</h1>
			<h2 className="text-lg font-bold mb-6">
				{`Professeur : ${academicUE?.professor.contactDetails.firstName} ${academicUE?.professor.contactDetails.lastName}`}
			</h2>
			<h1 className="text-xl font-bold mb-6">Etudiants inscrits</h1>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Matricule</TableHead>
						<TableHead>Nom Prénom</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Action</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{academicUE?.students.map((student) => (
						<TableRow key={student.id}>
							<TableCell>{student.matricule}</TableCell>
							<TableCell>
								{student.contactDetails.firstName}
								{student.contactDetails.lastName}
							</TableCell>
							<TableCell>Inscrit</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};

export default AcademicsUERegisterPage;
