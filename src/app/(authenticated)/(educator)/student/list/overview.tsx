"use client";

import { Button, Input } from "@/components/ui";
import { Student } from "@/model/entity/users/student.entity";
import { PaginationWithSearch } from "@/model/common/pagination.interface";

import PaginationComponent from "@/components/pagination-component";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPaginated } from "@/app/fetch";
import { StudentTable } from "./table";
import { ApiPaginatedResponse } from "@/model/api/api.response";

export default function StudentOverview({
	url,
	searchValue,
}: {
	url: string;
	searchValue: string;
}) {
	const [studentsData, setStudentsData] =
		useState<ApiPaginatedResponse<Student[]>>();
	useEffect(() => {
		getStudents();
	}, [url]);

	const getStudents = async () => {
		const response = await getPaginated<Student[]>(url);
		console.log(response);
		if (response.success) {
			setStudentsData(response);
		}
	};

	const [searchInput, setSearchInput] = useState<string>(searchValue ?? "");
	const router = useRouter();

	const handleSearch = async () => {
		await router.push(`/student/list?search=${searchInput}&page=1`);
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

			{studentsData && (
				<>
					<StudentTable studentsData={studentsData.data} />
					<PaginationComponent
						totalPages={studentsData.total_pages}
						currentPage={studentsData.page}
						search={searchValue}
					/>
				</>
			)}
		</>
	);
}
