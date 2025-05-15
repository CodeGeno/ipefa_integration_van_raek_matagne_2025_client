"use client";

// src/app/(authenticated)/ue/page.tsx
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Section } from "@/model/entity/ue/section.entity";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	ChevronDown,
	CheckCircle2,
	XCircle,
	BookOpen,
	GraduationCap,
	Clock,
	Search,
} from "lucide-react";
import { UE } from "@/model/entity/ue/ue.entity";
import { DeleteUEDialog } from "@/components/ue/delete-ue-dialog";
import { ActivateUEButton } from "@/components/ue/activate-ue-button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import React, { useState, useEffect, useContext } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { createUrlWithParams } from "@/utils/url";
import { get } from "@/app/fetch";
import { AccountContext } from "@/app/context";

interface ApiSectionItem {
	id: number;
	sectionId: number;
	name: string;
	sectionType: string;
	sectionCategory: string;
	description: string;
}

async function getSections(): Promise<Section[]> {
	try {
		const response = await get<Section[]>("/section/list/");

		if (!response.success) {
			throw new Error(`Error fetching sections: ${response.status}`);
		}
		if (response.data && response.success) {
			return response.data;
		}
		return [];
	} catch {
		return [];
	}
}

async function getUEs(): Promise<UE[]> {
	try {
		const response = await get<UE[]>("/ue/list/");

		if (!response.success) {
			throw new Error(`Error fetching UEs: ${response.status}`);
		}

		return response.data || [];
	} catch {
		return [];
	}
}

