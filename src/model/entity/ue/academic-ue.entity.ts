import { UE } from "./ue.entity";
import { Student } from "../users/student.entity";
import { Employee } from "../lessons/employee.entity";
import { BaseEntity } from "@/model/entity/base.entity";

export interface AcademicUE extends BaseEntity {
	id: string;
	year: number;
	start_date: string;
	end_date: string;
	ue: UE;
	students: Student[];
	professor: Employee | null;
	lessons: {
		id: number;
		lesson_date: string;
		status: string;
	}[];
	results: {
		id: number;
		result: number | null;
		period: number;
		success: boolean;
		isExempt: boolean;
		approved: boolean;
	}[];
}

export interface CreateAcademicUEDto {
	ue_id: number;
	year: number;
	start_date: string;
	end_date: string;
	professor_id?: number;
	lessons_data: {
		lesson_date: string;
	}[];
}
