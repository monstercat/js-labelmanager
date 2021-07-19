import {ServerAllocationSet} from "../allocation-sets/model";

export type ServerSheet = {
	Archived: boolean,
	Created: string,
	CreatorId?: string,
	CreatorName: string,
	EntityTitle: string,
	ErrorMessage: string,
	Filename: string,
	Filepath: string,
	HasAllocErrors: boolean,
	HasAllocations: boolean,
	HasBasicErrors: boolean,
	HasMatchErrors: boolean,
	Hash: string,
	HashAlgorithm: string,
	Id: number,
	LabelDefaultTimezone: string,
	LabelGroupId: string,
	LabelGroupName: string,
	LabelId: string,
	LabelScopeId: string,
	LabelTitle: string,
	Notes: string,
	NumAllocErrors: number,
	NumAllocations: number,
	NumBasicErrors: number,
	NumLines: number,
	NumMatchErrors: number,
	OriginalFilepath: string,
	OriginalHash: string,
	PostedDate: string,
	SchemaId: number,
	SchemaTarget: string,
	SchemaTitle: string,
	Sets: ServerAllocationSet[],
	Status: string,
	Tags: string[],
	Title: string,
	ValidMatches: boolean,
	ValidSheet: boolean
}

export type Sheet = {
	Archived: boolean,
	Created: Date,
	CreatorId?: string,
	CreatorName: string,
	EntityTitle: string,
	ErrorMessage: string,
	Filename: string,
	Filepath: string,
	HasAllocErrors: boolean,
	HasAllocations: boolean,
	HasBasicErrors: boolean,
	HasMatchErrors: boolean,
	Hash: string,
	HashAlgorithm: string,
	Id: number,
	LabelDefaultTimezone: string,
	LabelGroupId: string,
	LabelGroupName: string,
	LabelId: string,
	LabelScopeId: string,
	LabelTitle: string,
	Notes: string,
	NumAllocErrors: number,
	NumAllocations: number,
	NumBasicErrors: number,
	NumLines: number,
	NumMatchErrors: number,
	OriginalFilepath: string,
	OriginalHash: string,
	PostedDate: Date,
	SchemaId: number,
	SchemaTarget: string,
	SchemaTitle: string,
	Sets: ServerAllocationSet[],
	Status: string,
	Tags: string[],
	Title: string,
	ValidMatches: boolean,
	ValidSheet: boolean
}

export function convertServerSheet(s: ServerSheet): Sheet {
	return {
		...s,
		Created: s.Created? new Date(s.Created): null,
		PostedDate: s.PostedDate? new Date(s.PostedDate): null,
	}
}

export function convertSheet(s: Sheet): ServerSheet {
	return {
		...s,
		Created: s.Created.toISOString(),
		PostedDate: s.PostedDate?.toISOString(),
	}
}

export type SheetError = {
	AssignedValue: string
	ColumnNumber: number
	EntityId: number
	Message: string
	RowNumber: number
	SheetId: number
}
