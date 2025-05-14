"use client";
import { Student } from "@/model/entity/users/student.entity";
import { PaginationWithSearch } from "@/model/common/pagination.interface";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { EditIcon, ArrowUpDown } from "lucide-react";
import { useState } from "react";

export const StudentTable: React.FC<{
  studentsData: Student[];
}> = ({ studentsData }) => {
  const router = useRouter();
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (field: string) => {
    // If clicking on the same field, toggle direction
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // New field, set to ascending by default
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedData = [...studentsData].sort((a, b) => {
    if (!sortField) return 0;

    let valueA, valueB;

    // Determine which field to sort by
    switch (sortField) {
      case "id":
        valueA = a.id;
        valueB = b.id;
        break;
      case "firstName":
        valueA = a.contactDetails.firstName.toLowerCase();
        valueB = b.contactDetails.firstName.toLowerCase();
        break;
      case "lastName":
        valueA = a.contactDetails.lastName.toLowerCase();
        valueB = b.contactDetails.lastName.toLowerCase();
        break;
      case "email":
        valueA = a.email.toLowerCase();
        valueB = b.email.toLowerCase();
        break;
      case "phoneNumber":
        valueA = a.contactDetails.phoneNumber;
        valueB = b.contactDetails.phoneNumber;
        break;
      default:
        return 0;
    }

    // Sort based on direction
    if (sortDirection === "asc") {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  });

  return (
    <div className="container mx-auto">
      <Table>
        <TableHeader>
          <TableRow className="text-center">
            <TableHead
              className="cursor-pointer hover:bg-slate-100 transition-colors"
              onClick={() => handleSort("id")}
            >
              <div className="flex items-center justify-center">
                ID
                <ArrowUpDown className="h-4 w-4 ml-1" />
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-slate-100 transition-colors"
              onClick={() => handleSort("firstName")}
            >
              <div className="flex items-center justify-center">
                Prénom
                <ArrowUpDown className="h-4 w-4 ml-1" />
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-slate-100 transition-colors"
              onClick={() => handleSort("lastName")}
            >
              <div className="flex items-center justify-center">
                Nom
                <ArrowUpDown className="h-4 w-4 ml-1" />
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-slate-100 transition-colors"
              onClick={() => handleSort("email")}
            >
              <div className="flex items-center justify-center">
                Email
                <ArrowUpDown className="h-4 w-4 ml-1" />
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-slate-100 transition-colors"
              onClick={() => handleSort("phoneNumber")}
            >
              <div className="flex items-center justify-center">
                Téléphone
                <ArrowUpDown className="h-4 w-4 ml-1" />
              </div>
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData?.map((student) => {
            return (
              <TableRow key={student.id}>
                <TableCell>{student.id}</TableCell>
                <TableCell>{student.contactDetails.firstName}</TableCell>
                <TableCell>{student.contactDetails.lastName}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.contactDetails.phoneNumber}</TableCell>

                <TableCell>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary"
                      onClick={() => {
                        router.push(`/student/edit/${student.id}`);
                      }}
                    >
                      <EditIcon className="h-4 w-4 mr-1" />
                      Modifier
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary"
                      onClick={() => {
                        router.push(`/section/registration/${student.id}`);
                      }}
                    >
                      Inscire à une section
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
