export type RunBasic = {
	Id: number
	Title: string
}

export type Run = {
	Archived: boolean
	Created: Date
	CreatorId: number
	EntityId: number
	Id: number
	Notes: string
	Status: string
	Tags: string[]
	Title: string

	RunSheets: RunSheet[]

	// joined fields
	EntityTitle?: string
	LabelId?: string
	LabelTitle?: string
	LabelDefaultTimezone?: string
	NumLines?: number
	NumAllocations?: number
}

export type ServerRun = {
	Archived: boolean
	Created: string
	CreatorId: number
	EntityId: number
	Id: number
	Notes: string
	Status: string
	Tags: string[]
	Title: string

	RunSheets: ServerRunSheet[]

	// joined fields
	EntityTitle?: string
	LabelId?: string
	LabelTitle?: string
	LabelDefaultTimezone?: string
	NumLines?: number
	NumAllocations?: number
}

export function convertServerRun(r: ServerRun): Run {
	return {
		...r,
		Created: r.Created ? new Date(r.Created) : null,
		RunSheets: r.RunSheets?.map(convertServerRunSheet)
	}
}

export function convertRun(r: Run): ServerRun {
	return {
		...r,
		Created: r.Created?.toISOString(),
		RunSheets: r.RunSheets?.map(convertRunSheet)
	}
}

export type RunSheet = {
	RunId: number
	AllocationSetId: number

	// Joined fields
	SheetId?: number
	SheetTitle?: string
	SchemaTitle?: string
	SchemaId?: number
	SchemaTarget?: string
	AllocationSetTitle?: string
	Status?: string
	NumAllocations?: number
	NumMatchErrors?: number
	NumAllocationErrors?: number
	NumAssignedMatchErrors?: number
	NumIgnoredMatchErrors?: number
	NumLines?: number
	Created?: Date
	PostedDate?: Date
	Message?: string
}

export type ServerRunSheet = {
	RunId: number
	AllocationSetId: number

	// Joined fields
	SheetId?: number
	SheetTitle?: string
	SchemaTitle?: string
	SchemaId?: number
	SchemaTarget?: string
	AllocationSetTitle?: string
	Status?: string
	NumAllocations?: number
	NumMatchErrors?: number
	NumAllocationErrors?: number
	NumAssignedMatchErrors?: number
	NumIgnoredMatchErrors?: number
	NumLines?: number
	Created?: string
	PostedDate?: string
	Message?: string
}

export function convertServerRunSheet(s: ServerRunSheet): RunSheet {
	return {
		...s,
		Created: s.Created ? new Date(s.Created) : null,
		PostedDate: s.PostedDate ? new Date(s.PostedDate) : null,
	}
}

export function convertRunSheet(s: RunSheet): ServerRunSheet {
	return {
		...s,
		Created: s.Created?.toISOString(),
		PostedDate: s.PostedDate?.toISOString(),
	}
}

export type SimpleSummary = {
	AccountId: number
	AccountTitle: string
	Amount: number
	RunId: number
	ShareType: string
	SheetId: number

	// This is filled after-the-fact
	FinancialAccountId?: string
	LabelId?: string
	LabelTitle?: string
}

export type DiffSummary = {
	AccountId: number
	AccountTitle: string
	Amount: number
	ShareType: string

	FinAccountId: string
	LabelId: string
	LabelTitle: string
}