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
import { ArrowUpDown, Edit, Mail, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { AccountTypeEnum } from "@/model/enum/account-type.enum";
import { useState } from "react";

export const EmployeeTable: React.FC<{
	employeesData: Employee[];
}> = ({ employeesData }) => {
	const router = useRouter();
	const [sortField, setSortField] = useState<string | null>(null);
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

	const handleSort = (field: string) => {
		// If clicking on the same field, toggle direction
		if (sortField === field) {
			setSortDirection(sortDirection === "asc" ? "desc" : "asc");
		} else {
			// New field, set to ascending by default
			setSortField(field);
			setSortDirection("asc");
		}
	};

	const sortedData = [...employeesData].sort((a, b) => {
		if (!sortField) return 0;

		let valueA, valueB;

		// Determine which field to sort by
		switch (sortField) {
			case "matricule":
				valueA = a.matricule.toLowerCase();
				valueB = b.matricule.toLowerCase();
				break;
			case "firstName":
				valueA = a.contactDetails.firstName.toLowerCase();
				valueB = b.contactDetails.firstName.toLowerCase();
				break;
			case "lastName":
				valueA = a.contactDetails.lastName.toLowerCase();
				valueB = b.contactDetails.lastName.toLowerCase();
				break;
			case "email":
				valueA = a.email.toLowerCase();
				valueB = b.email.toLowerCase();
				break;
			case "role":
				valueA = a.role.toLowerCase();
				valueB = b.role.toLowerCase();
				break;
			default:
				return 0;
		}

		// Sort based on direction
		if (sortDirection === "asc") {
			return valueA > valueB ? 1 : -1;
		} else {
			return valueA < valueB ? 1 : -1;
		}
	});

	const getRoleBadgeColor = (role: string) => {
		switch (role) {
			case "ADMINISTRATOR":
				return "bg-blue-100 text-blue-800";

			case "EDUCATOR":
				return "bg-red-100 text-green-800";
			case "PROFESSOR":
				return "bg-green-100 text-gray-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead
							className="w-[100px] cursor-pointer hover:bg-slate-100 transition-colors"
							onClick={() => handleSort("matricule")}
						>
							<div className="flex items-center">
								Matricule
								<ArrowUpDown className="h-4 w-4 ml-1" />
							</div>
						</TableHead>
						<TableHead
							className="cursor-pointer hover:bg-slate-100 transition-colors"
							onClick={() => handleSort("firstName")}
						>
							<div className="flex items-center">
								Prénom
								<ArrowUpDown className="h-4 w-4 ml-1" />
							</div>
						</TableHead>
						<TableHead
							className="cursor-pointer hover:bg-slate-100 transition-colors"
							onClick={() => handleSort("lastName")}
						>
							<div className="flex items-center">
								Nom
								<ArrowUpDown className="h-4 w-4 ml-1" />
							</div>
						</TableHead>
						<TableHead
							className="cursor-pointer hover:bg-slate-100 transition-colors"
							onClick={() => handleSort("email")}
						>
							<div className="flex items-center">
								Email
								<ArrowUpDown className="h-4 w-4 ml-1" />
							</div>
						</TableHead>
						<TableHead
							className="cursor-pointer hover:bg-slate-100 transition-colors"
							onClick={() => handleSort("role")}
						>
							<div className="flex items-center">
								Rôle
								<ArrowUpDown className="h-4 w-4 ml-1" />
							</div>
						</TableHead>
						<TableHead className="text-right">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{sortedData?.map((employee) => (
						<TableRow
							key={employee.matricule}
							className="hover:bg-muted/50"
						>
							<TableCell className="font-medium">
								{employee.matricule}
							</TableCell>
							<TableCell>
								<div className="flex items-center gap-2">
									<User className="h-4 w-4 text-muted-foreground" />
									{employee.contactDetails.firstName}
								</div>
							</TableCell>
							<TableCell>
								{employee.contactDetails.lastName}
							</TableCell>
							<TableCell>
								<div className="flex items-center gap-2">
									<Mail className="h-4 w-4 text-muted-foreground" />
									{employee.email}
								</div>
							</TableCell>
							<TableCell>
								<Badge
									variant="secondary"
									className={getRoleBadgeColor(employee.role)}
								>
									{AccountTypeEnum[employee.role]}
								</Badge>
							</TableCell>
							<TableCell>
								<div className="flex justify-end">
									<Button
										variant="ghost"
										onClick={() => {
											router.push(
												`/employee/edit/${employee.id}`
											);
										}}
										className="hover:bg-muted flex items-center gap-2"
									>
										<Edit className="h-4 w-4" />
										Modifier
									</Button>
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};
