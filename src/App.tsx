import { useEffect, useState } from "react";
import { SalesDashboard } from "./components/SalesDashboard";
import { mockLeads } from "./data/mockLeads";
import type { Lead } from "./types/leads";
import type { Opportunity } from "./types/opportunity";

function App() {
	const [leads, setLeads] = useState<Lead[]>(mockLeads);
	const [opportunities, setOpportunities] = useState<Opportunity[]>(() => {
		const saved = localStorage.getItem("opportunities");
		return saved ? JSON.parse(saved) : [];
	});
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		localStorage.setItem("opportunities", JSON.stringify(opportunities));
	}, [opportunities]);

	const handleConvertLead = (lead: Lead) => {
		setIsLoading(true);
		setTimeout(() => {
			const newOpportunity: Opportunity = {
				id: opportunities.length > 0 ? Math.max(...opportunities.map(o => o.id)) + 1 : 1,
				name: `${lead.company} Deal`,
				stage: "won",
				amount: 0,
				accountName: lead.name,
			};
			setOpportunities([...opportunities, newOpportunity]);
			setLeads(leads.map(l => l.id === lead.id ? { ...l, status: "converted" } : l));
			setIsLoading(false);
		}, 2000);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
			<div className="container mx-auto px-4 py-8">
				<div className="max-w-7xl mx-auto">
					<div className="mb-8 text-center">
						<h1 className="text-4xl font-bold text-gray-900 mb-2">
							Sales Dashboard
						</h1>
						<p className="text-lg text-gray-600">
							Track, filter, and manage your sales leads and opportunities effectively
						</p>
					</div>

					<SalesDashboard leads={leads} opportunities={opportunities} onConvertLead={handleConvertLead} isLoading={isLoading} />
				</div>
			</div>
		</div>
	);
}

export default App;
