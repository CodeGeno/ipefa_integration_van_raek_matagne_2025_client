import { get } from "@/app/fetch";
import { Section } from "@/model/entity/ue/section.entity";
import SectionDetails from "./section-details";

export default async function SectionDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  try {
    const response = await get<Section>(`/section/${params.id}`);
    if (!response.success || !response.data) {
      return (
        <div className="container mx-auto p-4">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h1 className="text-2xl font-semibold mb-4">Section non trouvée</h1>
            <p>La section demandée n&apos;a pas été trouvée.</p>
          </div>
        </div>
      );
    }

    return <SectionDetails section={response.data} />;
  } catch (error) {
    console.error("Error fetching section:", error);
    return (
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-semibold mb-4">Erreur</h1>
          <p>Une erreur est survenue lors du chargement de la section.</p>
        </div>
      </div>
    );
  }
}
