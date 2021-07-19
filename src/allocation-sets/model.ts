import {Paginated} from "../types"

export type ServerAllocationSet = {
	Created?: string,
	EntityTitle?: string,
	Id?: number,
	IsDefault?: boolean,
	LabelId?: string,
	LabelTitle?: string,
	Message?: string,
	NumAllocationErrors?: number,
	NumAllocations?: number,
	NumAssignedMatchErrors?: number,
	NumIgnoredMatchErrors?: number,
	NumMatchErrors?: number,
	SchemaId?: number,
	SchemaTarget?: string,
	SchemaTitle?: string,
	SheetId?: string,
	SheetTitle?: string,
	Status?: string,
	Title: string,
}

export type AllocationSetErrorBlob = {
	fields: string[],
	match_columns: string[],
	//TODO: Include asset type here
	assets: []
}

export type GetAllocationSetSummaryResponse = {
	SheetSummary: Paginated<SheetSummary>
}

export type SheetSummary = {
	AccountId: number,
	AccountTitle: string,
	Amount: string,
	FinancialAccountId: string,
	LabelId: string,
	LabelTitle: string,
	RunId: number,
	ShareType: string,
	SheetId: number,
}