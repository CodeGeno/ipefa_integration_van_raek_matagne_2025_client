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
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { EditIcon } from "lucide-react";

export const StudentTable: React.FC<{
	studentsData: Student[];
}> = ({ studentsData }) => {
	const router = useRouter();
	return (
		<div className="container mx-auto">
			<Table>
				<TableHeader>
					<TableRow className="text-center">
						<TableHead>ID</TableHead>
						<TableHead>Prénom</TableHead>
						<TableHead>Nom</TableHead>
						<TableHead>Email</TableHead>
						<TableHead>Téléphone</TableHead>
						<TableHead>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{studentsData?.map((student) => {
						console.log(student);
						return (
							<TableRow key={student.id}>
								<TableCell>{student.id}</TableCell>
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
									<Button
										onClick={() => {
											router.push(
												`/student/edit/${student.id}`
											);
										}}
									>
										<EditIcon />
									</Button>
									<Button>Inscire à une section</Button>
									<Button>Inscire à une UE</Button>
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</div>
	);
};
