import { BaseEntity } from "@/model/entity/base.entity";
import { Student } from "@/model/entity/users/student.entity";
import { Lesson } from "@/model/entity/lessons/lesson.entity";
import { UE } from "@/model/entity/ue/ue.entity";
import { Employee } from "../lessons/employee.entity";

export interface AcademicUE extends BaseEntity {
	id: string;
	year: number;
	startDate: Date;
	endDate: Date;
	ue: UE;
	students: Student[];
	lessons: Lesson[];
	professor: Employee;
}

export interface UESession {
	id: string;
	date: string;
	status: "scheduled" | "completed" | "cancelled";
}

export interface CreateAcademicUEDto {
	label: string;
	numberOfPeriods: number;
	section: string;
	cycleYear: number;
	startDate: string;
	endDate: string;
	prerequisites: string[];
}
