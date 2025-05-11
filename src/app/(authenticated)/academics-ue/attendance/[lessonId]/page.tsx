"use client";

import { get } from "@/app/fetch";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Student } from "@/model/entity/users/student.entity";
import { AttendanceStatusEnum } from "@/model/enum/attendance-status.enum";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface Attendance {
	[key: string]: AttendanceStatusEnum;
}

interface StudentAttendanceDTO extends Student {
	attendance: AttendanceStatusEnum;
}

const ManageAttendancePage = () => {
	const [students, setStudents] = useState<StudentAttendanceDTO[]>([]);
	const [attendance, setAttendance] = useState<Attendance>({});
	const { lessonId } = useParams();

	const fetchLessonData = async () => {
		try {
			const response = await get<any>(`/attendance/details/${lessonId}/`);
			if (response.success && response.data) {
				const data = response.data;
				let students: StudentAttendanceDTO[] = [];
				console.log(response.data);
				// Initialiser les présences à A (Absence non justifiée) pour chaque étudiant
				const initialAttendance: Attendance = {};

				setAttendance(initialAttendance);
			} else {
				toast.error("Erreur lors du chargement des données");
			}
		} catch (error) {
			console.error("Erreur lors du chargement des données:", error);
			toast.error("Erreur lors du chargement des données");
		}
	};

	useEffect(() => {
		if (lessonId) {
			fetchLessonData();
		}
	}, [lessonId]);

	const handleAttendanceChange = (
		studentId: string,
		status: AttendanceStatusEnum
	) => {
		setAttendance((prev) => ({
			...prev,
			[studentId]: status,
		}));
	};

	const handleSubmit = async () => {
		try {
			// Ici, vous pouvez ajouter la logique pour envoyer les données au serveur
			console.log("Présences soumises:", attendance);
			toast.success("Présences enregistrées avec succès");
		} catch (error) {
			console.error("Erreur lors de la soumission:", error);
			toast.error("Erreur lors de l'enregistrement des présences");
		}
	};

	return (
		<div className="p-6">
			<Card>
				<CardHeader>
					<CardTitle>Gestion des présences</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Identifiant</TableHead>
									<TableHead>Nom</TableHead>
									<TableHead>Prénom</TableHead>
									<TableHead className="text-center">
										Statut
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{students.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={4}
											className="text-center py-4"
										>
											Aucun étudiant trouvé
										</TableCell>
									</TableRow>
								) : (
									students.map((student) => (
										<TableRow key={student.id}>
											<TableCell>
												{student.identifier}
											</TableCell>
											<TableCell>
												{
													student.contactDetails
														.lastName
												}
											</TableCell>
											<TableCell>
												{
													student.contactDetails
														.firstName
												}
											</TableCell>
											<TableCell className="text-center">
												<Select
													value={
														attendance[
															student.id.toString()
														] ||
														AttendanceStatusEnum.A
													}
													onValueChange={(value) =>
														handleAttendanceChange(
															student.id.toString(),
															value as AttendanceStatusEnum
														)
													}
												>
													<SelectTrigger className="w-[180px]">
														<SelectValue placeholder="Sélectionner un statut" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem
															value={
																AttendanceStatusEnum.P
															}
														>
															Présentiel
														</SelectItem>
														<SelectItem
															value={
																AttendanceStatusEnum.M
															}
														>
															Distanciel
														</SelectItem>
														<SelectItem
															value={
																AttendanceStatusEnum.CM
															}
														>
															Certificat médical
														</SelectItem>
														<SelectItem
															value={
																AttendanceStatusEnum.A
															}
														>
															Absence non
															justifiée
														</SelectItem>
														<SelectItem
															value={
																AttendanceStatusEnum.AB
															}
														>
															Abandon
														</SelectItem>
														<SelectItem
															value={
																AttendanceStatusEnum.D
															}
														>
															Dispensé
														</SelectItem>
													</SelectContent>
												</Select>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>
					<div className="mt-6 flex justify-end">
						<Button onClick={handleSubmit}>
							Valider les présences
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default ManageAttendancePage;
