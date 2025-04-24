import {
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Table } from "@/components/ui/table";
import { BASE_URL } from "@/lib/url";
import { PaginationWithSearch } from "@/model/common/pagination.interface";
import { Student } from "@/model/entity/users/student.entity";
import StudentOverview from "./overview";

export default async function StudentPageOverview({
	searchParams,
}: {
	searchParams: Promise<{ search: string; page: number }>;
}) {
	const { search, page } = await searchParams;
	let url = BASE_URL + "/security/student/list/";
	if (search || page) url += "?";
	if (search) url += "search=" + search + "&";
	if (page) url += "page=" + page + "&";

	const response = await fetch(url);
	const studentsData: PaginationWithSearch<Student> = await response.json();
	return (
		<div className="flex flex-col gap-4">
			<h1>Vue d'ensemble des étudiants</h1>
			<div className="flex flex-col gap-4">
				<h2>Liste des étudiants</h2>
				<StudentOverview
					studentsData={studentsData}
					searchValue={search}
				/>
			</div>
		</div>
	);
}

export const StudentTable: React.FC<{
	studentsData: PaginationWithSearch<Student>;
}> = ({ studentsData }) => {
	console.log("studentsData", studentsData);
	return (
		<div className="container mx-auto">
			<h1 className="text-2xl font-bold mb-4">Liste des élèves</h1>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>ID</TableHead>
						<TableHead>Prénom</TableHead>
						<TableHead>Nom</TableHead>
						<TableHead>Email</TableHead>
						<TableHead>Téléphone</TableHead>
						<TableHead>Date de naissance</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{studentsData?.data?.map((student) => (
						<TableRow key={student.accountId}>
							<TableCell>{student.accountId}</TableCell>
							<TableCell>
								{student.contactDetails.firstName}
							</TableCell>
							<TableCell>
								{student.contactDetails.lastName}
							</TableCell>
							<TableCell>{student.email}</TableCell>
							<TableCell>
								{student.contactDetails.phoneNumber}
							</TableCell>
							<TableCell>
								{new Date(
									student.contactDetails.birthDate
								).toLocaleDateString()}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};
