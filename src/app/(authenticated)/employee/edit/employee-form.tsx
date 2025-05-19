"use client";

import { get } from "@/app/fetch";
import { Employee } from "@/model/entity/lessons/employee.entity";
import { useEffect } from "react";
import { useState } from "react";
import { EmployeeEditForm } from "@/components/forms/EmployeeEditForm";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const EmployeeForm = ({
  id,
  isEditing,
}: {
  id: string;
  isEditing: boolean;
}) => {
  const [employee, setEmployee] = useState<Employee>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchEmployee = async () => {
      setLoading(true);
      try {
        const response = await get<Employee>(`/security/employee/${id}/`);
        setEmployee(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [id]);

  return (
    <Card className="border-none shadow-lg">
      <CardContent className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {employee ? (
              <EmployeeEditForm employee={employee} isEditing />
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Employé non trouvé</p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default EmployeeForm;
