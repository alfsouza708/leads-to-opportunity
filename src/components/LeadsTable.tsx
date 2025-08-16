import { useMemo, useState } from "react";
import type { Lead, SortDirection, SortField } from "../types/leads";
import { FilterDropdown } from "./FilterDropdown";
import { LeadDetailsPanel } from "./LeadDetailsPanel";
import { ScoreBadge } from "./ScoreBadge";
import { SearchBar } from "./SearchBar";
import { StatusBadge } from "./StatusBadge";
import { TableHeader } from "./TableHeader";

interface LeadsTableProps {
	leads: Lead[];
}

export const LeadsTable: React.FC<LeadsTableProps> = ({ leads }) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [sortField, setSortField] = useState<SortField | null>("score");
	const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
	const [statusFilters, setStatusFilters] = useState<string[]>([]);
	const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
	const [isPanelOpen, setIsPanelOpen] = useState(false);

	const uniqueStatuses = useMemo(() => {
		return Array.from(new Set(leads.map((lead) => lead.status)));
	}, [leads]);

	const filteredAndSortedLeads = useMemo(() => {
		const filtered = leads.filter((lead) => {
			const matchesSearch =
				!searchTerm ||
				lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				lead.company.toLowerCase().includes(searchTerm.toLowerCase());

			const matchesStatus = statusFilters.length === 0 || statusFilters.includes(lead.status);

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
	}, [leads, searchTerm, sortField, sortDirection, statusFilters]);

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
		setSelectedLead(null);
	};

	return (
		<>
			<div className="bg-white rounded-2xl shadow-xl border border-gray-100">
				{/* Header with Search and Filters */}
				<div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
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
								<TableHeader
									field="id"
									label="ID"
									sortField={sortField}
									sortDirection={sortDirection}
									className="w-20"
								/>
								<TableHeader
									field="name"
									label="Name"
									sortField={sortField}
									sortDirection={sortDirection}
								/>
								<TableHeader
									field="company"
									label="Company"
									sortField={sortField}
									sortDirection={sortDirection}
								/>
								<TableHeader
									field="email"
									label="Email"
									sortField={sortField}
									sortDirection={sortDirection}
								/>
								<TableHeader
									field="source"
									label="Source"
									sortField={sortField}
									sortDirection={sortDirection}
								/>
								<TableHeader
									field="score"
									label="Score"
									sortField={sortField}
									sortDirection={sortDirection}
									onSort={handleSort}
									className="w-24"
								/>
								<TableHeader
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
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm text-gray-600">{lead.email}</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
											{lead.source}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<ScoreBadge score={lead.score} />
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<StatusBadge status={lead.status} />
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
			/>
		</>
	);
};
