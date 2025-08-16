import type React from "react";

interface StageBadgeProps {
	stage: string;
}

const stageConfig = {
	closed: { color: "bg-gray-100 text-gray-800", label: "Closed" },
	won: { color: "bg-green-100 text-green-800", label: "Won" },
};

export const StageBadge: React.FC<StageBadgeProps> = ({ stage }) => {
	const config =
		stageConfig[stage as keyof typeof stageConfig] || stageConfig.won;

	return (
		<span
			className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}
		>
			{config.label}
		</span>
	);
};
