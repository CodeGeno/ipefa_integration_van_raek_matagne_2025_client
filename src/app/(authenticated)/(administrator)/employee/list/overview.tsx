"use client";

import { Button, Input } from "@/components/ui";
import { Employee } from "@/model/entity/lessons/employee.entity";
import { PaginationWithSearch } from "@/model/common/pagination.interface";

import PaginationComponent from "@/components/pagination-component";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { get } from "@/app/fetch";
import { EmployeeTable } from "./table";

export default function EmployeeOverview({
	url,
	searchValue,
}: {
	url: string;
	searchValue: string;
}) {
	const [employeesData, setEmployeesData] = useState<
		PaginationWithSearch<Employee>
	>({} as PaginationWithSearch<Employee>);
	useEffect(() => {
		const fetchData = async () => {
			const response = await get(url);
			const employeesData: PaginationWithSearch<Employee> =
				await response.json();
			setEmployeesData(employeesData);
		};
		fetchData();
	}, [url]);
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

			<EmployeeTable employeesData={employeesData.data} />
			<PaginationComponent
				totalPages={employeesData.total_pages}
				currentPage={employeesData.current_page}
				search={searchValue}
			/>
		</>
	);
}
