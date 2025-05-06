"use client";

import {Button, CardContent, CardHeader, CardTitle, Input, Label} from "@/components/ui";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useState, useEffect} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";

interface Section {
    sectionId: number;
    name: string;
}

// Define schema with Zod
const ueSchema = z.object({
    name: z.string()
        .min(3, "Le libellé de l'UE doit contenir au moins 3 caractères")
        .max(255, "Le libellé ne peut pas dépasser 255 caractères"),

    description: z.string()
        .optional()
        .transform(val => val === "" ? undefined : val),

    sectionId: z.string()
        .min(1, "Veuillez sélectionner une section")
        .refine(val => !isNaN(parseInt(val)), {
            message: "L'identifiant de section doit être un nombre"
        }),

    isActive: z.boolean()
        .default(true),

    cycle: z.number()
        .int("Le cycle doit être un nombre entier")
        .min(1, "Le cycle doit être au minimum 1")
        .max(3, "Le cycle ne peut pas dépasser 3"),

    periods: z.number()
        .int("Le nombre de périodes doit être un nombre entier")
        .min(1, "Le nombre de périodes doit être positif")
        .max(500, "Le nombre de périodes ne peut pas dépasser 500")
});

// Infer the TypeScript type from the schema
type UEFormData = z.infer<typeof ueSchema>;

const UECreatePage = () => {
    const [sections, setSections] = useState<Section[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Use zodResolver to connect zod schema to react-hook-form
    const {
        register,
        handleSubmit,
        setValue,
        formState: {errors}
    } = useForm<UEFormData>({
        resolver: zodResolver(ueSchema),
        defaultValues: {
            name: "",
            description: "",
            sectionId: "",
            isActive: true,
            cycle: 1,
            periods: 0
        }
    });

    useEffect(() => {
        const fetchSections = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/section/list", {
                    cache: "no-store"
                });

                if (!response.ok) {
                    throw new Error(`Error fetching sections: ${response.status}`);
                }

                const data = await response.json();
                setSections(data.data || []);
            } catch (error) {
                console.error("Error loading sections:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSections();
    }, []);

    const onSubmit = async (data: UEFormData) => {
        try {
            const response = await fetch("http://localhost:8000/api/ue/create/", {
                method: "POST",
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
                throw new Error(`Error creating UE: ${response.status}`);
            }

            // Handle successful creation
            window.location.href = "/ue";
        } catch (error) {
            console.error("Error creating UE:", error);
        }
    };

    const handleSectionChange = (value: string) => {
        setValue("sectionId", value);
    };

    return (
        <>
            <CardHeader>
                <CardTitle>Créer une nouvelle UE</CardTitle>
            </CardHeader>
            <CardContent>
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    {/* Libellé */}
                    <div>
                        <Label htmlFor="name">Libellé de l'UE</Label>
                        <Input
                            id="name"
                            placeholder="Ex: Projet SGBD"
                            {...register("name")}
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
                        />
                        {errors.cycle && <p className="text-red-500 text-sm">{errors.cycle.message}</p>}
                    </div>

                    {/* Section */}
                    <div>
                        <Label htmlFor="section">Section</Label>
                        <Select onValueChange={handleSectionChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionner une section"/>
                            </SelectTrigger>
                            <SelectContent>
                                {isLoading ? (
                                    <SelectItem value="loading" disabled>Chargement des sections...</SelectItem>
                                ) : sections.length > 0 ? (
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

                    <div className="flex justify-end">
                        <Button type="submit">Ajouter l'UE</Button>
                    </div>
                </form>
            </CardContent>
        </>
    );
};

export default UECreatePage;