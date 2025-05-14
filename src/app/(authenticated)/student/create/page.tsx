import { StudentCreationForm } from "@/components/forms/StudentCreationForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, UserPlus } from "lucide-react";

const StudentCreationPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">
              Créer un étudiant
            </h1>
            <p className="text-muted-foreground">
              Ajoutez un nouvel étudiant à l'établissement
            </p>
          </div>
          <Link href="/student/list">
            <Button
              variant="outline"
              className="flex items-center gap-2 hover:bg-background"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour à la liste
            </Button>
          </Link>
        </div>

        <div className="grid gap-6">
          <Card className="border-none shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-3 rounded-full">
                  <UserPlus className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">
                    Informations de l'étudiant
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Remplissez le formulaire ci-dessous pour créer un nouveau
                    compte étudiant
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <StudentCreationForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentCreationPage;
