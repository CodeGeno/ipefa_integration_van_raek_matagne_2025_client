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
import { SectionCategoryEnum } from "@/model/enum/section-category.enum";

const SectionCreatePage = () => {
	return (
		<>
			<CardHeader>
				<CardTitle>Créer une nouvelle Section</CardTitle>
			</CardHeader>
			<CardContent>
				<form className="space-y-4">
					<div className="flex flex-col gap-2">
						<Label htmlFor="nomSection">Nom de la Section</Label>
						<Input
							id="nomSection"
							placeholder="Ex: Bachelier en Informatique"
						/>
					</div>
					<div className="flex flex-col gap-2">
						<Label htmlFor="typeCursus">Type de cursus</Label>
						<Select>
							<SelectTrigger>
								<SelectValue placeholder="Sélectionner durée de cursus" />
							</SelectTrigger>
							<SelectContent>
								{Object.values(SectionType).map((value) => (
									<SelectItem
										key={value}
										value={value}
									>
										{value}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="flex flex-col gap-2">
						<Label htmlFor="typeCursus">Catégorie</Label>
						<Select>
							<SelectTrigger>
								<SelectValue placeholder="Sélectionnez un type de cursus" />
							</SelectTrigger>
							<SelectContent>
								{Object.values(SectionCategoryEnum).map(
									(value) => (
										<SelectItem
											key={value}
											value={value}
										>
											{value}
										</SelectItem>
									)
								)}
							</SelectContent>
						</Select>
					</div>
					<div className="flex w-full">
						<Button
							className="w-full"
							type="submit"
						>
							Enregistrer la Section
						</Button>
					</div>
				</form>
			</CardContent>
		</>
	);
};

export default SectionCreatePage;
