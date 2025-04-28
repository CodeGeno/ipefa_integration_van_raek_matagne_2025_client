"use client";

import { Button, Input } from "@/components/ui";
import { Student } from "@/model/entity/users/student.entity";
import { PaginationWithSearch } from "@/model/common/pagination.interface";

import PaginationComponent from "@/components/pagination-component";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { get } from "@/app/fetch";
import { StudentTable } from "./table";

export default function StudentOverview({
	url,
	searchValue,
}: {
	url: string;
	searchValue: string;
}) {
	const [studentsData, setStudentsData] = useState<
		PaginationWithSearch<Student>
	>({} as PaginationWithSearch<Student>);
	useEffect(() => {
		const fetchData = async () => {
			const response = await get(url);
			const studentsData: PaginationWithSearch<Student> =
				await response.json();
			setStudentsData(studentsData);
		};
		fetchData();
	}, [url]);
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

			<StudentTable studentsData={studentsData.data} />
			<PaginationComponent
				totalPages={studentsData.total_pages}
				currentPage={studentsData.current_page}
				search={searchValue}
			/>
		</>
	);
}
