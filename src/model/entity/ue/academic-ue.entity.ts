import {BaseEntity} from "@/model/entity/base.entity";
import {Student} from "@/model/entity/users/student.entity";
import {Lesson} from "@/model/entity/lessons/lesson.entity";
import {UE} from "@/model/entity/ue/ue.entity";

export interface AcademicUE extends BaseEntity {
    academicUeId: number;
    year: number;
    startDate: Date;
    endDate: Date;
    ue: UE;
    students: Student[];
    lessons: Lesson[];
}
