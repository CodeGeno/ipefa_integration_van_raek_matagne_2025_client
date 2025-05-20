"use client";

import { useEffect, useState, useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Book, CheckSquare, Users, Search } from "lucide-react";
import { AccountRoleEnum } from "@/model/enum/account-role.enum";
import { AccountContext } from "@/app/context";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { get } from "@/app/fetch";
import { Attendance } from "@/model/entity/lessons/attendance.entity";

interface ContactDetails {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  birthDate: string;
  gender: string;
}
interface Address {
  id: number;
  street: string;
  city: string;
  zipCode: string;
  country: string;
  number: string;
  complement: string;
  state: string;
}
interface Student {
  id: number;
  role: string;
  contactDetails: ContactDetails;
  address: Address;
  identifier: string;
  email: string;
}
interface Professor {
  id: number;
  role: string;
  contactDetails: ContactDetails;
  address: Address;
  identifier: string;
  email: string;
  matricule: string;
}
interface UE {
  id: number;
  prerequisites: string[];
  name: string;
  description: string;
  isActive: boolean;
  cycle: number;
  periods: number;
  section: number;
}
interface Lesson {
  id: number;
  lesson_date: string;
  status: string;
}
interface Result {
  id: number;
  academicsUE: number;
  approved: boolean;
  isExempt: boolean;
  period: number;
  result: number;
  student: number;
  success: boolean;
}
interface AcademicUE {
  id: number;
  year: number;
  start_date: string;
  end_date: string;
  ue: UE;
  students: Student[];
  professor: Professor;
  lessons: Lesson[];
  results: Result;
  attendances: Attendance[];
}

const getRoleFromContext = (role: string): AccountRoleEnum => {
  switch (role) {
    case "STUDENT":
      return AccountRoleEnum.STUDENT;
    case "PROFESSOR":
      return AccountRoleEnum.PROFESSOR;
    case "ADMINISTRATOR":
      return AccountRoleEnum.ADMINISTRATOR;
    case "EDUCATOR":
      return AccountRoleEnum.EDUCATOR;
    default:
      return AccountRoleEnum.STUDENT;
  }
};

const getAccountIdFromToken = (token: string): number | null => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    const payload = JSON.parse(jsonPayload);
    return payload.accountId;
  } catch (error) {
    console.error("Erreur lors du décodage du token:", error);
    return null;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return "bg-green-500";
    case "PROGRAMMED":
      return "bg-blue-500";
    case "REPORTED":
      return "bg-yellow-500";
    default:
      return "bg-gray-500";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return "Terminé";
    case "PROGRAMMED":
      return "Programmé";
    case "REPORTED":
      return "Reporté";
    default:
      return status;
  }
};

