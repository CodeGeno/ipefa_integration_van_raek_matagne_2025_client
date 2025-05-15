"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Book, CheckSquare, Users } from "lucide-react";

interface Course {
  id: number;
  name: string;
  result?: number;
  status: string;
}

interface AcademicUE {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [academicUEs, setAcademicUEs] = useState<AcademicUE[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (user?.role === "student") {
        // Fetch student courses
        const response = await fetch("/api/student/courses", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setCourses(data);
        }
      } else if (user?.role === "teacher") {
        // Fetch teacher UEs
        const response = await fetch("/api/teacher/academic-ues", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setAcademicUEs(data);
        }
      }
    };

    fetchData();
  }, [user]);

  if (!user) return null;

  if (user.role !== "student" && user.role !== "teacher") {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Tableau de bord</h1>
        <p>Bienvenue sur votre tableau de bord.</p>
      </div>
    );
  }

  if (user.role === "student") {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Mes cours</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card key={course.id}>
              <CardHeader>
                <CardTitle className="text-lg">{course.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>Statut : {course.status}</p>
                  {course.result && (
                    <p className="font-semibold">Résultat : {course.result}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mes UE académiques</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {academicUEs.map((ue) => (
          <Card key={ue.id}>
            <CardHeader>
              <CardTitle className="text-lg">{ue.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Du {new Date(ue.startDate).toLocaleDateString()} au{" "}
                    {new Date(ue.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Link href={`/courses/${ue.id}/lessons`}>
                    <Button variant="outline" className="w-full">
                      <Book className="w-4 h-4 mr-2" />
                      Leçons
                    </Button>
                  </Link>
                  <Link href={`/courses/${ue.id}/attendance`}>
                    <Button variant="outline" className="w-full">
                      <Users className="w-4 h-4 mr-2" />
                      Présences
                    </Button>
                  </Link>
                  <Link href={`/courses/${ue.id}/results`}>
                    <Button variant="outline" className="w-full">
                      <CheckSquare className="w-4 h-4 mr-2" />
                      Résultats
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
