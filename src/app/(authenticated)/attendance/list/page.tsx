"use client";

import { useState } from "react";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

// Énumération des statuts de présence
enum AttendanceStatusEnum {
	PRESENT = "P",
	PRESENT_DISTANCIEL = "M",
	ABSENT_NON_JUSTIFIE = "A",
	ABSENT_SOUS_CERTIFICAT = "CM",
	DISPENSE = "D",
	ABANDON = "Abandon",
}

// Types pour notre interface
interface Student {
	id: number;
	name: string;
	firstName: string;
}

interface Lesson {
	id: number;
	title: string;
	date: string;
	startTime: string;
	endTime: string;
}

interface Attendance {
	id: number;
	lesson: Lesson;
	student: Student;
	status: AttendanceStatusEnum;
}

// Données fictives pour les étudiants
const mockStudents: Student[] = [
	{ id: 1, name: "Dupont", firstName: "Jean" },
	{ id: 2, name: "Martin", firstName: "Sophie" },
	{ id: 3, name: "Lefebvre", firstName: "Thomas" },
	{ id: 4, name: "Dubois", firstName: "Emma" },
	{ id: 5, name: "Bernard", firstName: "Lucas" },
];

// Données fictives pour les cours
const mockLessons: Lesson[] = [
	{
		id: 1,
		title: "Programmation Web",
		date: "2023-10-15",
		startTime: "08:30",
		endTime: "10:30",
	},
	{
		id: 2,
		title: "Bases de données",
		date: "2023-10-16",
		startTime: "13:00",
		endTime: "15:00",
	},
	{
		id: 3,
		title: "Développement mobile",
		date: "2023-10-17",
		startTime: "10:00",
		endTime: "12:00",
	},
];

// Génération de données fictives pour les présences
const attendances: Attendance[] = [
	{
		id: 1,
		lesson: mockLessons[0],
		student: mockStudents[0],
		status: AttendanceStatusEnum.PRESENT,
	},
	{
		id: 2,
		lesson: mockLessons[0],
		student: mockStudents[1],
		status: AttendanceStatusEnum.ABSENT_NON_JUSTIFIE,
	},
	{
		id: 3,
		lesson: mockLessons[0],
		student: mockStudents[2],
		status: AttendanceStatusEnum.PRESENT,
	},
	{
		id: 4,
		lesson: mockLessons[0],
		student: mockStudents[3],
		status: AttendanceStatusEnum.PRESENT_DISTANCIEL,
	},
	{
		id: 5,
		lesson: mockLessons[0],
		student: mockStudents[4],
		status: AttendanceStatusEnum.DISPENSE,
	},
	{
		id: 6,
		lesson: mockLessons[1],
		student: mockStudents[0],
		status: AttendanceStatusEnum.PRESENT,
	},
	{
		id: 7,
		lesson: mockLessons[1],
		student: mockStudents[1],
		status: AttendanceStatusEnum.PRESENT,
	},
	{
		id: 8,
		lesson: mockLessons[1],
		student: mockStudents[2],
		status: AttendanceStatusEnum.ABSENT_SOUS_CERTIFICAT,
	},
	{
		id: 9,
		lesson: mockLessons[1],
		student: mockStudents[3],
		status: AttendanceStatusEnum.PRESENT,
	},
	{
		id: 10,
		lesson: mockLessons[1],
		student: mockStudents[4],
		status: AttendanceStatusEnum.PRESENT_DISTANCIEL,
	},
	{
		id: 11,
		lesson: mockLessons[2],
		student: mockStudents[0],
		status: AttendanceStatusEnum.PRESENT,
	},
	{
		id: 12,
		lesson: mockLessons[2],
		student: mockStudents[1],
		status: AttendanceStatusEnum.PRESENT,
	},
	{
		id: 13,
		lesson: mockLessons[2],
		student: mockStudents[2],
		status: AttendanceStatusEnum.PRESENT,
	},
	{
		id: 14,
		lesson: mockLessons[2],
		student: mockStudents[3],
		status: AttendanceStatusEnum.ABSENT_NON_JUSTIFIE,
	},
	{
		id: 15,
		lesson: mockLessons[2],
		student: mockStudents[4],
		status: AttendanceStatusEnum.ABANDON,
	},
];

// Fonction pour obtenir la classe de couleur en fonction du statut
const getStatusColorClass = (status: AttendanceStatusEnum): string => {
	switch (status) {
		case AttendanceStatusEnum.PRESENT:
		case AttendanceStatusEnum.PRESENT_DISTANCIEL:
			return "bg-green-300 text-green-800";
		case AttendanceStatusEnum.ABSENT_NON_JUSTIFIE:
			return "bg-red-100 text-red-800";
		case AttendanceStatusEnum.ABSENT_SOUS_CERTIFICAT:
			return "bg-yellow-100 text-yellow-800";
		case AttendanceStatusEnum.DISPENSE:
			return "bg-purple-100 text-purple-800";
		case AttendanceStatusEnum.ABANDON:
			return "bg-red-500 text-white";
		default:
			return "";
	}
};

