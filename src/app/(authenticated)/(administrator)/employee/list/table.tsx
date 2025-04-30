"use client";
import { Employee } from "@/model/entity/lessons/employee.entity";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { EditIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export const EmployeeTable: React.FC<{
	employeesData: Employee[];
}> = ({ employeesData }) => {
	const router = useRouter();
	return (
		<div className="container mx-auto">
			<h1 className="text-2xl font-bold mb-4">Liste des élèves</h1>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Matricule</TableHead>
						<TableHead>Prénom</TableHead>
						<TableHead>Nom</TableHead>
						<TableHead>Email</TableHead>

						<TableHead>Role</TableHead>
						<TableHead>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{employeesData?.map((employee) => (
						<TableRow key={employee.matricule}>
							<TableCell>{employee.matricule}</TableCell>
							<TableCell>
								{employee.contactDetails.firstName}
							</TableCell>
							<TableCell>
								{employee.contactDetails.lastName}
							</TableCell>
							<TableCell>{employee.email}</TableCell>
							<TableCell>{employee.role}</TableCell>
							<TableCell>
								<Button
									onClick={() => {
										router.push(
											`/employee/edit/${employee.accountId}`
										);
									}}
								>
									<EditIcon />
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};
