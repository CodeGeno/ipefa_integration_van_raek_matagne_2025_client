import { BaseEntity } from "@/model/entity/base.entity";
import { AcademicUE } from "@/model/entity/ue/academic-ue.entity";
export interface UE extends BaseEntity {
  ueId: number;
  name: string;
  description: string;
  isActive: boolean;
  section: number;
  prerequisites: number[];
  cycle: number;
  periods: number;
}
