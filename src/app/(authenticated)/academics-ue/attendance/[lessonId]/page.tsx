"use client";

import { get, post } from "@/app/fetch";
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
import { Lesson, LessonStatus } from "@/model/entity/lessons/lesson.entity";
import { Employee } from "@/model/entity/lessons/employee.entity";
import { UE } from "@/model/entity/ue/ue.entity";
import { AcademicUE } from "@/model/entity/ue/academic-ue.entity";
import { AccountContext } from "@/app/context";
import { useContext } from "react";
import { AccountRoleEnum } from "@/model/enum/account-role.enum";
import { cn } from "@/lib/utils";

interface AttendanceData {
	students: Student[];
	professor: Employee;
	lesson: Lesson;
	ue: UE;
	academic_ue: AcademicUE;
	attendances: {
		id: number;
		status: keyof typeof AttendanceStatusEnum;
		lesson: number;
		student: number;
	}[];
}

interface Attendance {
	id?: number;
	status: keyof typeof AttendanceStatusEnum | "";
	lesson_id: number;
	student_id: number;
}

const attendanceStatusMap = Object.fromEntries(
	Object.entries(AttendanceStatusEnum).map(([key, value]) => [value, key])
);

const getStatusKey = (
	value: string
): keyof typeof AttendanceStatusEnum | "" => {
	const entry = Object.entries(AttendanceStatusEnum).find(
		([_, v]) => v === value
	);
	return entry ? (entry[0] as keyof typeof AttendanceStatusEnum) : "";
};

const getAvailableStatuses = (role: keyof typeof AccountRoleEnum) => {
	if (
		AccountRoleEnum[role] === AccountRoleEnum.EDUCATOR ||
		AccountRoleEnum[role] === AccountRoleEnum.ADMINISTRATOR
	) {
		return {
			[AttendanceStatusEnum.P]: "Présentiel",
			[AttendanceStatusEnum.M]: "Distanciel",
			[AttendanceStatusEnum.CM]: "Certificat médical",
			[AttendanceStatusEnum.A]: "Absence non justifiée",
			[AttendanceStatusEnum.ABANDON]: "Abandon",
			[AttendanceStatusEnum.D]: "Dispensé",
		};
	}
	if (AccountRoleEnum[role] === AccountRoleEnum.PROFESSOR) {
		return {
			[AttendanceStatusEnum.P]: "Présentiel",
			[AttendanceStatusEnum.M]: "Distanciel",
			[AttendanceStatusEnum.A]: "Absence non justifiée",
		};
	}
	return {};
};

const getStatusColorClass = (
	status: keyof typeof AttendanceStatusEnum
): string => {
	switch (status) {
		case "P":
			return "bg-green-100 text-green-800";
		case "M":
			return "bg-blue-100 text-blue-800";
		case "CM":
			return "bg-yellow-100 text-yellow-800";
		case "A":
			return "bg-red-100 text-red-800";
		case "ABANDON":
			return "bg-red-500 text-white";
		case "D":
			return "bg-purple-100 text-purple-800";
		default:
			return "bg-gray-100 text-gray-800";
	}
};

const getLessonStatusColorClass = (
	status: keyof typeof LessonStatus
): string => {
	switch (status) {
		case "PROGRAMMED":
			return "bg-blue-100 text-blue-800";
		case "IN_PROGRESS":
			return "bg-yellow-100 text-yellow-800";
		case "COMPLETED":
			return "bg-green-100 text-green-800";
		case "CANCELLED":
			return "bg-red-100 text-red-800";
		default:
			return "bg-gray-100 text-gray-800";
	}
};

