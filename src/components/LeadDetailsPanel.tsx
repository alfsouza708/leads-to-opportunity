import type React from "react";
import type { Lead } from "../types/leads";
import { ScoreBadge } from "./ScoreBadge";
import { StatusBadge } from "./StatusBadge";

interface LeadDetailsPanelProps {
	lead: Lead | null;
	isOpen: boolean;
	onClose: () => void;
}

export const LeadDetailsPanel: React.FC<LeadDetailsPanelProps> = ({
	lead,
	isOpen,
	onClose,
}) => {
	if (!lead) return null;

	return (
		<>
			{/* Backdrop */}
			{isOpen && (
				<div
					className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
					onClick={onClose}
				/>
			)}

			{/* Slide-over panel */}
			<div
				className={`fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
					isOpen ? "translate-x-0" : "translate-x-full"
				}`}
			>
				<div className="flex flex-col h-full">
					{/* Header */}
					<div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
						<div className="flex items-center justify-between">
							<h2 className="text-xl font-semibold text-gray-900">
								Lead Details
							</h2>
							<button
								onClick={onClose}
								className="p-2 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors"
							>
								<svg
									className="h-5 w-5 text-gray-500"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<title>Close</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>
					</div>

					{/* Content */}
					<div className="flex-1 overflow-y-auto p-6">
						<div className="space-y-6">
							{/* Basic Info */}
							<div className="bg-gray-50 rounded-xl p-4">
								<h3 className="text-lg font-semibold text-gray-900 mb-3">
									Contact Information
								</h3>
								<div className="space-y-3">
									<div>
										<label className="text-sm font-medium text-gray-500">
											Name
										</label>
										<p className="text-gray-900 font-medium">{lead.name}</p>
									</div>
									<div>
										<label className="text-sm font-medium text-gray-500">
											Company
										</label>
										<p className="text-gray-900">{lead.company}</p>
									</div>
									<div>
										<label className="text-sm font-medium text-gray-500">
											Email
										</label>
										<p className="text-gray-900">
											<a
												href={`mailto:${lead.email}`}
												className="text-blue-600 hover:text-blue-800 transition-colors"
											>
												{lead.email}
											</a>
										</p>
									</div>
								</div>
							</div>

							{/* Lead Metrics */}
							<div className="bg-gray-50 rounded-xl p-4">
								<h3 className="text-lg font-semibold text-gray-900 mb-3">
									Lead Metrics
								</h3>
								<div className="space-y-3">
									<div>
										<label className="text-sm font-medium text-gray-500">
											Lead ID
										</label>
										<p className="text-gray-900 font-mono">#{lead.id}</p>
									</div>
									<div>
										<label className="text-sm font-medium text-gray-500">
											Source
										</label>
										<div className="mt-1">
											<span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
												{lead.source}
											</span>
										</div>
									</div>
									<div>
										<label className="text-sm font-medium text-gray-500">
											Lead Score
										</label>
										<div className="mt-1">
											<ScoreBadge score={lead.score} />
										</div>
									</div>
									<div>
										<label className="text-sm font-medium text-gray-500">
											Status
										</label>
										<div className="mt-1">
											<StatusBadge status={lead.status} />
										</div>
									</div>
								</div>
							</div>

							{/* Score Analysis */}
							<div className="bg-gray-50 rounded-xl p-4">
								<h3 className="text-lg font-semibold text-gray-900 mb-3">
									Score Analysis
								</h3>
								<div className="space-y-3">
									<div>
										<div className="flex justify-between items-center mb-2">
											<span className="text-sm font-medium text-gray-600">
												Lead Quality
											</span>
											<span className="text-sm font-semibold text-gray-900">
												{lead.score}/100
											</span>
										</div>
										<div className="w-full bg-gray-200 rounded-full h-2">
											<div
												className={`h-2 rounded-full transition-all duration-300 ${
													lead.score >= 80
														? "bg-green-500"
														: lead.score >= 60
															? "bg-yellow-500"
															: "bg-red-500"
												}`}
												style={{ width: `${lead.score}%` }}
											/>
										</div>
									</div>
									<div className="text-sm text-gray-600">
										{lead.score >= 80 && (
											<p className="text-green-700">
												🎯 High-quality lead with strong conversion potential
											</p>
										)}
										{lead.score >= 60 && lead.score < 80 && (
											<p className="text-yellow-700">
												⚡ Moderate lead quality, requires nurturing
											</p>
										)}
										{lead.score < 60 && (
											<p className="text-red-700">
												📈 Low score, may need qualification or re-evaluation
											</p>
										)}
									</div>
								</div>
							</div>

							{/* Quick Actions */}
							<div className="bg-gray-50 rounded-xl p-4">
								<h3 className="text-lg font-semibold text-gray-900 mb-3">
									Quick Actions
								</h3>
								<div className="space-y-2">
									<button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
										<svg
											className="h-4 w-4 mr-2"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<title>Email icon</title>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
											/>
										</svg>
										Send Email
									</button>
									<button className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
										<svg
											className="h-4 w-4 mr-2"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<title>Phone icon</title>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
											/>
										</svg>
										Call Lead
									</button>
									<button className="w-full flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
										<svg
											className="h-4 w-4 mr-2"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<title>Edit icon</title>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
											/>
										</svg>
										Edit Lead
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};