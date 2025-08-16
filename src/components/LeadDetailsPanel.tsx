import { useEffect, useState } from "react";
import type { Lead } from "../types/leads";
import { ScoreBadge } from "./ScoreBadge";
import { StatusBadge } from "./StatusBadge";

interface LeadDetailsPanelProps {
	lead: Lead | null;
	isOpen: boolean;
	onClose: () => void;
	onConvertLead: (lead: Lead) => void;
	isLoading: boolean;
}

export const LeadDetailsPanel: React.FC<LeadDetailsPanelProps> = ({
	lead,
	isOpen,
	onClose,
	onConvertLead,
	isLoading,
}) => {
	const [show, setShow] = useState(false);

	useEffect(() => {
		if (isOpen) {
			const timer = setTimeout(() => {
				setShow(true);
			}, 10);
			return () => clearTimeout(timer);
		} else {
			setShow(false);
		}
	}, [isOpen]);

	if (!lead) return null;

	return (
		<>
			{/* Backdrop */}
			<div
				className={`fixed inset-0  z-40 transition-opacity duration-300 ease-in-out ${
					show ? "bg-opacity-50" : "bg-opacity-0"
				}`}
				onClick={onClose}
			/>

			{/* Slide-over panel */}
			<div
				className={`fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
					show ? "translate-x-0" : "translate-x-full"
				}`}
			>
				<div
					className={`flex flex-col h-full transition-opacity duration-300 ease-in-out delay-100 ${show ? "opacity-100" : "opacity-0"}`}
				>
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
										.
										{lead.score < 60 && (
											<p className="text-red-700">
												📈 Low score, may need qualification or re-evaluation
											</p>
										)}
									</div>
								</div>
							</div>

							{/* convert to lead conditional can be improved. it depends on the business rules. */}
							<button
								className={`w-full flex items-center justify-center px-4 py-2 rounded-lg transition-colors font-bold ${
									lead.score >= 60 &&
									!isLoading &&
									lead.status !== "unqualified" &&
									lead.status !== "converted"
										? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
										: "bg-gray-300 text-gray-500 cursor-not-allowed"
								}`}
								disabled={
									lead.score < 60 ||
									isLoading ||
									lead.status === "unqualified" ||
									lead.status === "converted"
								}
								onClick={() => onConvertLead(lead)}
							>
								{isLoading && (
									<svg
										className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										></circle>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										></path>
									</svg>
								)}
								{isLoading ? "Converting..." : "Convert Lead"}
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
