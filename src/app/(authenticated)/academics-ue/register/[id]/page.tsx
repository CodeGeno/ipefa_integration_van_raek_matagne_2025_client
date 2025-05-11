"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { get } from "@/app/fetch";
import { AcademicUE } from "@/model/entity/ue/academic-ue.entity";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

enum RegistrationStatus {
  APPROVED = "AP",
  REJECTED = "NP",
}

const AcademicsUERegisterPage = () => {
  const { id } = useParams();
  const [academicUE, setAcademicUE] = useState<AcademicUE>();
  const fetchAcademicUE = async () => {
    const response = await get<AcademicUE>(
      `/ue-management/academic-ues/register/${id}/`
    );
    if (response.success) {
      setAcademicUE(response.data);
    } else {
      toast.error(response.message);
    }
  };

  useEffect(() => {
    fetchAcademicUE();
  }, [id]);

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex gap-4 items-center">
            Inscription aux UE
            <Link href="/academics-ue">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Retour à la liste des UE
              </Button>
            </Link>
          </CardTitle>
          {academicUE?.professor && (
            <p className="text-gray-600">
              Professeur : {academicUE.professor.contactDetails.firstName}{" "}
              {academicUE.professor.contactDetails.lastName}
            </p>
          )}
        </CardHeader>
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">Etudiants inscrits</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Matricule</TableHead>
                <TableHead>Nom Prénom</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {academicUE?.students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.matricule}</TableCell>
                  <TableCell>
                    {student.contactDetails.firstName}{" "}
                    {student.contactDetails.lastName}
                  </TableCell>
                  <TableCell>Inscrit</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AcademicsUERegisterPage;
