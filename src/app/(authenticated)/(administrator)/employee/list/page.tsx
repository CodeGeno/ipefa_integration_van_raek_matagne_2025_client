import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EmployeeOverview from "./overview";
import { createUrlWithParams } from "@/utils/url";
import Link from "next/link";
import { UserPlus } from "lucide-react";

export default async function EmployeePageOverview({
  searchParams,
}: {
  searchParams: Promise<{ search: string; page: number }>;
}) {
  const { search, page } = await searchParams;
  const url = createUrlWithParams("/security/employee/list/", {
    search,
    page,
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">
              Liste des employés
            </h1>
            <p className="text-muted-foreground">
              Gérez les employés de l'institution
            </p>
          </div>
          <Link href="/employee/create">
            <Button className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Ajouter un employé
            </Button>
          </Link>
        </div>

        <Card className="border-none shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
            <CardTitle className="text-xl">Gestion des employés</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <EmployeeOverview url={url} searchValue={search} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
