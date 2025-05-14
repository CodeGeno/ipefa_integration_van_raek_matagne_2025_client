import { CardContent } from "@/components/ui/card";

import { useEffect } from "react";

import { get } from "@/app/fetch";
import { Section } from "@/model/entity/ue/section.entity";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const DisplaySectionRegistration = () => {
	const [sections, setSections] = useState<Section[]>([]);
	const getSections = async () => {
		const response = await get<Section[]>(`/section/list/`);
		if (response.success && response.data) {
			console.log(response.data);
			setSections(response.data);
		}
	};

	useEffect(() => {
		getSections();
	}, []);

	return (
		<div className="mt-6">
			<h2 className="text-xl font-semibold mb-4">
				Inscription à une section
			</h2>
			<Card>
				<CardContent className="p-4">
					{sections.length > 0 ? (
						<div className="space-y-4">
							{sections.map((section, index) => (
								<div
									key={section.id || `section-${index}`}
									className="flex justify-between items-center p-3 border rounded hover:bg-slate-50"
								>
									<div>
										<h3 className="font-medium">
											{section.name}
										</h3>
										<p className="text-sm text-muted-foreground">
											{section.description}
										</p>
									</div>
									<Button
										variant="outline"
										size="sm"
									>
										Inscrire
									</Button>
								</div>
							))}
						</div>
					) : (
						<p className="text-center py-6 text-muted-foreground">
							Aucune section disponible
						</p>
					)}
				</CardContent>
			</Card>
		</div>
	);
};

export default DisplaySectionRegistration;
