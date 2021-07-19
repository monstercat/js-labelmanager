import {ServerFile} from "../files/model"

export enum StatementStatus {
	Queued = "Queued",
	Processing = "Processing",
	Ready = "Ready",
	Error = "Error"
}

export enum StatementEmailStatus {
	Unsent = "Unsent",
	Queued = "Queued",
	Sent = "Sent"
}

export type ServerStatement = {
	AttachmentsCount: number
	Created: string
	FileIds: string[]
	Files: ServerFile[]
	Id: string
	LabelId: string
	LabelTitle: string
	ReportingDate: string
	Title: string
	Status: StatementStatus
	StatusEmail: StatementEmailStatus
	ErrorMsg: string
	AccountId: string
	AccountTitle: string
	StartDate: string
	FinishDate: string
	Held: boolean
}

export type Statement = {
	AttachmentsCount: number
	Created: Date
	FileIds: string[]
	Files: ServerFile[]
	Id: string
	LabelId: string
	LabelTitle: string
	ReportingDate: Date
	Title: string
	Status: StatementStatus
	StatusEmail: StatementEmailStatus
	ErrorMsg: string
	AccountId: string
	AccountTitle: string
	StartDate: Date
	FinishDate: Date
	Held: boolean
}

export function convertServerStatement(s: ServerStatement): Statement {
	return {
		...s,
		Created: s.Created? new Date(s.Created): null,
		ReportingDate: s.ReportingDate? new Date(s.ReportingDate): null,
		StartDate: s.StartDate? new Date(s.StartDate): null,
		FinishDate: s.FinishDate? new Date(s.FinishDate): null,
	}
}