// Fonction pour obtenir le libellé complet du statut
const getStatusLabel = (status: AttendanceStatusEnum): string => {
	switch (status) {
		case AttendanceStatusEnum.PRESENT:
			return "Présent";
		case AttendanceStatusEnum.PRESENT_DISTANCIEL:
			return "Présent (distanciel)";
		case AttendanceStatusEnum.ABSENT_NON_JUSTIFIE:
			return "Absent (non justifié)";
		case AttendanceStatusEnum.ABSENT_SOUS_CERTIFICAT:
			return "Absent (sous certificat)";
		case AttendanceStatusEnum.DISPENSE:
			return "Dispensé";
		case AttendanceStatusEnum.ABANDON:
			return "Abandon";
		default:
			return "";
	}
};

const AttendanceListPage = (params: {
	searchParams: {
		ueId?: string;
		year?: string;
	};
}) => {
	const { ueId, year } = params.searchParams;
	const [lessonFilter, setLessonFilter] = useState<number | null>(null);
	const [studentFilter, setStudentFilter] = useState<number | null>(null);

	// Filtrer les présences selon les filtres sélectionnés
	const filteredAttendances = attendances.filter((attendance) => {
		// Filtre par cours si un cours est sélectionné
		if (lessonFilter !== null && attendance.lesson.id !== lessonFilter) {
			return false;
		}

		// Filtre par étudiant si un étudiant est sélectionné
		if (studentFilter !== null && attendance.student.id !== studentFilter) {
			return false;
		}

		return true;
	});

	return (
		<div className="container mx-auto py-8">
			<h1 className="text-2xl font-bold mb-6">Tableau des présences</h1>

			{/* Filtres */}
			<div className="mb-6 flex flex-wrap gap-4">
				<div className="min-w-[250px]">
					<label
						htmlFor="lesson-filter"
						className="block text-sm font-medium mb-2"
					>
						Filtrer par cours:
					</label>
					<select
						id="lesson-filter"
						className="w-full p-2 border rounded-md"
						value={lessonFilter === null ? "" : lessonFilter}
						onChange={(e) =>
							setLessonFilter(
								e.target.value ? Number(e.target.value) : null
							)
						}
					>
						<option value="">Tous les cours</option>
						{mockLessons.map((lesson) => (
							<option
								key={lesson.id}
								value={lesson.id}
							>
								{lesson.title} - {lesson.date}
							</option>
						))}
					</select>
				</div>

				<div className="min-w-[250px]">
					<label
						htmlFor="student-filter"
						className="block text-sm font-medium mb-2"
					>
						Filtrer par Année:
					</label>
					<select
						id="student-filter"
						className="w-full p-2 border rounded-md"
						value={studentFilter === null ? "" : studentFilter}
						onChange={(e) =>
							setStudentFilter(
								e.target.value ? Number(e.target.value) : null
							)
						}
					>
						<option value="">Tous les étudiants</option>
						{mockStudents.map((student) => (
							<option
								key={student.id}
								value={student.id}
							>
								{student.name} {student.firstName}
							</option>
						))}
					</select>
				</div>
			</div>

			{/* Tableau des présences */}
			<div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
				<Table>
					<TableCaption>
						Liste des présences - {filteredAttendances.length}{" "}
						résultats
					</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead>ID</TableHead>
							<TableHead>Étudiant</TableHead>
							<TableHead>Cours</TableHead>
							<TableHead>Date</TableHead>
							<TableHead>Horaire</TableHead>
							<TableHead>Statut</TableHead>
							<TableHead className="text-right">
								Actions
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredAttendances.map((attendance) => (
							<TableRow key={attendance.id}>
								<TableCell className="font-medium">
									{attendance.id}
								</TableCell>
								<TableCell>
									{attendance.student.name}{" "}
									{attendance.student.firstName}
								</TableCell>
								<TableCell>{attendance.lesson.title}</TableCell>
								<TableCell>{attendance.lesson.date}</TableCell>
								<TableCell>
									{attendance.lesson.startTime} -{" "}
									{attendance.lesson.endTime}
								</TableCell>
								<TableCell>
									<span
										className={cn(
											"px-3 py-1 rounded-full text-xs font-medium min-w-[160px] inline-block text-center",
											getStatusColorClass(
												attendance.status
											)
										)}
									>
										{getStatusLabel(attendance.status)}
									</span>
								</TableCell>
								<TableCell className="text-right">
									<button className="text-blue-600 hover:text-blue-800 mr-2">
										Modifier
									</button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			{/* Légende des statuts */}
			<div className="mt-8 bg-white p-6 rounded-lg shadow-md">
				<h2 className="text-lg font-bold mb-4">Légende des statuts</h2>
				<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
					{Object.values(AttendanceStatusEnum).map((status) => (
						<div
							key={status}
							className="flex items-center"
						>
							<span
								className={cn(
									"w-4 h-4 rounded-full mr-2",
									getStatusColorClass(
										status as AttendanceStatusEnum
									)
								)}
							></span>
							<span className="min-w-[180px] inline-block">
								{getStatusLabel(status as AttendanceStatusEnum)}{" "}
								({status})
							</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default AttendanceListPage;
