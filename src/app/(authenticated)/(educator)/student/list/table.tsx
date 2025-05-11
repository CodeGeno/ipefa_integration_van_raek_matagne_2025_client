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
import { Edit, GraduationCap, BookOpen, Eye } from "lucide-react";
import Link from "next/link";

export const StudentTable: React.FC<{
  studentsData: Student[];
}> = ({ studentsData }) => {
  const router = useRouter();

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Prénom</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Téléphone</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {studentsData?.map((student) => (
            <TableRow key={student.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">{student.id}</TableCell>
              <TableCell>{student.contactDetails.firstName}</TableCell>
              <TableCell>{student.contactDetails.lastName}</TableCell>
              <TableCell>{student.email}</TableCell>
              <TableCell>{student.contactDetails.phoneNumber || "-"}</TableCell>
              <TableCell>
                <div className="flex justify-end gap-2">
                  <Link href={`/student/details/${student.id}`}>
                    <Button variant="outline" size="sm" className="h-8">
                      <Eye className="h-4 w-4 mr-2" />
                      Voir détails
                    </Button>
                  </Link>
                  <Link href={`/student/edit/${student.id}`}>
                    <Button variant="outline" size="sm" className="h-8">
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8"
                    onClick={() =>
                      router.push(`/student/details/${student.id}?tab=section`)
                    }
                  >
                    <GraduationCap className="h-4 w-4 mr-2" />
                    Inscrire à une section
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8"
                    onClick={() =>
                      router.push(`/student/details/${student.id}?tab=ue`)
                    }
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Inscrire à une UE
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
