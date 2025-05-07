"use client";

import { Button, Input } from "@/components/ui";
import { Employee } from "@/model/entity/lessons/employee.entity";
import { PaginationWithSearch } from "@/model/common/pagination.interface";

import PaginationComponent from "@/components/pagination-component";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPaginated } from "@/app/fetch";
import { EmployeeTable } from "./table";
import { ApiPaginatedResponse } from "@/model/api/api.response";

export default function EmployeeOverview({
	url,
	searchValue,
}: {
	url: string;
	searchValue: string;
}) {
	const [employeesData, setEmployeesData] =
		useState<ApiPaginatedResponse<Employee[]>>();
	useEffect(() => {
		getEmployees();
	}, [url]);
	const getEmployees = async () => {
		const response = await getPaginated<Employee[]>(url);
		console.log(response);
		if (response.success) {
			setEmployeesData(response);
		}
	};
	const [searchInput, setSearchInput] = useState<string>(searchValue ?? "");
	const router = useRouter();

	const handleSearch = async () => {
		await router.push(`/employee/list?search=${searchInput}&page=1`);
	};
	const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") await handleSearch();
	};

	return (
		<>
			<div className="flex flex-row gap-2">
				<Input
					value={searchInput}
					onChange={(e) => setSearchInput(e.target.value)}
					onKeyDown={handleKeyDown}
				/>
				<Button onClick={handleSearch}>Rechercher</Button>
			</div>
			{employeesData && (
				<>
					<EmployeeTable employeesData={employeesData.data} />
					<PaginationComponent
						totalPages={employeesData.total_pages}
						currentPage={employeesData.page}
						search={searchValue}
					/>
				</>
			)}
		</>
	);
}
