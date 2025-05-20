import EmployeeForm from "../employee-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Toaster } from "sonner";

const EmployeeEditPage = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
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
              Modifier un employé
            </h1>
            <p className="text-muted-foreground">
              Modifiez les informations de l&apos;employé
            </p>
          </div>
        </div>
        <EmployeeForm id={id} isEditing />
        <Toaster />
      </div>
    </div>
  );
};

export default EmployeeEditPage;
