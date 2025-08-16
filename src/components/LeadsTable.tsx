import { useEffect, useMemo, useState } from "react";
import type { Lead, SortDirection, SortField } from "../types/leads";
import { FilterDropdown } from "./FilterDropdown";
import { LeadDetailsPanel } from "./LeadDetailsPanel";
import { ScoreBadge } from "./ScoreBadge";
import { SearchBar } from "./SearchBar";
import { StatusBadge } from "./StatusBadge";
import { TableHeader } from "./TableHeader";

interface LeadsTableProps {
	leads: Lead[];
	onConvertLead: (lead: Lead) => void;
	isLoading: boolean;
}

export const LeadsTable: React.FC<LeadsTableProps> = ({ leads, onConvertLead, isLoading }) => {
	const [leadsData, setLeadsData] = useState(leads);
	const [editingCell, setEditingCell] = useState<{
		leadId: number;
		field: "email" | "status";
	} | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [sortField, setSortField] = useState<SortField | null>("score");
	const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
	const [statusFilters, setStatusFilters] = useState<string[]>([]);
	const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
	const [isPanelOpen, setIsPanelOpen] = useState(false);

	useEffect(() => {
		setLeadsData(leads);
	}, [leads]);

	const uniqueStatuses = useMemo(() => {
		return Array.from(new Set(leadsData.map((lead) => lead.status)));
	}, [leadsData]);

	const validateEmail = (email: string) => {
		return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
	};

	const handleUpdateLead = (
		leadId: number,
		field: "email" | "status",
		value: string,
	) => {
		if (field === "email" && !validateEmail(value)) {
			setError("Invalid email format. The value was not saved.");
			setEditingCell(null);
			return;
		}
		setError(null);
		setLeadsData(
			leadsData.map((lead) =>
				lead.id === leadId ? { ...lead, [field]: value } : lead,
			),
		);
		setEditingCell(null);
	};

	const handleEditCell = (leadId: number, field: "email" | "status") => {
		setError(null);
		setEditingCell({ leadId, field });
	};

	const filteredAndSortedLeads = useMemo(() => {
		const filtered = leadsData.filter((lead) => {
			const matchesSearch =
				!searchTerm ||
				lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				lead.company.toLowerCase().includes(searchTerm.toLowerCase());

			const matchesStatus =
				statusFilters.length === 0 || statusFilters.includes(lead.status);

			return matchesSearch && matchesStatus;
		});

		if (sortField) {
			filtered.sort((a, b) => {
				let aValue = a[sortField];
				let bValue = b[sortField];

				if (typeof aValue === "string") {
					aValue = aValue.toLowerCase();
					bValue = (bValue as string).toLowerCase();
				}

				if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
				if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
				return 0;
			});
		}

		return filtered;
	}, [leadsData, searchTerm, sortField, sortDirection, statusFilters]);

	const handleSort = (field: SortField) => {
		if (sortField === field) {
			if (sortDirection === "desc") {
				setSortDirection("asc");
			} else {
				setSortField(null);
				setSortDirection("desc");
			}
		} else {
			setSortField(field);
			setSortDirection("desc");
		}
	};

	const handleRowClick = (lead: Lead) => {
		setSelectedLead(lead);
		setIsPanelOpen(true);
	};

	const handleClosePanel = () => {
		setIsPanelOpen(false);
		setTimeout(() => {
			setSelectedLead(null);
		}, 300);
	};

	return (
		<>
			<div className="bg-white rounded-2xl shadow-xl border border-gray-100">
				{/* Header with Search and Filters */}
				<div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
					{error && (
						<div
							className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
							role="alert"
						>
							<span className="block sm:inline">{error}</span>
							<span
								className="absolute top-0 bottom-0 right-0 px-4 py-3"
								onClick={() => setError(null)}
							>
								<svg
									className="fill-current h-6 w-6 text-red-500"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
								>
									<title>Close</title>
									<path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
								</svg>
							</span>
						</div>
					)}
					<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
						<div>
							<h2 className="text-2xl font-bold text-gray-900">
								Leads Management
							</h2>
							<p className="text-sm text-gray-600 mt-1">
								{filteredAndSortedLeads.length} of {leads.length} leads
							</p>
						</div>

						<div className="flex flex-col sm:flex-row gap-4 lg:w-2/3">
							<div className="flex-1">
								<SearchBar
									value={searchTerm}
									onChange={setSearchTerm}
									placeholder="Search by name or company"
								/>
							</div>

							<div className="flex flex-col sm:flex-row sm:flex-shrink-0 gap-3">
								<FilterDropdown
									label="Status"
									options={uniqueStatuses}
									selectedValues={statusFilters}
									onChange={setStatusFilters}
								/>
							</div>
						</div>
					</div>
				</div>

				{/* Table */}
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<TableHeader<Lead>
									field="id"
									label="ID"
									sortField={sortField}
									sortDirection={sortDirection}
									className="w-20"
								/>
								<TableHeader<Lead>
									field="name"
									label="Name"
									sortField={sortField}
									sortDirection={sortDirection}
								/>
								<TableHeader<Lead>
									field="company"
									label="Company"
									sortField={sortField}
									sortDirection={sortDirection}
								/>
								<TableHeader<Lead>
									field="email"
									label="Email"
									sortField={sortField}
									sortDirection={sortDirection}
								/>
								<TableHeader<Lead>
									field="source"
									label="Source"
									sortField={sortField}
									sortDirection={sortDirection}
								/>
								<TableHeader<Lead>
									field="score"
									label="Score"
									sortField={sortField}
									sortDirection={sortDirection}
									onSort={handleSort}
									className="w-24"
								/>
								<TableHeader<Lead>
									field="status"
									label="Status"
									sortField={sortField}
									sortDirection={sortDirection}
									className="w-32"
								/>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-100">
							{filteredAndSortedLeads.map((lead, index) => (
								<tr
									key={lead.id}
									onClick={() => handleRowClick(lead)}
									className={`hover:bg-blue-50 cursor-pointer transition-colors ${
										index % 2 === 0 ? "bg-white" : "bg-gray-25"
									}`}
								>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
										{lead.id}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm font-medium text-gray-900">
											{lead.name}
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm text-gray-900">{lead.company}</div>
									</td>
									<td
										className="px-6 py-4 whitespace-nowrap"
										onClick={(e) => {
											e.stopPropagation();
											if (
												editingCell?.leadId !== lead.id ||
												editingCell?.field !== "email"
											) {
												handleEditCell(lead.id, "email");
											}
										}}
									>
										{editingCell?.leadId === lead.id &&
										editingCell?.field === "email" ? (
											<input
												type="text"
												defaultValue={lead.email}
												onBlur={(e) =>
													handleUpdateLead(lead.id, "email", e.target.value)
												}
												onKeyDown={(e) => {
													if (e.key === "Enter")
														handleUpdateLead(
															lead.id,
															"email",
															e.currentTarget.value,
														);
													if (e.key === "Escape") setEditingCell(null);
												}}
											/>
										) : (
											<div className="text-sm text-gray-600">{lead.email}</div>
										)}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
											{lead.source}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<ScoreBadge score={lead.score} />
									</td>
									<td
										className="px-6 py-4 whitespace-nowrap"
										onClick={(e) => {
											e.stopPropagation();
											if (
												editingCell?.leadId !== lead.id ||
												editingCell?.field !== "status"
											) {
												handleEditCell(lead.id, "status");
											}
										}}
									>
										{editingCell?.leadId === lead.id &&
										editingCell?.field === "status" ? (
											<select
												defaultValue={lead.status}
												onBlur={(e) =>
													handleUpdateLead(lead.id, "status", e.target.value)
												}
												onChange={(e) =>
													handleUpdateLead(lead.id, "status", e.target.value)
												}
											>
												{uniqueStatuses.map((status) => (
													<option key={status} value={status}>
														{status}
													</option>
												))}
											</select>
										) : (
											<div>
												<StatusBadge status={lead.status} />
											</div>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>

					{filteredAndSortedLeads.length === 0 && (
						<div className="text-center py-12">
							<div className="text-gray-400 text-lg">No leads found</div>
							<p className="text-gray-500 text-sm mt-2">
								Try adjusting your search term or filters
							</p>
						</div>
					)}
				</div>
			</div>

			<LeadDetailsPanel
				lead={selectedLead}
				isOpen={isPanelOpen}
				onClose={handleClosePanel}
				onConvertLead={onConvertLead}
				isLoading={isLoading}
			/>
		</>
	);
};
