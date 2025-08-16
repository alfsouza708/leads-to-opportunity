import type React from "react";
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

interface EditingState {
	leadId: number;
	field: 'email' | 'status';
	value: string;
	originalValue: string;
}
export const LeadsTable: React.FC<LeadsTableProps> = ({ leads }) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [sortField, setSortField] = useState<SortField | null>("score");
	const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
	const [sourceFilters, setSourceFilters] = useState<string[]>([]);
	const [statusFilters, setStatusFilters] = useState<string[]>([]);
	const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
	const [isPanelOpen, setIsPanelOpen] = useState(false);
	const [editing, setEditing] = useState<EditingState | null>(null);
	const [leadsData, setLeadsData] = useState<Lead[]>(leads);

	const uniqueSources = useMemo(() => {
		return Array.from(new Set(leadsData.map((lead) => lead.source)));
	}, [leadsData]);

	const uniqueStatuses = useMemo(() => {
		return Array.from(new Set(leadsData.map((lead) => lead.status)));
	}, [leadsData]);

	const filteredAndSortedLeads = useMemo(() => {
		const filtered = leadsData.filter((lead) => {
			const matchesSearch =
				!searchTerm ||
				lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
				lead.email.toLowerCase().includes(searchTerm.toLowerCase());

			const matchesSource =
				sourceFilters.length === 0 || sourceFilters.includes(lead.source);
			const matchesStatus =
				statusFilters.length === 0 || statusFilters.includes(lead.status);

			return matchesSearch && matchesSource && matchesStatus;
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
	}, [
		leadsData,
		searchTerm,
		sortField,
		sortDirection,
		sourceFilters,
		statusFilters,
	]);

	const handleSort = (field: SortField) => {
		if (sortField === field) {
			setSortDirection(sortDirection === "asc" ? "desc" : "asc");
		} else {
			setSortField(field);
			setSortDirection("asc");
		}
	};

	const handleRowClick = (lead: Lead) => {
		// Don't open panel if we're editing
		if (editing) return;
		setSelectedLead(lead);
		setIsPanelOpen(true);
	};

	const handleClosePanel = () => {
		setIsPanelOpen(false);
		setSelectedLead(null);
	};

	const startEditing = (leadId: number, field: 'email' | 'status', currentValue: string, event: React.MouseEvent) => {
		event.stopPropagation();
		setEditing({
			leadId,
			field,
			value: currentValue,
			originalValue: currentValue
		});
	};

	const cancelEditing = () => {
		setEditing(null);
	};

	const validateEmail = (email: string): boolean => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const saveEdit = () => {
		if (!editing) return;

		// Validate email if editing email field
		if (editing.field === 'email' && !validateEmail(editing.value)) {
			alert('Please enter a valid email address');
			return;
		}

		// Update the lead data
		setLeadsData(prevLeads => 
			prevLeads.map(lead => 
				lead.id === editing.leadId 
					? { ...lead, [editing.field]: editing.value }
					: lead
			)
		);

		setEditing(null);
	};

	const handleEditingKeyPress = (event: React.KeyboardEvent) => {
		if (event.key === 'Enter') {
			saveEdit();
		} else if (event.key === 'Escape') {
			cancelEditing();
		}
	};
	return (
		<>
			<div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
								{filteredAndSortedLeads.length} of {leadsData.length} leads
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
								placeholder="Search by name, company, or email..."
							/>
						</div>

						<div className="flex flex-col sm:flex-row sm:flex-shrink-0 gap-3">
							<FilterDropdown
								label="Source"
								options={uniqueSources}
								selectedValues={sourceFilters}
								onChange={setSourceFilters}
							/>
										{editing?.leadId === lead.id && editing?.field === 'email' ? (
											<div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
												<input
													type="email"
													value={editing.value}
													onChange={(e) => setEditing({ ...editing, value: e.target.value })}
													onKeyDown={handleEditingKeyPress}
													className="text-sm text-gray-600 bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
													autoFocus
												/>
												<button
													onClick={saveEdit}
													className="text-green-600 hover:text-green-800 p-1"
													title="Save"
												>
													<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
													</svg>
												</button>
												<button
													onClick={cancelEditing}
													className="text-red-600 hover:text-red-800 p-1"
													title="Cancel"
												>
													<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
													</svg>
												</button>
											</div>
										) : (
											<div 
												className="text-sm text-gray-600 hover:bg-gray-100 rounded px-2 py-1 cursor-pointer"
												onClick={(e) => startEditing(lead.id, 'email', lead.email, e)}
											>
												{lead.email}
											</div>
										)}
							<FilterDropdown
								label="Status"
								options={uniqueStatuses}
								selectedValues={statusFilters}
										{editing?.leadId === lead.id && editing?.field === 'status' ? (
											<div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
												<select
													value={editing.value}
													onChange={(e) => setEditing({ ...editing, value: e.target.value })}
													onKeyDown={handleEditingKeyPress}
													className="text-sm bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
													autoFocus
												>
													<option value="new">New</option>
													<option value="contacted">Contacted</option>
													<option value="qualified">Qualified</option>
													<option value="converted">Converted</option>
													<option value="unqualified">Unqualified</option>
												</select>
												<button
													onClick={saveEdit}
													className="text-green-600 hover:text-green-800 p-1"
													title="Save"
												>
													<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
													</svg>
												</button>
												<button
													onClick={cancelEditing}
													className="text-red-600 hover:text-red-800 p-1"
													title="Cancel"
												>
													<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
													</svg>
												</button>
											</div>
										) : (
											<div onClick={(e) => startEditing(lead.id, 'status', lead.status, e)}>
												<StatusBadge status={lead.status} />
											</div>
										)}
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
								onSort={handleSort}
								className="w-20"
							/>
							<TableHeader
								field="name"
								label="Name"
								sortField={sortField}
								sortDirection={sortDirection}
								onSort={handleSort}
							/>
							<TableHeader
								field="company"
								label="Company"
								sortField={sortField}
								sortDirection={sortDirection}
								onSort={handleSort}
							/>
							<TableHeader
								field="email"
								label="Email"
								sortField={sortField}
								sortDirection={sortDirection}
								onSort={handleSort}
							/>
							<TableHeader
								field="source"
								label="Source"
								sortField={sortField}
								sortDirection={sortDirection}
								onSort={handleSort}
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
								onSort={handleSort}
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