const ManageAttendancePage = () => {
	const { accountData } = useContext(AccountContext);
	const [attendanceData, setAttendanceData] = useState<AttendanceData>();
	const [attendance, setAttendance] = useState<Attendance[]>([]);
	const { lessonId } = useParams();
	const [isLoading, setIsLoading] = useState(true);

	const fetchLessonData = async () => {
		try {
			const response = await get<AttendanceData>(
				`/attendance/details/${lessonId}/`
			);
			console.log("Response data:", response.data);
			console.log("Lesson status:", response.data?.lesson?.status);

			if (response.success && response.data) {
				setAttendanceData(response.data);
				// Initialiser les présences avec les données existantes ou des valeurs vides
				const initialAttendance: Attendance[] =
					response.data.students.map((student) => {
						const existingAttendance =
							response.data?.attendances?.find(
								(att) => att.student === Number(student.id)
							);
						console.log(
							"Student:",
							student.id,
							"Existing attendance:",
							existingAttendance
						);

						const attendance: Attendance = existingAttendance
							? {
									id: existingAttendance.id,
									status: existingAttendance.status as keyof typeof AttendanceStatusEnum,
									lesson_id: existingAttendance.lesson,
									student_id: existingAttendance.student,
							  }
							: {
									status: "",
									lesson_id: Number(lessonId),
									student_id: Number(student.id),
							  };
						console.log(
							"Final attendance for student:",
							student.id,
							attendance
						);
						return attendance;
					});
				console.log("Initial attendance array:", initialAttendance);
				setAttendance(initialAttendance);
				setIsLoading(false);
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

	const handleAttendanceChange = (studentId: number, status: string) => {
		console.log("Changing attendance:", { studentId, status });
		const statusKey = Object.entries(AttendanceStatusEnum).find(
			([_, value]) => value === status
		)?.[0] as keyof typeof AttendanceStatusEnum;
		setAttendance((prev) => {
			const newAttendance = prev.map((att) =>
				att.student_id === studentId
					? { ...att, status: statusKey }
					: att
			);
			console.log("New attendance state:", newAttendance);
			return newAttendance;
		});
	};

	const isFormValid = () => {
		if (!attendanceData?.students.length) return false;

		const isValid = attendance.every((att) => {
			console.log("Checking attendance:", {
				studentId: att.student_id,
				status: att.status,
				isEmpty: att.status === "",
				isValidKey: Object.keys(AttendanceStatusEnum).includes(
					att.status
				),
			});
			return (
				att.status !== "" &&
				Object.keys(AttendanceStatusEnum).includes(att.status)
			);
		});

		console.log("Form validation result:", isValid);
		return isValid;
	};

	const handleSubmit = async () => {
		if (!isFormValid()) {
			toast.error(
				"Veuillez remplir toutes les présences avant de valider"
			);
			return;
		}

		try {
			// Ici, vous pouvez ajouter la logique pour envoyer les données au serveur
			console.log("Présences soumises:", attendance);
			const response = await post(`/attendance/upsert/`, attendance);
			if (response.success) {
				toast.success("Présences enregistrées avec succès");
			} else {
				toast.error("Erreur lors de l'enregistrement des présences");
			}
		} catch (error) {
			console.error("Erreur lors de la soumission:", error);
			toast.error("Erreur lors de l'enregistrement des présences");
		}
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
			</div>
		);
	}

	return (
		<div className="container mx-auto py-8 px-4">
			<Card className="shadow-lg">
				<CardHeader className="bg-muted/50 border-b">
					<div className="flex flex-col space-y-4">
						<div className="flex justify-between items-center">
							<CardTitle className="text-2xl font-bold">
								Gestion des présences
							</CardTitle>
							{attendanceData && (
								<div className="flex items-center space-x-2">
									<span className="text-sm font-medium text-muted-foreground">
										Statut du cours:
									</span>
									<span
										className={cn(
											"px-3 py-1 rounded-full text-sm font-medium",
											getLessonStatusColorClass(
												attendanceData.lesson
													.status as unknown as keyof typeof LessonStatus
											)
										)}
									>
										{(() => {
											console.log(
												"Lesson status:",
												attendanceData.lesson.status
											);
											console.log(
												"LessonStatus:",
												LessonStatus
											);
											return LessonStatus[
												attendanceData.lesson
													.status as unknown as keyof typeof LessonStatus
											];
										})()}
									</span>
								</div>
							)}
						</div>
						{attendanceData && (
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div className="flex flex-col space-y-1">
									<span className="text-sm font-medium text-muted-foreground">
										Cours
									</span>
									<span className="text-base font-semibold">
										{attendanceData.ue.name}
									</span>
								</div>
								<div className="flex flex-col space-y-1">
									<span className="text-sm font-medium text-muted-foreground">
										Professeur
									</span>
									<span className="text-base font-semibold">
										{`${attendanceData.professor.contactDetails.firstName} ${attendanceData.professor.contactDetails.lastName}`}
									</span>
								</div>
								<div className="flex flex-col space-y-1">
									<span className="text-sm font-medium text-muted-foreground">
										Date
									</span>
									<span className="text-base font-semibold">
										{new Date(
											attendanceData.lesson.lesson_date
										).toLocaleDateString()}
									</span>
								</div>
							</div>
						)}
					</div>
				</CardHeader>
				<CardContent className="p-6">
					<div className="rounded-lg border shadow-sm">
						<Table>
							<TableHeader>
								<TableRow className="bg-muted/50">
									<TableHead className="font-semibold">
										Identifiant
									</TableHead>
									<TableHead className="font-semibold">
										Nom
									</TableHead>
									<TableHead className="font-semibold">
										Prénom
									</TableHead>
									<TableHead className="font-semibold text-center">
										Statut
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{attendanceData?.students.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={4}
											className="text-center py-8 text-muted-foreground"
										>
											Aucun étudiant trouvé
										</TableCell>
									</TableRow>
								) : (
									attendanceData?.students.map((student) => (
										<TableRow
											key={student.id}
											className="hover:bg-muted/50"
										>
											<TableCell className="font-medium">
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
														attendance.find(
															(att) =>
																att.student_id ===
																Number(
																	student.id
																)
														)?.status
															? AttendanceStatusEnum[
																	attendance.find(
																		(att) =>
																			att.student_id ===
																			Number(
																				student.id
																			)
																	)
																		?.status as keyof typeof AttendanceStatusEnum
															  ]
															: ""
													}
													onValueChange={(value) =>
														handleAttendanceChange(
															Number(student.id),
															value
														)
													}
												>
													<SelectTrigger className="w-[180px] mx-auto">
														<SelectValue placeholder="Sélectionner un statut" />
													</SelectTrigger>
													<SelectContent>
														{Object.entries(
															getAvailableStatuses(
																accountData.role as keyof typeof AccountRoleEnum
															)
														).map(
															([
																value,
																label,
															]) => (
																<SelectItem
																	key={value}
																	value={
																		value
																	}
																>
																	{label}
																</SelectItem>
															)
														)}
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
						<Button
							onClick={handleSubmit}
							className="px-8 py-2"
							disabled={!isFormValid()}
						>
							Valider les présences
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default ManageAttendancePage;
