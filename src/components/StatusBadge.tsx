import type React from "react";

interface StatusBadgeProps {
	status: string;
}

const statusConfig = {
	new: { color: "bg-gray-100 text-gray-800", label: "New" },
	contacted: { color: "bg-blue-100 text-blue-800", label: "Contacted" },
	qualified: { color: "bg-yellow-100 text-yellow-800", label: "Qualified" },
	converted: { color: "bg-green-100 text-green-800", label: "Converted" },
	unqualified: { color: "bg-red-100 text-red-800", label: "Unqualified" },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
	const config =
		statusConfig[status as keyof typeof statusConfig] || statusConfig.new;

	return (
		<span
			className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}
		>
			{config.label}
		</span>
	);
};
