import { AttendanceStatusEnum } from "@/model/enum/attendance-status.enum";
import { BaseEntity } from "@/model/entity/base.entity";

export interface Attendance extends BaseEntity {
  attendanceId: number;
  studentId: number;
  status: AttendanceStatusEnum;
  lessonId: number;
}
