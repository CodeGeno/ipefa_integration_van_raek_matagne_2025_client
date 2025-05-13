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
		// Si le type est une valeur dans l'enum, on la retourne directement
		if (Object.values(SectionTypeEnum).includes(type)) {
			return type;
		}

		// Si le type est une clé de l'enum, on retourne la valeur correspondante
		if (type in SectionTypeEnum) {
			return SectionTypeEnum[type as keyof typeof SectionTypeEnum];
		}

		// Fallback
		return type?.toString() || "N/A";
	};

	// Fonction pour récupérer le libellé de l'enum SectionCategory
	const getSectionCategoryLabel = (category: any): string => {
		// Si la catégorie est une valeur dans l'enum, on la retourne directement
		if (Object.values(SectionCategoryEnum).includes(category)) {
			return category;
		}

		// Si la catégorie est une clé de l'enum, on retourne la valeur correspondante
		if (category in SectionCategoryEnum) {
			return SectionCategoryEnum[
				category as keyof typeof SectionCategoryEnum
			];
		}

		// Fallback
		return category?.toString() || "N/A";
	};

	return (
		<>
			<div className="flex flex-col gap-4 ">
				{sections.map((section) => (
					<div
						key={section.id}
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
										`/section/details/${section.id}`
									)
								}
							>
								Détails
							</Button>
							<Button
								variant="secondary"
								className="w-full md:w-auto"
								onClick={() =>
									router.push(`/section/edit/${section.id}`)
								}
							>
								Modifier
							</Button>
							<CustomAlertDialog
								title="Supprimer la section"
								description="Voulez-vous vraiment supprimer la section ?"
								actionButtonAction={() => {
									deleteSection(section.id.toString());
								}}
							>
								Supprimer
							</CustomAlertDialog>
						</div>
					</div>
				))}
			</div>
		</>
	);
};

export default SectionTable;
