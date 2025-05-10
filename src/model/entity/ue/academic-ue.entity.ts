<<<<<<< HEAD
export interface AcademicUE {
  id: string;
  label: string;
  numberOfPeriods: number;
  sectionId: string;
  sectionName: string;
  cycleYear: number;
  startDate: string;
  endDate: string;
  prerequisites: string[];
  sessions: UESession[];
}

export interface UESession {
  id: string;
  date: string;
  status: "scheduled" | "completed" | "cancelled";
}

export interface CreateAcademicUEDto {
  label: string;
  numberOfPeriods: number;
  sectionId: string;
  cycleYear: number;
  startDate: string;
  endDate: string;
  prerequisites: string[];
=======
import { BaseEntity } from "@/model/entity/base.entity";
import { Student } from "@/model/entity/users/student.entity";
import { Lesson } from "@/model/entity/lessons/lesson.entity";
import { UE } from "@/model/entity/ue/ue.entity";
import { Employee } from "../lessons/employee.entity";

export interface AcademicUE extends BaseEntity {
	academicUeId: number;
	year: number;
	startDate: Date;
	endDate: Date;
	ue: UE;
	students: Student[];
	lessons: Lesson[];
	professor: Employee;
>>>>>>> ec174f7eba1d6c23e87e1d03568db1d16ffb7fca
}
