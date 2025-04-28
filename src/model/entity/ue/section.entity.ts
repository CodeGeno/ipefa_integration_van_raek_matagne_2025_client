import { BaseEntity } from "@/model/entity/base.entity";
import { UE } from "@/model/entity/ue/ue.entity";
export interface Section extends BaseEntity {
  sectionId: number;
  name: string;
  sectionType: string;
  sectionCategory: string;
  description: string;
  ues: UE[];
}
