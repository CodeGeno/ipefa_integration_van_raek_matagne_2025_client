import { BaseEntity } from "@/model/entity/base.entity";
import { UE } from "@/model/entity/ue/ue.entity";
export interface Section extends BaseEntity {
  name: string;
  description: string;
  ues: UE[];
}
