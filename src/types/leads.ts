export interface Lead {
	id: number;
	name: string;
	company: string;
	email: string;
	source: string;
	score: number;
	status: "new" | "contacted" | "converted" | "qualified" | "unqualified";
}

export type SortField = keyof Lead;
export type SortDirection = "asc" | "desc";
export type FilterField = "source" | "status";
