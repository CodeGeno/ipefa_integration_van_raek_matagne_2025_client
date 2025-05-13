"use client";

import { Section } from "@/model/entity/ue/section.entity";

interface SectionDetailsProps {
  section: Section;
}

export default function SectionDetails({ section }: SectionDetailsProps) {
  if (!section) return null;

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{section.name}</h1>
        <p className="text-gray-600">{section.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Informations</h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Type:</span> {section.sectionType}
            </p>
            <p>
              <span className="font-medium">Catégorie:</span>{" "}
              {section.sectionCategory}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Statistiques</h2>
          <p>Nombre d&apos;UE: {section.ues?.length || 0}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">
          Unités d&apos;enseignement
        </h2>
        {section.ues && section.ues.length > 0 ? (
          <div className="space-y-4">
            {section.ues.map((ue) => (
              <div key={ue.id} className="border-b pb-4 last:border-b-0">
                <h3 className="font-medium">{ue.name}</h3>
                <p className="text-sm text-gray-600">
                  {ue.description || "Aucune description"}
                </p>
                <div className="mt-2">
                  <a
                    href={`/ue/${ue.id}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Voir détails
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">
            Aucune unité d&apos;enseignement dans cette section
          </p>
        )}
      </div>
    </div>
  );
}
