import { BaseEntity } from "@/model/entity/base.entity";
import { Student } from "@/model/entity/users/student.entity";
import { Lesson } from "@/model/entity/lessons/lesson.entity";
export interface AcademicUE extends BaseEntity {
  year: number;
  code: string;
  startDate: Date;
  endDate: Date;
  ueId: number;
  students: Student[];
  lessons: Lesson[];
}