export default function UEListPage() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const { accountData } = useContext(AccountContext);
	const [sections, setSections] = useState<Section[]>([]);
	const [ues, setUEs] = useState<UE[]>([]);
	const [searchInput, setSearchInput] = useState(
		searchParams.get("search") || ""
	);
	const [selectedSection, setSelectedSection] = useState(
		searchParams.get("section_id") || "all"
	);
	const [selectedCycle, setSelectedCycle] = useState(
		searchParams.get("cycle") || "all"
	);
	const [showActiveOnly, setShowActiveOnly] = useState<boolean>(
		searchParams.get("active_only") !== "false"
	);

	// Load data on component mount
	useEffect(() => {
		const loadData = async () => {
			const [sectionsData, uesData] = await Promise.all([
				getSections(),
				getUEs(),
			]);
			setSections(sectionsData);
			setUEs(uesData);
		};
		loadData();
	}, []);

	// Handle UE deletion
	const handleDelete = (ueId: string) => {
		setUEs((currentUEs) => currentUEs.filter((ue) => ue.id !== ueId));
	};

	// Handle UE activation
	const handleActivate = (ueId: string) => {
		setUEs((currentUEs) =>
			currentUEs.map((ue) =>
				ue.id === ueId ? { ...ue, isActive: true } : ue
			)
		);
	};

	// Handle filter application
	const applyFilters = () => {
		const filterParams = {
			search: searchInput,
			section_id: selectedSection === "all" ? undefined : selectedSection,
			cycle: selectedCycle === "all" ? undefined : selectedCycle,
			active_only: showActiveOnly ? "true" : "false",
		};
		router.push(createUrlWithParams("/ue", filterParams));
	};

	// Handle filter reset
	const resetFilters = () => {
		setSearchInput("");
		setSelectedSection("all");
		setSelectedCycle("all");
		setShowActiveOnly(true);
		router.push("/ue");
	};

	// Handle key down event for search
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") applyFilters();
	};

	// Filter UEs based on search input
	const filteredUEs = ues.filter((ue) => {
		// Filter by search term (case insensitive)
		if (
			searchInput &&
			!ue.name.toLowerCase().includes(searchInput.toLowerCase())
		) {
			return false;
		}

		// Filter by section
		if (
			selectedSection !== "all" &&
			ue.section.toString() !== selectedSection
		) {
			return false;
		}

		// Filter by cycle
		if (selectedCycle !== "all" && ue.cycle.toString() !== selectedCycle) {
			return false;
		}

		// Filter by active status
		if (showActiveOnly && !ue.isActive) {
			return false;
		}

		return true;
	});

	// Group UEs by section and then by cycle
	const uesBySection: Record<number, Record<number, UE[]>> = {};

	// Initialize sections first
	sections.forEach((section: Section) => {
		uesBySection[Number(section.id)] = {};
	});

	// Add UEs to their respective sections and cycles
	filteredUEs.forEach((ue: UE) => {
		// Skip if section doesn't exist
		if (!uesBySection[Number(ue.section)]) {
			return;
		}

		if (!uesBySection[Number(ue.section)][ue.cycle]) {
			uesBySection[Number(ue.section)][ue.cycle] = [];
		}

		uesBySection[Number(ue.section)][ue.cycle].push(ue);
	});

	// Get unique cycles from UEs for the filter dropdown
	const uniqueCycles = [...new Set(ues.map((ue) => ue.cycle))].sort(
		(a, b) => a - b
	);

	return (
		<div className="container mx-auto p-4 space-y-8">
			<div className="flex justify-between items-center mb-8">
				<div className="space-y-1">
					<h1 className="text-3xl font-bold tracking-tight">
						Liste des UEs
					</h1>
					<p className="text-muted-foreground">
						Gérez les unités d&apos;enseignement de votre
						établissement
					</p>
				</div>
				{accountData.role === "ADMINISTRATOR" && (
					<Link href="/ue/create">
						<Button className="bg-primary hover:bg-primary/90 transition-colors">
							<BookOpen className="w-4 h-4 mr-2" />
							Ajouter une UE
						</Button>
					</Link>
				)}
			</div>

			{/* Filters Card */}
			<Card className="shadow-sm">
				<CardContent className="p-6">
					<div className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div className="space-y-2">
								<Label className="text-sm font-medium">
									Recherche
								</Label>
								<div className="relative">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
									<Input
										placeholder="Rechercher une UE..."
										value={searchInput}
										onChange={(e) =>
											setSearchInput(e.target.value)
										}
										onKeyDown={handleKeyDown}
										className="pl-9"
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label className="text-sm font-medium">
									Section
								</Label>
								<Select
									value={selectedSection}
									onValueChange={setSelectedSection}
								>
									<SelectTrigger>
										<SelectValue placeholder="Sélectionnez une section" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">
											Toutes les sections
										</SelectItem>
										{sections.map((section) => (
											<SelectItem
												key={section.id}
												value={section.id.toString()}
											>
												{section.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label className="text-sm font-medium">
									Cycle
								</Label>
								<Select
									value={selectedCycle}
									onValueChange={setSelectedCycle}
								>
									<SelectTrigger>
										<SelectValue placeholder="Sélectionnez un cycle" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">
											Tous les cycles
										</SelectItem>
										{uniqueCycles.map((cycle) => (
											<SelectItem
												key={cycle}
												value={cycle.toString()}
											>
												Cycle {cycle}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-lg">
								<Switch
									id="active-filter"
									checked={showActiveOnly}
									onCheckedChange={setShowActiveOnly}
								/>
								<Label
									htmlFor="active-filter"
									className="text-sm font-medium"
								>
									UEs actives uniquement
								</Label>
							</div>

							<div className="flex gap-2">
								<Button
									variant="outline"
									onClick={resetFilters}
								>
									Réinitialiser
								</Button>
								<Button onClick={applyFilters}>Filtrer</Button>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			<div className="space-y-6">
				{sections.map((section: Section) => {
					// Skip sections with no UEs
					if (
						!uesBySection[Number(section.id)] ||
						Object.keys(uesBySection[Number(section.id)]).length ===
							0
					) {
						return null;
					}

					const cycles = Object.keys(uesBySection[Number(section.id)])
						.map(Number)
						.sort((a, b) => a - b);

					return (
						<Collapsible
							key={section.id}
							className="w-full transition-all duration-200"
						>
							<CollapsibleTrigger className="w-full focus:outline-none">
								<CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 cursor-pointer flex flex-row justify-between items-center rounded-lg transition-all duration-200 shadow-sm">
									<div className="flex items-center space-x-3">
										<GraduationCap className="h-5 w-5 text-primary" />
										<CardTitle className="text-xl font-semibold">
											{section.name}
										</CardTitle>
									</div>
									<ChevronDown className="h-5 w-5 transition-transform duration-200" />
								</CardHeader>
							</CollapsibleTrigger>
							<CollapsibleContent>
								<CardContent className="p-6">
									<div className="space-y-4">
										{cycles.map((cycle: number) => {
											const cycleUes =
												uesBySection[
													Number(section.id)
												][cycle] || [];

											return (
												<Collapsible
													key={cycle}
													className="w-full"
												>
													<CollapsibleTrigger className="w-full focus:outline-none">
														<CardHeader className="bg-white hover:bg-slate-50 cursor-pointer flex flex-row justify-between items-center rounded-lg transition-all duration-200 border border-slate-100">
															<div className="flex items-center space-x-3">
																<div className="bg-primary/10 p-2 rounded-full">
																	<Clock className="h-4 w-4 text-primary" />
																</div>
																<CardTitle className="text-lg font-medium">
																	Cycle{" "}
																	{cycle} (
																	{
																		cycleUes.length
																	}{" "}
																	UEs)
																</CardTitle>
															</div>
															<ChevronDown className="h-4 w-4 transition-transform duration-200" />
														</CardHeader>
													</CollapsibleTrigger>
													<CollapsibleContent>
														<CardContent className="p-4">
															<div className="overflow-x-auto">
																<table className="w-full">
																	<thead>
																		<tr className="border-b">
																			<th className="text-left p-3 font-medium text-slate-500">
																				ID
																			</th>
																			<th className="text-left p-3 font-medium text-slate-500">
																				Nom
																			</th>
																			<th className="text-left p-3 font-medium text-slate-500">
																				Description
																			</th>
																			<th className="text-center p-3 font-medium text-slate-500">
																				Périodes
																			</th>
																			<th className="text-center p-3 font-medium text-slate-500">
																				Statut
																			</th>
																			<th className="text-right p-3 font-medium text-slate-500">
																				Actions
																			</th>
																		</tr>
																	</thead>
																	<tbody>
																		{cycleUes.map(
																			(
																				ue: UE
																			) => (
																				<tr
																					key={
																						ue.id
																					}
																					className={`border-b hover:bg-slate-50 transition-colors duration-150 ${
																						!ue.isActive
																							? "bg-slate-50"
																							: ""
																					}`}
																				>
																					<td className="p-3 text-sm">
																						{
																							ue.id
																						}
																					</td>
																					<td className="p-3 font-medium">
																						{
																							ue.name
																						}
																					</td>
																					<td className="p-3 max-w-xs truncate text-sm text-slate-600">
																						{
																							ue.description
																						}
																					</td>
																					<td className="p-3 text-center">
																						{
																							ue.periods
																						}
																					</td>
																					<td className="p-3 text-center">
																						{ue.isActive ? (
																							<div className="flex items-center justify-center text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm">
																								<CheckCircle2 className="h-4 w-4 mr-1" />
																								<span>
																									Active
																								</span>
																							</div>
																						) : (
																							<div className="flex items-center justify-center text-red-600 bg-red-50 px-3 py-1 rounded-full text-sm">
																								<XCircle className="h-4 w-4 mr-1" />
																								<span>
																									Inactive
																								</span>
																							</div>
																						)}
																					</td>
																					<td className="p-3">
																						<div className="flex justify-end space-x-2">
																							<Link
																								href={`/ue/${ue.id}`}
																							>
																								<Button
																									variant="outline"
																									size="sm"
																									className="hover:bg-slate-100"
																								>
																									Voir
																								</Button>
																							</Link>
																							{accountData.role ===
																								"ADMINISTRATOR" && (
																								<Link
																									href={`/ue/update/${ue.id}`}
																								>
																									<Button
																										variant="outline"
																										size="sm"
																										className="hover:bg-slate-100"
																									>
																										Modifier
																									</Button>
																								</Link>
																							)}

																							{accountData.role ===
																								"ADMINISTRATOR" &&
																								(ue.isActive ? (
																									<DeleteUEDialog
																										ueId={
																											ue.id
																										}
																										ueName={
																											ue.name
																										}
																										onDelete={
																											handleDelete
																										}
																									/>
																								) : (
																									<ActivateUEButton
																										ueId={
																											ue.id
																										}
																										ueName={
																											ue.name
																										}
																										onActivate={
																											handleActivate
																										}
																									/>
																								))}
																						</div>
																					</td>
																				</tr>
																			)
																		)}
																	</tbody>
																</table>
															</div>
														</CardContent>
													</CollapsibleContent>
												</Collapsible>
											);
										})}
									</div>
								</CardContent>
							</CollapsibleContent>
						</Collapsible>
					);
				})}
			</div>
		</div>
	);
}
