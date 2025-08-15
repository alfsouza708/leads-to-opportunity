import type React from "react";
import { useEffect, useRef, useState } from "react";

interface FilterDropdownProps {
	label: string;
	options: string[];
	selectedValues: string[];
	onChange: (values: string[]) => void;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
	label,
	options,
	selectedValues,
	onChange,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const toggleOption = (option: string) => {
		if (selectedValues.includes(option)) {
			onChange(selectedValues.filter((v) => v !== option));
		} else {
			onChange([...selectedValues, option]);
		}
	};

	const clearAll = () => {
		onChange([]);
	};

	return (
		<div className="relative" ref={dropdownRef}>
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="flex items-center justify-between min-w-[140px] w-full px-4 py-3 text-left bg-white border border-gray-200 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
			>
				<span className="flex items-center">
					<span className="text-gray-700 font-medium truncate">{label}</span>
					{selectedValues.length > 0 && (
						<span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
							{selectedValues.length}
						</span>
					)}
				</span>
				<svg
					className={`h-4 w-4 text-gray-400 transition-transform flex-shrink-0 ml-2 ${isOpen ? "rotate-180" : ""}`}
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<title>Chevron</title>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M19 9l-7 7-7-7"
					/>
				</svg>
			</button>

			{isOpen && (
				<div className="absolute z-10 min-w-[200px] w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg">
					<div className="p-2">
						{selectedValues.length > 0 && (
							<button
								type="button"
								onClick={clearAll}
								className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
							>
								<svg
									className="h-4 w-4 mr-2"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<title>Clear all icon</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
								Clear all
							</button>
						)}
						{options.map((option) => (
							<label
								key={option}
								className="flex items-center w-full px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
							>
								<input
									type="checkbox"
									checked={selectedValues.includes(option)}
									onChange={() => toggleOption(option)}
									className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
								/>
								<span className="ml-3 text-sm text-gray-700 capitalize whitespace-nowrap">
									{option}
								</span>
							</label>
						))}
					</div>
				</div>
			)}
		</div>
	);
};
