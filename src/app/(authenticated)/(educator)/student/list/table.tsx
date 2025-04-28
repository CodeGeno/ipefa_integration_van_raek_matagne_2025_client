"use client";
import { Student } from "@/model/entity/users/student.entity";
import { PaginationWithSearch } from "@/model/common/pagination.interface";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

export const StudentTable: React.FC<{
	studentsData: Student[];
}> = ({ studentsData }) => {
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
					{studentsData?.map((student) => (
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
