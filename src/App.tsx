import { SalesDashboard } from "./components/SalesDashboard";
import { mockLeads } from "./data/mockLeads";

function App() {
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

					<SalesDashboard leads={mockLeads} opportunities={[]} />
				</div>
			</div>
		</div>
	);
}

export default App;
