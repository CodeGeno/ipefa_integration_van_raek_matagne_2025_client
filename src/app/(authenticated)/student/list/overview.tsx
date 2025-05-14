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
import { Search, RotateCcw } from "lucide-react";

export default function StudentOverview({
  url,
  searchValue,
}: {
  url: string;
  searchValue: string;
}) {
  const [studentsData, setStudentsData] =
    useState<ApiPaginatedResponse<Student[]>>();
  const [searchInput, setSearchInput] = useState<string>(searchValue ?? "");
  const router = useRouter();

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

  const handleSearch = async () => {
    await router.push(`/student/list?search=${searchInput}&page=1`);
  };

  const handleReset = async () => {
    setSearchInput("");
    await router.push("/student/list");
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") await handleSearch();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Rechercher un étudiant..."
            className="pl-9 h-10"
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSearch}>
            <Search className="h-4 w-4 mr-1" />
            Rechercher
          </Button>
          <Button onClick={handleReset} variant="outline">
            <RotateCcw className="h-4 w-4 mr-1" />
            Réinitialiser
          </Button>
        </div>
      </div>

      {studentsData && (
        <>
          <StudentTable studentsData={studentsData.data} />
          <div className="mt-4">
            <PaginationComponent
              totalPages={studentsData.total_pages}
              currentPage={studentsData.page}
              search={searchValue}
            />
          </div>
        </>
      )}
    </div>
  );
}
