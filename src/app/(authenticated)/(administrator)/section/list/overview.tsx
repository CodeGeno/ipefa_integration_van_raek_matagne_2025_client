"use client";

import { Button, Input } from "@/components/ui";
import { Employee } from "@/model/entity/lessons/employee.entity";
import { PaginationWithSearch } from "@/model/common/pagination.interface";

import PaginationComponent from "@/components/pagination-component";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPaginated } from "@/app/fetch";
import { SectionTable } from "./table";
import { ApiPaginatedResponse } from "@/model/api/api.response";
import { Section } from "@/model/entity/ue/section.entity";

export default function SectionOverview({
  url,
  searchValue,
}: {
  url: string;
  searchValue: string;
}) {
  const [sectionsData, setSectionsData] =
    useState<ApiPaginatedResponse<Section[]>>();
  useEffect(() => {
    getSections();
  }, [url]);
  const getSections = async () => {
    const response = await getPaginated<Section[]>(url);
    console.log(response);
    if (response.success) {
      setSectionsData(response);
    }
  };
  const [searchInput, setSearchInput] = useState<string>(searchValue ?? "");
  const router = useRouter();

  const handleSearch = async () => {
    await router.push(`/section/list?search=${searchInput}&page=1`);
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
      {sectionsData && (
        <>
          <SectionTable sectionsData={sectionsData.data} />
          <PaginationComponent
            totalPages={sectionsData.total_pages}
            currentPage={sectionsData.current_page}
            search={searchValue}
          />
        </>
      )}
    </>
  );
}
