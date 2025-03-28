import { Attendance } from "@/model/entity/lessons/attendance.entity";
import { BaseEntity } from "@/model/entity/base.entity";

export interface Lesson extends BaseEntity {
  academicUeId: number;
  lessonDate: Date;
  attendances: Attendance[];
}
