export interface Opportunity {
	id: number;
	name: string;
	stage: "won" | "closed";
	amount?: number;
	accountName: string;
}
