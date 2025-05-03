import { BaseEntity } from "@/model/entity/base.entity";
import { UE } from "@/model/entity/ue/ue.entity";
import { SectionTypeEnum } from "@/model/enum/section-type.enum";
import { SectionCategoryEnum } from "@/model/enum/section-category.enum";
export interface Section extends BaseEntity {
	sectionId: string;
	name: string;
	description: string;
	ues: UE[];
	sectionType: SectionTypeEnum;
	sectionCategory: SectionCategoryEnum;
}
