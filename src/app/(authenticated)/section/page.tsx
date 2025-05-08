import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SectionType } from "@/model/enum/section-type.enum";
import Link from "next/link";

const sections = [
  { id: "1", nom: "Bachelier en Informatique", typeCursus: "Informatique" },
  { id: "2", nom: "Bachelier en Comptabilité", typeCursus: "Comptabilité" },
];

const categoriesEtudes = {
  economique: "Économique",
  paramedicale: "Paramédicale",
  pedagogique: "Pédagogique",
  sociale: "Sociale",
  technique: "Technique",
  agronomique: "Agronomique",
  artistique: "Artistique",
};

const SectionPage = () => {
  return (
    <>
      <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
        <CardTitle className="text-xl md:text-2xl">
          Liste des Sections
        </CardTitle>
        <div className="w-full md:w-auto flex justify-end">
          <Link className="w-full" href="/section/create">
            <Button className="w-full">Ajouter une section</Button>
          </Link>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Form Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col flex-1 gap-2">
            <Label>Nom de la section</Label>
            <Input placeholder="ex: Bachelier en Informatique" />
          </div>

          <div className="flex flex-col flex-1 gap-2">
            <Label>Catégorie</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(categoriesEtudes).map((value) => (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col flex-1 gap-2">
            <Label>Type de cursus</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un type de cursus" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(SectionType).map((value) => (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filter Button */}
        <div className="flex w-full ">
          <Button className="w-full">Filtrer</Button>
        </div>

        {/* List of Sections */}
        <div className="flex flex-col gap-4">
          {sections.map((section) => (
            <div
              key={section.id}
              className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-lg border"
            >
              <div className="space-y-1 flex-1">
                <h3 className="text-lg font-semibold">{section.nom}</h3>
                <p className="text-sm text-muted-foreground">
                  {section.typeCursus}
                </p>
              </div>

              <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                <Link
                  href={`/ue?sectionId=${section.id}`}
                  className="w-full md:w-auto"
                >
                  <Button className="w-full md:w-auto" variant="outline">
                    Détails
                  </Button>
                </Link>
                <Button variant="secondary" className="w-full md:w-auto">
                  Modifier
                </Button>
                <Button variant="destructive" className="w-full md:w-auto">
                  Supprimer
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </>
  );
};

export default SectionPage;