export default function DashboardPage() {
  const { accountData: user } = useContext(AccountContext);
  const [academicUEs, setAcademicUEs] = useState<AcademicUE[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const router = useRouter();

  if (!user) return null;

  const userRole = getRoleFromContext(user.role);

  useEffect(() => {
    const userRole = getRoleFromContext(user.role);
    if (userRole !== AccountRoleEnum.STUDENT) {
      router.push("/academics-ue");
      return;
    }

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token non trouvé");
          return;
        }

        const accountId = getAccountIdFromToken(token);
        if (!accountId) {
          console.error("Impossible d'extraire l'ID du compte du token");
          return;
        }

        if (userRole === AccountRoleEnum.STUDENT) {
          const response = await get<AcademicUE[]>(
            `/ue-management/academic-ues/student/details/${accountId}/`
          );

          if (!response.success) {
            console.error("Erreur de la requête:", {
              message: response.message,
            });
            return;
          }
          if (response.data && response.success) {
            setAcademicUEs(response.data);
          }
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    };

    fetchData();
  }, [user, router]);

  if (
    userRole !== AccountRoleEnum.STUDENT &&
    userRole !== AccountRoleEnum.PROFESSOR
  ) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Tableau de bord</h1>
        <p>Bienvenue sur votre tableau de bord.</p>
      </div>
    );
  }

  // Get unique years from academic UEs
  const years = Array.from(new Set(academicUEs.map((ue) => ue.year))).sort(
    (a, b) => b - a
  );

  // Filter UEs based on search query and selected year
  const filteredUEs = academicUEs.filter((ue) => {
    const matchesSearch = ue.ue.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesYear =
      selectedYear === "all" || ue.year.toString() === selectedYear;
    return matchesSearch && matchesYear;
  });

  // Group UEs by year
  const uesByYear = filteredUEs.reduce((acc, ue) => {
    const year = ue.year;
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(ue);
    return acc;
  }, {} as Record<number, AcademicUE[]>);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mes UE académiques</h1>
        <div className="flex gap-4">
          <div className="relative w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une UE..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sélectionner une année" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les années</SelectItem>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-8">
        {Object.entries(uesByYear)
          .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA))
          .map(([year, ues]) => (
            <div key={year}>
              <h2 className="text-xl font-semibold mb-4">Année {year}</h2>
              <div className="space-y-4">
                {ues.map((academicUE) => {
                  return (
                    <Card key={academicUE.id}>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">
                            {academicUE.ue.name}
                          </CardTitle>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Book className="w-4 h-4 mr-2" />
                                  Leçons
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl">
                                <DialogHeader>
                                  <DialogTitle>
                                    Leçons - {academicUE.ue.name}
                                  </DialogTitle>
                                </DialogHeader>
                                <ScrollArea className="h-[400px]">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Statut</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {academicUE.lessons
                                        .sort(
                                          (a, b) =>
                                            new Date(a.lesson_date).getTime() -
                                            new Date(b.lesson_date).getTime()
                                        )
                                        .map((lesson) => (
                                          <TableRow key={lesson.id}>
                                            <TableCell>
                                              {new Date(
                                                lesson.lesson_date
                                              ).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                              <Badge
                                                className={`${getStatusColor(
                                                  lesson.status
                                                )} text-white`}
                                              >
                                                {getStatusText(lesson.status)}
                                              </Badge>
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                    </TableBody>
                                  </Table>
                                </ScrollArea>
                              </DialogContent>
                            </Dialog>

                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Users className="w-4 h-4 mr-2" />
                                  Présences
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl">
                                <DialogHeader>
                                  <DialogTitle>
                                    Présences - {academicUE.ue.name}
                                  </DialogTitle>
                                </DialogHeader>
                                <ScrollArea className="h-[400px]">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>
                                          Statut de la leçon
                                        </TableHead>
                                        <TableHead>Présence</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {academicUE.lessons
                                        .sort(
                                          (a, b) =>
                                            new Date(a.lesson_date).getTime() -
                                            new Date(b.lesson_date).getTime()
                                        )
                                        .map((lesson) => {
                                          const attendance =
                                            academicUE.attendances.find(
                                              (attendance) =>
                                                attendance.lesson_id ===
                                                lesson.id
                                            );
                                          // On prépare le badge selon le statut de présence
                                          let badgeColor = "bg-gray-400";
                                          let badgeText = "Non défini";
                                          if (attendance) {
                                            switch (attendance.status) {
                                              case "P":
                                                badgeColor = "bg-green-500";
                                                badgeText = "Présent";
                                                break;
                                              case "M":
                                                badgeColor = "bg-yellow-500";
                                                badgeText = "Malade";
                                                break;
                                              case "Abandon":
                                                badgeColor = "bg-red-500";
                                                badgeText = "Abandon";
                                                break;
                                              default:
                                                badgeColor = "bg-gray-400";
                                                badgeText = attendance.status;
                                            }
                                          }
                                          return (
                                            <TableRow key={lesson.id}>
                                              <TableCell>
                                                {new Date(
                                                  lesson.lesson_date
                                                ).toLocaleDateString()}
                                              </TableCell>
                                              <TableCell>
                                                <Badge
                                                  className={`${getStatusColor(
                                                    lesson.status
                                                  )} text-white`}
                                                >
                                                  {getStatusText(lesson.status)}
                                                </Badge>
                                              </TableCell>
                                              <TableCell>
                                                <Badge
                                                  className={`${badgeColor} text-white`}
                                                >
                                                  {badgeText}
                                                </Badge>
                                              </TableCell>
                                            </TableRow>
                                          );
                                        })}
                                    </TableBody>
                                  </Table>
                                </ScrollArea>
                              </DialogContent>
                            </Dialog>

                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <CheckSquare className="w-4 h-4 mr-2" />
                                  Résultats
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl">
                                <DialogHeader>
                                  <DialogTitle>
                                    Résultats - {academicUE.ue.name}
                                  </DialogTitle>
                                </DialogHeader>
                                <ScrollArea className="h-[400px]">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Résultat</TableHead>
                                        <TableHead>Approuvé</TableHead>
                                        <TableHead>Exempté</TableHead>
                                        <TableHead>Périodes</TableHead>
                                        <TableHead>Succès</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {academicUE.results ? (
                                        <TableRow key={academicUE.results.id}>
                                          <TableCell>
                                            {`${academicUE.results.result} / ${
                                              academicUE.results.period * 10
                                            }`}
                                          </TableCell>
                                          <TableCell>
                                            <Badge
                                              className={
                                                academicUE.results.approved
                                                  ? "bg-green-500"
                                                  : "bg-red-500"
                                              }
                                            >
                                              {academicUE.results.approved
                                                ? "Oui"
                                                : "Non"}
                                            </Badge>
                                          </TableCell>
                                          <TableCell>
                                            {academicUE.results.isExempt
                                              ? "Oui"
                                              : "Non"}
                                          </TableCell>
                                          <TableCell>
                                            {academicUE.results.period}
                                          </TableCell>
                                          <TableCell>
                                            <Badge
                                              className={
                                                academicUE.results.success
                                                  ? "bg-green-500"
                                                  : "bg-red-500"
                                              }
                                            >
                                              {academicUE.results.success
                                                ? "Oui"
                                                : "Non"}
                                            </Badge>
                                          </TableCell>
                                        </TableRow>
                                      ) : (
                                        <TableRow>
                                          <TableCell
                                            colSpan={5}
                                            className="text-center text-muted-foreground"
                                          >
                                            Aucun résultat disponible pour le
                                            moment
                                          </TableCell>
                                        </TableRow>
                                      )}
                                    </TableBody>
                                  </Table>
                                </ScrollArea>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            Du{" "}
                            {new Date(
                              academicUE.start_date
                            ).toLocaleDateString()}{" "}
                            au{" "}
                            {new Date(academicUE.end_date).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Professeur:{" "}
                            {academicUE.professor.contactDetails.firstName}{" "}
                            {academicUE.professor.contactDetails.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Description: {academicUE.ue.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
