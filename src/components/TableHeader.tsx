import type { SortDirection } from "../types/leads";

interface TableHeaderProps<T> {
	field: keyof T;
	label: string;
	sortField?: keyof T | null;
	sortDirection?: SortDirection;
	onSort?: (field: keyof T) => void;
	className?: string;
}

export const TableHeader = <T extends object>({
	field,
	label,
	sortField,
	sortDirection,
	onSort,
	className = "",
}: TableHeaderProps<T>) => {
	const isSorted = sortField === field;
	const isSortable = onSort !== undefined;

	return (
		<th
			className={`px-6 py-4 text-left text-sm font-semibold text-gray-900 ${
				isSortable ? "cursor-pointer hover:bg-gray-50" : ""
			} transition-colors ${className}`}
			onClick={() => onSort?.(field)}
		>
			<div className="flex items-center space-x-1">
				<span>{label}</span>
				{isSortable && (
					<div className="flex flex-col">
						<svg
							className={`h-3 w-3 ${isSorted && sortDirection === "asc" ? "text-blue-600" : "text-gray-300"}`}
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<title>Chevron asc</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M5 15l7-7 7 7"
							/>
						</svg>
						<svg
							className={`h-3 w-3 -mt-1 ${isSorted && sortDirection === "desc" ? "text-blue-600" : "text-gray-300"}`}
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<title>Chevron desc</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M19 9l-7 7-7-7"
							/>
						</svg>
					</div>
				)}
			</div>
		</th>
	);
};
