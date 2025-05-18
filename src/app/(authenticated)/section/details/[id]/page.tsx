"use client";
import { get } from "@/app/fetch";
import { Section } from "@/model/entity/ue/section.entity";
import SectionDetailsContent from "./content";
import { useState, useEffect } from "react";
import { Suspense } from "react";
import { useParams } from "next/navigation";

export default function SectionDetailsPage() {
  const params = useParams();
  const sectionId = params.id as string;
  const [section, setSection] = useState<Section | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSection = async () => {
      try {
        const response = await get<Section>(`/section/${sectionId}`);
        if (response.success && response.data) {
          setSection(response.data);
        } else {
          setError("Section non trouvée ou erreur de chargement");
        }
      } catch (error) {
        console.error("Erreur lors du chargement de la section:", error);
        setError("Une erreur est survenue lors du chargement de la section");
      } finally {
        setLoading(false);
      }
    };

    fetchSection();
  }, [sectionId]);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-semibold mb-4">Chargement...</h1>
        </div>
      </div>
    );
  }

  if (error || !section) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-semibold mb-4">Section non trouvée</h1>
          <p>{error || "La section demandée n'a pas été trouvée."}</p>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <SectionDetailsContent section={section} />
    </Suspense>
  );
}
