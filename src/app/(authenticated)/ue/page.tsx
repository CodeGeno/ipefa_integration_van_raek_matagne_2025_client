import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const UEPageOverview = () => {
	return (
		<>
			{" "}
			<CardHeader>
				<CardTitle>Créer une nouvelle UE</CardTitle>
			</CardHeader>
			<CardContent>
				<form className="space-y-4">
					{/* Libellé */}
					<div>
						<Label htmlFor="libelle">Libellé de l'UE</Label>
						<Input
							id="libelle"
							placeholder="Ex: Projet SGBD"
						/>
					</div>

					{/* Nombre de périodes */}
					<div>
						<Label htmlFor="nbPeriodes">Nombre de périodes</Label>
						<Input
							id="nbPeriodes"
							type="number"
							placeholder="Ex: 80"
						/>
					</div>

					{/* Section */}
					<div>
						<Label htmlFor="section">Section</Label>
						<Input
							id="section"
							placeholder="Ex: Bachelier en Informatique"
						/>
					</div>

					<div className="flex justify-end">
						<Button type="submit">Enregistrer l'UE</Button>
					</div>
				</form>
			</CardContent>
		</>
	);
};

export default UEPageOverview;
