import CustomAlertDialog from "@/app/custom-alert-dialog";
import { del } from "@/app/fetch";
import { Button } from "@/components/ui/button";
import { Section } from "@/model/entity/ue/section.entity";
import { SectionCategoryEnum } from "@/model/enum/section-category.enum";
import { SectionTypeEnum } from "@/model/enum/section-type.enum";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
interface SectionTableProps {
	sections: Section[];
}

const SectionTable: React.FC<SectionTableProps> = ({
	sections,
}: {
	sections: Section[];
}) => {
	const router = useRouter();
	const deleteSection = async (sectionId: string) => {
		try {
			const response = await del(`/section/delete/${sectionId}/`);
			if (response.success) {
				toast.success("Section supprimée avec succès");
				setTimeout(() => {
					router.refresh();
				}, 1500);
			} else {
				toast.error("Une erreur est survenue lors de la suppression");
			}
		} catch (error) {
			console.error(error);
		}
	};

	// Fonction pour récupérer le libellé de l'enum SectionType
	const getSectionTypeLabel = (type: any): string => {
		const sectionTypeKey = Object.keys(SectionTypeEnum).find(
			(key) =>
				SectionTypeEnum[key as keyof typeof SectionTypeEnum] === type
		);
		return sectionTypeKey
			? SectionTypeEnum[sectionTypeKey as keyof typeof SectionTypeEnum]
			: type?.toString() || "N/A";
	};

	// Fonction pour récupérer le libellé de l'enum SectionCategory
	const getSectionCategoryLabel = (category: any): string => {
		const sectionCategoryKey = Object.keys(SectionCategoryEnum).find(
			(key) =>
				SectionCategoryEnum[key as keyof typeof SectionCategoryEnum] ===
				category
		);
		return sectionCategoryKey
			? SectionCategoryEnum[
					sectionCategoryKey as keyof typeof SectionCategoryEnum
			  ]
			: category?.toString() || "N/A";
	};

	return (
		<>
			<div className="flex flex-col gap-4 ">
				{sections.map((section) => (
					<div
						key={section.sectionId}
						className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-lg border"
					>
						<div className="space-y-1 flex-1">
							<h3 className="text-lg font-semibold">
								{section.name}
							</h3>
							<p className="text-sm text-muted-foreground">
								{getSectionTypeLabel(section.sectionType)}
							</p>
							<p className="text-sm text-muted-foreground">
								{getSectionCategoryLabel(
									section.sectionCategory
								)}
							</p>
						</div>

						<div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
							<Button
								variant="secondary"
								className="w-full md:w-auto"
								onClick={() =>
									router.push(
										`/section/edit/${section.sectionId}`
									)
								}
							>
								Modifier
							</Button>
							<CustomAlertDialog
								title="Supprimer la section"
								description="Voulez-vous vraiment supprimer la section ?"
								actionButtonAction={() => {
									deleteSection(section.sectionId);
								}}
							>
								<p className="bg-destructive text-destructive-foreground rounded-md px-2 py-1">
									Supprimer
								</p>
							</CustomAlertDialog>
						</div>
					</div>
				))}
			</div>
		</>
	);
};

export default SectionTable;
