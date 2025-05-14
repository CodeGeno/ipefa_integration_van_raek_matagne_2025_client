"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Employee } from "@/model/entity/lessons/employee.entity";
import { PaginationWithSearch } from "@/model/common/pagination.interface";
import PaginationComponent from "@/components/pagination-component";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPaginated } from "@/app/fetch";
import { EmployeeTable } from "./table";
import { ApiPaginatedResponse } from "@/model/api/api.response";
import { Search } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function EmployeeOverview({
  url,
  searchValue,
}: {
  url: string;
  searchValue: string;
}) {
  const [employeesData, setEmployeesData] =
    useState<ApiPaginatedResponse<Employee[]>>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getEmployees();
  }, [url]);

  const getEmployees = async () => {
    setIsLoading(true);
    try {
      const response = await getPaginated<Employee[]>(url);
      if (response.success) {
        setEmployeesData(response);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des employés:", error);
    } finally {
      setIsLoading(false);
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
    <div className="space-y-6">
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Rechercher un employé..."
              className="pl-9"
            />
          </div>
          <Button onClick={handleSearch} className="sm:w-auto">
            Rechercher
          </Button>
        </div>
      </Card>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : employeesData ? (
        <div className="space-y-4">
          <EmployeeTable employeesData={employeesData.data} />
          <PaginationComponent
            totalPages={employeesData.total_pages}
            currentPage={employeesData.page}
            search={searchValue}
          />
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Aucun employé trouvé</p>
        </div>
      )}
    </div>
  );
}
