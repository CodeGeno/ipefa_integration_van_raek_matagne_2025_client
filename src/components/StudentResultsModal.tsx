"use client";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { get, patch } from "@/app/fetch";
import { useState, useEffect, useContext } from "react";
import { AddResultModal } from "./AddResultModal";
import { CheckCircle2, XCircle } from "lucide-react";
import { UE } from "@/types";
import { AccountContext } from "@/app/context";

interface Result {
	id: number;
	result: number;
	period: number;
	success: boolean;
	isExempt: boolean;
	approved: boolean;
}

interface StudentResultsModalProps {
	isOpen: boolean;
	onClose: () => void;
	academicUEId: number;
	studentId: number;

	ue: UE;
}

export function StudentResultsModal({
	isOpen,
	onClose,
	academicUEId,
	studentId,
	ue,
}: StudentResultsModalProps) {
	const [results, setResults] = useState<Result[]>([]);
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [editingResult, setEditingResult] = useState<Result | null>(null);
	const { accountData } = useContext(AccountContext);
	const fetchResults = async () => {
		try {
			setIsLoading(true);
			setError(null);
			const response = await get<Result[]>(
				`/ue-management/results/${academicUEId}/${studentId}/`
			);

			if (response.success && response.data) {
				setResults(response.data);
			} else {
				alert(response.message);
				throw new Error("Erreur lors du chargement des résultats");
			}
		} catch (error) {
			console.error("Failed to fetch results:", error);
			setError("Erreur lors du chargement des résultats");
		} finally {
			setIsLoading(false);
		}
	};

	const handleApproveResult = async (
		resultId: number,
		currentApproved: boolean
	) => {
		try {
			setError(null);
			const response = await patch(
				`/ue-management/results/${resultId}/`,
				{
					approved: !currentApproved,
				}
			);
			if (response.success) {
				fetchResults();
			} else {
				throw new Error(
					"Erreur lors de la mise à jour du statut d'approbation"
				);
			}
		} catch (error) {
			console.error("Failed to update approval status:", error);
			setError("Erreur lors de la mise à jour du statut d'approbation");
		}
	};

	useEffect(() => {
		if (isOpen) {
			fetchResults();
		}
	}, [isOpen, academicUEId, studentId]);

	return (
		<Dialog
			open={isOpen}
			onOpenChange={onClose}
		>
			<DialogContent className="max-w-4xl">
				<DialogHeader>
					<DialogTitle>Résultats de l'étudiant</DialogTitle>
				</DialogHeader>

				{error && (
					<div className="mb-4 p-4 bg-red-50 text-red-600 rounded-md">
						{error}
					</div>
				)}

				<div className="mt-4">
					<div className="flex justify-between items-center mb-4">
						<h3 className="text-lg font-medium"></h3>
						{(accountData.role == "PROFESSOR" ||
							accountData.role == "ADMINISTRATOR") &&
							results.length == 0 && (
								<Button onClick={() => setIsAddModalOpen(true)}>
									Ajouter un résultat
								</Button>
							)}
					</div>

					{results.length === 0 ? (
						<p className="text-slate-600">Aucun résultat trouvé</p>
					) : (
						<div className="border rounded-md overflow-hidden">
							<table className="min-w-full">
								<thead className="bg-gray-50">
									<tr>
										<th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
											Résultat
										</th>
										<th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
											Périodes
										</th>
										<th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
											Statut
										</th>
										<th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
											Dispensé
										</th>
										<th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
											Approuvé
										</th>
										<th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
											Actions
										</th>
									</tr>
								</thead>
								<tbody>
									{results.map((result) => (
										<tr
											key={result.id}
											className="border-t"
										>
											<td className="px-4 py-2">
												{result.isExempt
													? "Dispensé"
													: result.result}
											</td>
											<td className="px-4 py-2">
												{result.period}
											</td>
											<td className="px-4 py-2">
												<span
													className={
														result.success
															? "text-green-600"
															: "text-red-600"
													}
												>
													{result.success
														? "Réussi"
														: "Échoué"}
												</span>
											</td>
											<td className="px-4 py-2">
												{result.isExempt
													? "Oui"
													: "Non"}
											</td>
											<td className="px-4 py-2">
												{result.approved ? (
													<CheckCircle2 className="h-5 w-5 text-green-500" />
												) : (
													<XCircle className="h-5 w-5 text-red-500" />
												)}
											</td>
											<td className="px-4 py-2">
												<div className="flex gap-2">
													{!result.approved && (
														<Button
															variant="outline"
															size="sm"
															onClick={() =>
																setEditingResult(
																	result
																)
															}
														>
															Modifier
														</Button>
													)}
													{accountData.role ==
														"EDUCATOR" ||
														(accountData.role ==
															"ADMINISTRATOR" && (
															<Button
																variant="default"
																size="sm"
																disabled={
																	result.approved
																}
																onClick={() =>
																	handleApproveResult(
																		result.id,
																		result.approved
																	)
																}
															>
																{!result.approved
																	? "Approuver"
																	: "Approuvé"}
															</Button>
														))}
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</div>

				<AddResultModal
					isOpen={isAddModalOpen || editingResult !== null}
					onClose={() => {
						setIsAddModalOpen(false);
						setEditingResult(null);
					}}
					academicUEId={academicUEId.toString()}
					studentId={studentId.toString()}
					maxPeriod={ue.periods}
					onSuccess={() => {
						fetchResults();
						setIsAddModalOpen(false);
						setEditingResult(null);
					}}
					editingResult={editingResult}
					ue={ue}
				/>
			</DialogContent>
		</Dialog>
	);
}
