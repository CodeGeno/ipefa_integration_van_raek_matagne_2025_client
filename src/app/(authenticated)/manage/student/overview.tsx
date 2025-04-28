"use client";

import { Button, Input } from "@/components/ui";
import { Student } from "@/model/entity/users/student.entity";
import { PaginationWithSearch } from "@/model/common/pagination.interface";
import { StudentTable } from "./page";
import PaginationComponent from "@/components/pagination-component";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function StudentOverview({
	studentsData,
	searchValue,
}: {
	studentsData: PaginationWithSearch<Student>;
	searchValue: string;
}) {
	const [searchInput, setSearchInput] = useState<string>(searchValue ?? "");
	const router = useRouter();

	const handleSearch = async () => {
		await router.push(`/manage/student?search=${searchInput}&page=1`);
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

			<StudentTable studentsData={studentsData} />
			<PaginationComponent
				totalPages={studentsData.total_pages}
				currentPage={studentsData.current_page}
				search={searchValue}
			/>
		</>
	);
}
