import CustomAlertDialog from "@/app/custom-alert-dialog";
import { del } from "@/app/fetch";
import { Button } from "@/components/ui/button";
import { Section } from "@/model/entity/ue/section.entity";
import { SectionCategoryEnum } from "@/model/enum/section-category.enum";
import { SectionTypeEnum } from "@/model/enum/section-type.enum";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Trash2, BookOpen, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SectionTableProps {
	sections: Section[];
}

const SectionTable: React.FC<SectionTableProps> = ({
	sections,
}: {
	sections: Section[];
}) => {
	const router = useRouter();
	const deleteSection = async (sectionId: number) => {
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
		<div className="space-y-4">
			{sections.map((section) => (
				<div
					key={section.id}
					className="group relative bg-white rounded-lg border border-slate-200 p-6 hover:border-slate-300 transition-all duration-200"
				>
					<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
						<div className="space-y-3 flex-1">
							<div className="flex items-center gap-2">
								<h3 className="text-xl font-semibold text-slate-900">
									{section.name}
								</h3>
								<Badge
									variant="secondary"
									className="ml-2"
								>
									{section.ues?.length || 0} UEs
								</Badge>
							</div>

							<div className="flex flex-wrap gap-2">
								<div className="flex items-center gap-1.5 text-slate-600">
									<GraduationCap className="h-4 w-4" />
									<span className="text-sm">
										{getSectionTypeLabel(
											section.sectionType
										)}
									</span>
								</div>
								<div className="flex items-center gap-1.5 text-slate-600">
									<BookOpen className="h-4 w-4" />
									<span className="text-sm">
										{getSectionCategoryLabel(
											section.sectionCategory
										)}
									</span>
								</div>
							</div>

							{section.description && (
								<p className="text-sm text-slate-600 mt-2">
									{section.description}
								</p>
							)}
						</div>

						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								size="sm"
								className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
								onClick={() =>
									router.push(`/section/edit/${section.id}`)
								}
							>
								<Pencil className="h-4 w-4" />
								Modifier
							</Button>
							<CustomAlertDialog
								title="Supprimer la section"
								description="Êtes-vous sûr de vouloir supprimer cette section ? Cette action est irréversible."
								actionButtonAction={() =>
									deleteSection(section.id)
								}
							>
								<Button
									variant="ghost"
									size="sm"
									className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
								>
									<Trash2 className="h-4 w-4" />
									Supprimer
								</Button>
							</CustomAlertDialog>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

export default SectionTable;
