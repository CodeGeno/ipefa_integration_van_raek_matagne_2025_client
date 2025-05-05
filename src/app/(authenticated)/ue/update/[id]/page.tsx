// src/app/(authenticated)/ue/edit/[id]/page.tsx
"use client";

import {useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import {Button, CardContent, CardHeader, CardTitle, Input, Label} from "@/components/ui";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import { Checkbox } from "@/components/ui/checkbox";

interface Section {
    sectionId: number;
    name: string;
}

// Define schema with Zod
const ueUpdateSchema = z.object({
    name: z.string().min(1, "Le libellé de l'UE est requis"),
    description: z.string().optional(),
    sectionId: z.string().min(1, "Veuillez sélectionner une section"),
    isActive: z.boolean(),
    cycle: z.number().int("Le cycle doit être un nombre entier").min(1, "Le cycle doit être positif"),
    periods: z.number().int("Le nombre de périodes doit être un nombre entier").min(1, "Le nombre de périodes doit être positif")
});

type UEFormData = z.infer<typeof ueUpdateSchema>;

const UEEditPage = () => {
    const params = useParams();
    const router = useRouter();
    const ueId = params.id;

    const [sections, setSections] = useState<Section[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        trigger,
        formState: {errors, isSubmitting}
    } = useForm<UEFormData>({
        resolver: zodResolver(ueUpdateSchema),
        defaultValues: {
            name: "",
            description: "",
            sectionId: "",
            isActive: true,
            cycle: 1,
            periods: 0
        },
        mode: "onBlur"
    });

    // Fetch UE data and sections
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const [ueResponse, sectionsResponse] = await Promise.all([
                    fetch(`http://localhost:8000/api/ue/${ueId}/`, {cache: "no-store"}),
                    fetch("http://localhost:8000/api/section/list/", {cache: "no-store"})
                ]);

                if (!ueResponse.ok) {
                    throw new Error(`Erreur lors de la récupération de l'UE: ${ueResponse.status}`);
                }

                if (!sectionsResponse.ok) {
                    throw new Error(`Erreur lors de la récupération des sections: ${sectionsResponse.status}`);
                }

                const ueData = await ueResponse.json();
                const sectionsData = await sectionsResponse.json();

                setSections(sectionsData.data || []);

                // Populate form with UE data
                const ue = ueData.data;
                if (ue) {
                    reset({
                        name: ue.name,
                        description: ue.description || "",
                        sectionId: ue.section.toString(),
                        isActive: ue.isActive,
                        cycle: ue.cycle,
                        periods: ue.periods
                    });
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Une erreur est survenue");
                console.error("Error fetching data:", err);
            } finally {
                setIsLoading(false);
            }
        };

        if (ueId) {
            fetchData();
        }
    }, [ueId, reset]);

    const onSubmit = async (data: UEFormData) => {
        try {
            const response = await fetch(`http://localhost:8000/api/ue/update/${ueId}/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: data.name,
                    description: data.description,
                    section: parseInt(data.sectionId),
                    isActive: data.isActive,
                    cycle: data.cycle,
                    periods: data.periods
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Erreur lors de la mise à jour de l'UE: ${response.status}`);
            }

            // Redirect after successful update
            router.push("/ue");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Une erreur est survenue lors de la mise à jour");
            console.error("Error updating UE:", err);
        }
    };

    const handleSectionChange = (value: string) => {
        setValue("sectionId", value);
        trigger("sectionId");
    };

    const handleFieldBlur = (fieldName: keyof UEFormData) => {
        return () => {
            trigger(fieldName);
        };
    };

    if (isLoading) {
        return (
            <>
                <CardHeader>
                    <CardTitle>Modification de l UE</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-center items-center h-40">
                        <p>Chargement des données...</p>
                    </div>
                </CardContent>
            </>
        );
    }

    if (error) {
        return (
            <>
                <CardHeader>
                    <CardTitle>Erreur</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center space-y-4">
                        <p className="text-red-500">{error}</p>
                        <Button onClick={() => router.push("/ue")}>Retour à la liste des UEs</Button>
                    </div>
                </CardContent>
            </>
        );
    }

    return (
        <>
            <CardHeader>
                <CardTitle>Modifier l UE</CardTitle>
            </CardHeader>
            <CardContent>
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    {/* Libellé */}
                    <div>
                        <Label htmlFor="name">Libellé de l UE</Label>
                        <Input
                            id="name"
                            placeholder="Ex: Projet SGBD"
                            {...register("name")}
                            onBlur={handleFieldBlur("name")}
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                    </div>

                    {/* Description */}
                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            placeholder="Description de l'UE"
                            {...register("description")}
                            onBlur={handleFieldBlur("description")}
                        />
                    </div>

                    {/* Nombre de périodes */}
                    <div>
                        <Label htmlFor="periods">Nombre de périodes</Label>
                        <Input
                            id="periods"
                            type="number"
                            placeholder="Ex: 80"
                            {...register("periods", {valueAsNumber: true})}
                            onBlur={handleFieldBlur("periods")}
                        />
                        {errors.periods && <p className="text-red-500 text-sm">{errors.periods.message}</p>}
                    </div>

                    {/* Cycle */}
                    <div>
                        <Label htmlFor="cycle">Cycle</Label>
                        <Input
                            id="cycle"
                            type="number"
                            placeholder="Ex: 1"
                            {...register("cycle", {valueAsNumber: true})}
                            onBlur={handleFieldBlur("cycle")}
                        />
                        {errors.cycle && <p className="text-red-500 text-sm">{errors.cycle.message}</p>}
                    </div>

                    {/* Section */}
                    <div>
                        <Label htmlFor="section">Section</Label>
                        <Select onValueChange={handleSectionChange} defaultValue={register("sectionId").value}>
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionner une section"/>
                            </SelectTrigger>
                            <SelectContent>
                                {sections.length > 0 ? (
                                    sections.map((section) => (
                                        <SelectItem key={section.sectionId} value={section.sectionId.toString()}>
                                            {section.name}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <SelectItem value="none" disabled>Aucune section disponible</SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                        {errors.sectionId && <p className="text-red-500 text-sm">{errors.sectionId.message}</p>}
                    </div>

                    {/* Status */}
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="isActive"
                            {...register("isActive")}
                            onCheckedChange={(checked) => {
                                setValue("isActive", checked === true);
                            }}
                        />
                        <Label htmlFor="isActive" className="cursor-pointer">UE active</Label>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push("/ue")}
                            disabled={isSubmitting}
                        >
                            Annuler
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </>
    );
};

export default UEEditPage;