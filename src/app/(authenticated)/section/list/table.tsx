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
import Link from "next/link";
import { createUrlWithParams } from "@/utils/url";

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
      return SectionCategoryEnum[category as keyof typeof SectionCategoryEnum];
    }

    // Fallback
    return category?.toString() || "N/A";
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
                <Badge variant="secondary" className="ml-2">
                  {section.ues?.length || 0} UEs
                </Badge>
              </div>

              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <GraduationCap className="h-4 w-4" />
                  <span className="text-sm">
                    {getSectionTypeLabel(section.sectionType)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <BookOpen className="h-4 w-4" />
                  <span className="text-sm">
                    {getSectionCategoryLabel(section.sectionCategory)}
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
              <Link
                href={createUrlWithParams("/ue", {
                  section_id: section.id.toString(),
                })}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
                >
                  <BookOpen className="h-4 w-4" />
                  Voir UEs
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
                onClick={() => router.push(`/section/edit/${section.id}`)}
              >
                <Pencil className="h-4 w-4" />
                Modifier
              </Button>
              <CustomAlertDialog
                title="Supprimer la section"
                description="Êtes-vous sûr de vouloir supprimer cette section ? Cette action est irréversible."
                actionButtonAction={() => deleteSection(section.id.toString())}
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
