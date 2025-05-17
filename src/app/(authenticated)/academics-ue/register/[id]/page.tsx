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
import { get, post } from "@/app/fetch";
import { AcademicUE } from "@/model/entity/ue/academic-ue.entity";
import { Student } from "@/model/entity/users/student.entity";
import { toast } from "sonner";
import { createUrlWithParams } from "@/utils/url";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
enum RegistrationStatus {
	"AP" = "Approuvé",
	"NP" = "Non approuvé",
}
interface StudentRegistration extends Student {
	status: keyof typeof RegistrationStatus;
}
const AcademicsUERegisterPage = () => {
	const { id } = useParams();
	const [academicUE, setAcademicUE] = useState<AcademicUE>();
	const [availableStudents, setAvailableStudents] = useState<
		StudentRegistration[]
	>([]);
	const [searchValue, setSearchValue] = useState<string>("");
	const fetchAcademicUE = async () => {
		const response = await get<AcademicUE>(
			`/ue-management/academic-ues/${id}/`
		);
		if (response.success) {
			setAcademicUE(response.data);
		} else {
			toast.error(response.message);
		}
	};

	const fetchAvailableStudents = async () => {
		const response = await get<StudentRegistration[]>(
			createUrlWithParams(
				`/ue-management/academic-ues/registration/students/${id}/`,
				{ search: searchValue }
			)
		);

		if (response.success && response.data) {
			console.log("response.data", response.data);
			setAvailableStudents(response.data);
		} else {
			toast.error(response.message);
		}
	};

	useEffect(() => {
		fetchAcademicUE();
		fetchAvailableStudents();
	}, [id]);

	const handleRegisterStudent = async (studentId: string) => {
		try {
			const response = await post(
				`/ue-management/academic-ues/${id}/students/${studentId}/register/`,
				{}
			);
			if (response.success) {
				toast.success("Étudiant inscrit avec succès");
				fetchAcademicUE();
				fetchAvailableStudents();
			} else {
				toast.error(response.message);
			}
		} catch (error) {
			toast.error("Erreur lors de l'inscription de l'étudiant");
		}
	};

	const handleUnregisterStudent = async (studentId: string) => {
		try {
			const response = await post(
				`/attendance/dropout/${id}/${studentId}/`,
				{}
			);
			if (response.success) {
				toast.success("Étudiant désinscrit avec succès");
				fetchAcademicUE();
				fetchAvailableStudents();
			} else {
				toast.error(response.message);
			}
		} catch (error) {
			toast.error("Erreur lors de la désinscription de l'étudiant");
		}
	};
	console.log("availableStudents", availableStudents);
	return (
		<>
			{academicUE && (
				<>
					<div className="container mx-auto py-6 px-4">
						<div className="flex justify-between">
							<h1 className="text-2xl font-bold mb-6">
								Inscription à l'UE : {academicUE.ue.name}
							</h1>
							<Link href="/academics-ue">
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
						<h2 className="text-lg font-bold mb-6">
							{`Professeur : ${academicUE?.professor.contactDetails.firstName} ${academicUE?.professor.contactDetails.lastName}`}
						</h2>
						<h1 className="text-xl font-bold mb-6">
							Etudiants inscrits
						</h1>
						<div className="rounded-md border overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className="min-w-[100px]">
											Matricule
										</TableHead>
										<TableHead className="min-w-[200px]">
											Nom Prénom
										</TableHead>
										<TableHead className="min-w-[100px]">
											Status
										</TableHead>
										<TableHead className="min-w-[100px]">
											Action
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{academicUE?.students.map(
										(student: Student) => (
											<TableRow key={student.id}>
												<TableCell className="font-medium whitespace-nowrap">
													{student.identifier}
												</TableCell>
												<TableCell className="whitespace-nowrap">{`${student.contactDetails.firstName} ${student.contactDetails.lastName}`}</TableCell>
												<TableCell className="whitespace-nowrap">
													Inscrit
												</TableCell>
												<TableCell className="whitespace-nowrap">
													<Button
														variant="destructive"
														onClick={() =>
															handleUnregisterStudent(
																student.id
															)
														}
													>
														Désinscrire
													</Button>
												</TableCell>
											</TableRow>
										)
									)}
								</TableBody>
							</Table>
						</div>

						<h1 className="text-xl font-bold mt-8 mb-6">
							Étudiants non inscrits
						</h1>
						<div className="flex flex-col sm:flex-row gap-2 mb-4">
							<Input
								placeholder="Rechercher un étudiant"
								value={searchValue}
								onChange={(e) => setSearchValue(e.target.value)}
								className="w-full sm:w-auto"
							/>
							<Button
								variant="default"
								onClick={() => fetchAvailableStudents()}
								className="w-full sm:w-auto"
							>
								Rechercher
							</Button>
						</div>
						<div className="rounded-md border overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className="min-w-[100px]">
											Matricule
										</TableHead>
										<TableHead className="min-w-[200px]">
											Nom Prénom
										</TableHead>
										<TableHead className="min-w-[100px]">
											Status
										</TableHead>
										<TableHead className="min-w-[100px]">
											Action
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{availableStudents.length > 0 &&
										availableStudents.map(
											(student: StudentRegistration) => (
												<TableRow key={student.id}>
													<TableCell className="font-medium whitespace-nowrap">
														{student.identifier}
													</TableCell>
													<TableCell className="whitespace-nowrap">{`${student.contactDetails.firstName} ${student.contactDetails.lastName}`}</TableCell>
													<TableCell className="whitespace-nowrap">
														{student.status}
													</TableCell>
													<TableCell className="whitespace-nowrap">
														<Button
															disabled={
																student.status ===
																"NP"
															}
															variant={
																student.status ===
																"AP"
																	? "default"
																	: "destructive"
															}
															onClick={() =>
																handleRegisterStudent(
																	student.id
																)
															}
														>
															Inscrire
														</Button>
													</TableCell>
												</TableRow>
											)
										)}
								</TableBody>
							</Table>
						</div>
					</div>
				</>
			)}
		</>
	);
};

export default AcademicsUERegisterPage;
