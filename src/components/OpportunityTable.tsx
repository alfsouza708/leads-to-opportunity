import type { Opportunity } from "../types/opportunity";
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
							<p className="text-sm text-gray-600 mt-1">
								{opportunities.length} opportunities
							</p>
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
											{opportunity.stage}
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
				</div>
			</div>
		</>
	);
};
