import StudentOverview from "./overview";
import { createUrlWithParams } from "@/utils/url";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Plus } from "lucide-react";

export default async function StudentPageOverview({
  searchParams,
}: {
  searchParams: Promise<{ search: string; page: number }>;
}) {
  const { search, page } = await searchParams;
  const url = createUrlWithParams("/security/student/list/", {
    search,
    page,
  });

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Liste des étudiants</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gérez les étudiants de l'établissement
          </p>
        </div>
        <Link href="/student/create">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Ajouter un étudiant
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <CardTitle>Étudiants</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <StudentOverview url={url} searchValue={search} />
        </CardContent>
      </Card>
    </div>
  );
}
