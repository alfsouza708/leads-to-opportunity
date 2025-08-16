import { useState } from "react";
import type { Lead } from "../types/leads";
import type { Opportunity } from "../types/opportunity";
import { LeadsTable } from "./LeadsTable";
import { OpportunityTable } from "./OpportunityTable";

interface SalesDashboardProps {
	leads: Lead[];
	opportunities: Opportunity[];
}

export const SalesDashboard: React.FC<SalesDashboardProps> = ({ leads, opportunities }) => {
	const [activeTab, setActiveTab] = useState<"leads" | "opportunities">("leads");

	return (
		<div>
			<div className="mb-4 border-b border-gray-200">
				<nav className="-mb-px flex space-x-8" aria-label="Tabs">
					<button
						className={`${activeTab === 'leads' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
						onClick={() => setActiveTab("leads")}
					>
						Leads
					</button>
					<button
						className={`${activeTab === 'opportunities' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
						onClick={() => setActiveTab("opportunities")}
					>
						Opportunities
					</button>
				</nav>
			</div>
			<div>
				{activeTab === "leads" && <LeadsTable leads={leads} />}
				{activeTab === "opportunities" && <OpportunityTable opportunities={opportunities} />}
			</div>
		</div>
	);
};