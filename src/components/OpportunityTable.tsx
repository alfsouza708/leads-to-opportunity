import type { Opportunity } from "../types/opportunity";
import { StageBadge } from "./StageBadge";
import { TableHeader } from "./TableHeader";

interface OpportunityTableProps {
	opportunities: Opportunity[];
}

export const OpportunityTable: React.FC<OpportunityTableProps> = ({
	opportunities,
}) => {
	return (
		<>
			<div className="bg-white rounded-2xl shadow-xl border border-gray-100">
				{/* Header */}
				<div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
					<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
						<div>
							<h2 className="text-2xl font-bold text-gray-900">
								Opportunities
							</h2>
						</div>
					</div>
				</div>

				{/* Table */}
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<TableHeader<Opportunity>
									field="id"
									label="ID"
									className="w-20"
								/>
								<TableHeader<Opportunity> field="name" label="Name" />
								<TableHeader<Opportunity> field="stage" label="Stage" />
								<TableHeader<Opportunity> field="amount" label="Amount" />
								<TableHeader<Opportunity>
									field="accountName"
									label="Account Name"
								/>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-100">
							{opportunities.map((opportunity, index) => (
								<tr
									key={opportunity.id}
									className={`hover:bg-blue-50 cursor-pointer transition-colors ${
										index % 2 === 0 ? "bg-white" : "bg-gray-25"
									}`}
								>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
										{opportunity.id}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm font-medium text-gray-900">
											{opportunity.name}
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm text-gray-900">
											<StageBadge stage={opportunity.stage} />
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm text-gray-600">
											{opportunity.amount}
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm text-gray-900">
											{opportunity.accountName}
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
					{opportunities.length === 0 && (
						<div className="text-center py-12">
							<svg
								className="mx-auto h-12 w-12 text-gray-400"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								aria-hidden="true"
							>
								<path
									vectorEffect="non-scaling-stroke"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
								/>
							</svg>
							<h3 className="mt-2 text-sm font-medium text-gray-900">
								No opportunities
							</h3>
							<p className="mt-1 text-sm text-gray-500">
								Get started by creating a new opportunity.
							</p>
						</div>
					)}
				</div>
			</div>
		</>
	);
};

