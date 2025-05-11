import { Attendance } from "@/model/entity/lessons/attendance.entity";
import { BaseEntity } from "@/model/entity/base.entity";
import { AttendanceStatusEnum } from "@/model/enum/attendance-status.enum";

export interface Lesson extends BaseEntity {
	lessonId: number;
	academicUeId: number;
	lesson_date: Date;
	attendances: Attendance[];
	status: keyof typeof AttendanceStatusEnum;
}

export enum LessonStatus {
	PROGRAMMED = "Programmée",
	IN_PROGRESS = "En cours",
	COMPLETED = "Terminée",
	CANCELLED = "Annulée",
}
