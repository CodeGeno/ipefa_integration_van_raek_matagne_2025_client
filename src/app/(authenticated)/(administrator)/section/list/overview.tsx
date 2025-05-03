"use client";

import { Button, Input } from "@/components/ui";
import { Employee } from "@/model/entity/lessons/employee.entity";
import { PaginationWithSearch } from "@/model/common/pagination.interface";

import PaginationComponent from "@/components/pagination-component";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPaginated } from "@/app/fetch";

import { ApiPaginatedResponse } from "@/model/api/api.response";
import { Section } from "@/model/entity/ue/section.entity";
import SectionTable from "./table";
import { CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { SectionTypeEnum } from "@/model/enum/section-type.enum";
import { SectionCategoryEnum } from "@/model/enum/section-category.enum";
import { createUrlWithParams } from "@/utils/url";

export default function SectionOverview({
	url,
	searchValue,
	categoryValue,
	typeValue,
}: {
	url: string;
	searchValue: string;
	categoryValue: string;
	typeValue: string;
}) {
	const [sectionsData, setSectionsData] =
		useState<ApiPaginatedResponse<Section[]>>();
	useEffect(() => {
		getSections();
	}, [url]);
	const getSections = async () => {
		console.log(url);
		const response = await getPaginated<Section[]>(url);
		console.log(response);
		if (response.success) {
			setSectionsData(response);
		}
	};

	const router = useRouter();

	const handleSearch = async () => {
		const searchParams = {
			search: searchInput,
			page: 1,
			category: category === "all" ? undefined : category,
			type: type === "all" ? undefined : type,
		};

		await router.push(createUrlWithParams("/section/list", searchParams));
	};
	const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") await handleSearch();
	};

	const [category, setCategory] = useState<string>(categoryValue || "all");
	const [type, setType] = useState<string>(typeValue || "all");
	const [searchInput, setSearchInput] = useState<string>(searchValue ?? "");

	const handleFilter = async () => {
		const filterParams = {
			search: searchInput,
			page: 1,
			category: category === "all" ? undefined : category,
			type: type === "all" ? undefined : type,
		};

		await router.push(createUrlWithParams("/section/list", filterParams));
	};

	return (
		<>
			<div className="space-y-4 sm:px-0">
				<div className="flex flex-col md:flex-row gap-4 ">
					<div className="flex flex-col flex-1 gap-2 ">
						<Label>Nom de la section</Label>
						<Input
							placeholder="ex: Bachelier en Informatique"
							value={searchInput}
							onChange={(e) => setSearchInput(e.target.value)}
							onKeyDown={handleKeyDown}
						/>
					</div>

					<div className="flex flex-col flex-1 gap-2 ">
						<Label>Catégorie</Label>
						<Select
							value={category}
							onValueChange={setCategory}
						>
							<SelectTrigger>
								<SelectValue placeholder="Sélectionnez une catégorie" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">Toutes</SelectItem>
								{Object.keys(SectionCategoryEnum).map((key) => (
									<SelectItem
										key={key}
										value={key}
									>
										{
											SectionCategoryEnum[
												key as keyof typeof SectionCategoryEnum
											]
										}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="flex flex-col flex-1 gap-2">
						<Label>Type de cursus</Label>
						<Select
							value={type}
							onValueChange={setType}
						>
							<SelectTrigger>
								<SelectValue placeholder="Sélectionnez un type de cursus" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">Tous</SelectItem>
								{Object.keys(SectionTypeEnum).map((key) => (
									<SelectItem
										key={key}
										value={key}
									>
										{
											SectionTypeEnum[
												key as keyof typeof SectionTypeEnum
											]
										}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>
			</div>

			<div className="flex w-full py-4">
				<Button
					className="w-full"
					onClick={handleFilter}
				>
					Filtrer
				</Button>
			</div>

			{sectionsData && (
				<>
					<SectionTable sections={sectionsData.data} />
					<PaginationComponent
						totalPages={sectionsData.total_pages}
						currentPage={sectionsData.page}
						search={searchValue}
					/>
				</>
			)}
		</>
	);
}
