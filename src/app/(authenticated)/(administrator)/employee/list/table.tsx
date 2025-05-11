"use client";
import { Employee } from "@/model/entity/lessons/employee.entity";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Mail, Phone, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export const EmployeeTable: React.FC<{
  employeesData: Employee[];
}> = ({ employeesData }) => {
  const router = useRouter();

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800";
      case "EDUCATOR":
        return "bg-blue-100 text-blue-800";
      case "SECRETARY":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Matricule</TableHead>
            <TableHead>Prénom</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employeesData?.map((employee) => (
            <TableRow key={employee.matricule} className="hover:bg-muted/50">
              <TableCell className="font-medium">
                {employee.matricule}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  {employee.contactDetails.firstName}
                </div>
              </TableCell>
              <TableCell>{employee.contactDetails.lastName}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {employee.email}
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={getRoleBadgeColor(employee.role)}
                >
                  {employee.role}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      router.push(`/employee/edit/${employee.id}`);
                    }}
                    className="hover:bg-muted flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Modifier
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
