"use client";

import { Button, Input } from "@/components/ui";
import PaginationComponent from "@/components/pagination-component";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPaginated } from "@/app/fetch";
import { ApiPaginatedResponse } from "@/model/api/api.response";
import { Section } from "@/model/entity/ue/section.entity";
import SectionTable from "./table";
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
import {
  Search,
  Filter,
  GraduationCap,
  BookOpen,
  RotateCcw,
} from "lucide-react";

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
  const [category, setCategory] = useState<string>(categoryValue || "all");
  const [type, setType] = useState<string>(typeValue || "all");
  const [searchInput, setSearchInput] = useState<string>(searchValue ?? "");

  useEffect(() => {
    getSections();
  }, [url]);

  const getSections = async () => {
    const response = await getPaginated<Section[]>(url);
    if (response.success) {
      setSectionsData(response);
    }
  };

  const router = useRouter();

  const handleSearch = async () => {
    const searchParams = {
      search: searchInput,
      category: category === "all" ? undefined : category,
      type: type === "all" ? undefined : type,
    };
    await router.push(createUrlWithParams("/section/list", searchParams));
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") await handleSearch();
  };

  const handleFilter = async () => {
    const filterParams = {
      search: searchInput,
      page: 1,
      category: category === "all" ? undefined : category,
      type: type === "all" ? undefined : type,
    };

    await router.push(createUrlWithParams("/section/list", filterParams));
  };

  const handleResetFilters = async () => {
    setSearchInput("");
    setCategory("all");
    setType("all");
    await router.push("/section/list");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Rechercher une section"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-10"
          />
        </div>

        <div className="relative">
          <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="pl-10">
              <SelectValue placeholder="Sélectionnez une catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {Object.keys(SectionCategoryEnum).map((key) => (
                <SelectItem key={key} value={key}>
                  {SectionCategoryEnum[key as keyof typeof SectionCategoryEnum]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="relative">
          <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="pl-10">
              <SelectValue placeholder="Choisissez un type de cursus" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              {Object.keys(SectionTypeEnum).map((key) => (
                <SelectItem key={key} value={key}>
                  {SectionTypeEnum[key as keyof typeof SectionTypeEnum]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          onClick={handleResetFilters}
          variant="outline"
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
        >
          <RotateCcw className="h-4 w-4" />
          Réinitialiser
        </Button>
        <Button
          onClick={handleFilter}
          className="flex items-center gap-2 bg-slate-100 text-slate-700 hover:bg-slate-200"
        >
          <Filter className="h-4 w-4" />
          Filtrer
        </Button>
      </div>

      {sectionsData && (
        <>
          <SectionTable sections={sectionsData.data} />
          <PaginationComponent
            totalPages={sectionsData.total_pages}
            currentPage={sectionsData.page}
            search={searchInput}
            onPageChange={(page) => {
              const params = {
                search: searchInput,
                page,
                category: category === "all" ? undefined : category,
                type: type === "all" ? undefined : type,
              };
              router.push(createUrlWithParams("/section/list", params));
            }}
          />
        </>
      )}
    </div>
  );
}
