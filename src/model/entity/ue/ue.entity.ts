import { BaseEntity } from "@/model/entity/base.entity";

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
