import { Input } from "@/components/ui";
import { Pagination } from "@/components/ui/pagination";
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
			<h1>Student Page Overview</h1>
			<div className="flex flex-col gap-4">
				<h2>Student List</h2>
				<StudentOverview
					studentsData={studentsData}
					searchValue={search ?? ""}
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
						<TableRow key={student.account_id}>
							<TableCell>{student.account_id}</TableCell>
							<TableCell>
								{student.contact_details.first_name}
							</TableCell>
							<TableCell>
								{student.contact_details.last_name}
							</TableCell>
							<TableCell>{student.student_email}</TableCell>
							<TableCell>
								{student.contact_details.phone_number}
							</TableCell>
							<TableCell>
								{new Date(
									student.contact_details.birth_date
								).toLocaleDateString()}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};
