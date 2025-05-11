import { EmployeeCreationForm } from "@/components/forms/EmployeeCreationForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const EmployeeCreationPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto p-4">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/employee/list">
            <Button variant="ghost" size="icon" className="hover:bg-muted">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Créer un employé
            </h1>
            <p className="text-muted-foreground">
              Ajoutez un nouvel employé à l&apos;institution
            </p>
          </div>
        </div>
        <EmployeeCreationForm />
      </div>
    </div>
  );
};

export default EmployeeCreationPage;
