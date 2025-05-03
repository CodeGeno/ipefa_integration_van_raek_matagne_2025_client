import { z } from "zod";
import { SectionTypeEnum } from "@/model/enum/section-type.enum";
import { SectionCategoryEnum } from "@/model/enum/section-category.enum";

export const sectionSchema = z.object({
	name: z.string().min(1, "Le nom de la section est requis"),
	sectionType: z.enum(Object.keys(SectionTypeEnum) as [string, ...string[]]),
	sectionCategory: z.enum(
		Object.keys(SectionCategoryEnum) as [string, ...string[]]
	),
	description: z.string().optional(),
});

export type SectionFormData = z.infer<typeof sectionSchema>;
