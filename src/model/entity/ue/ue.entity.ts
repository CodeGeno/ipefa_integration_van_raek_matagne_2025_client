import { BaseEntity } from "@/model/entity/base.entity";
import { AcademicUE } from "@/model/entity/ue/academic-ue.entity";
export interface UE extends BaseEntity {
  sectionId: number;
  name: string;
  prerequisites: UE[];
  academicUes: AcademicUE[];
  cycle: number;
  periods: number;
}
