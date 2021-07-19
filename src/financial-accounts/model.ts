import {ServerFinancialImport} from "../master-accounts/model"

export type ServerFinancialAccount = {
	Balance: number
	Id: string
	AccountNumber: string
	MasterAccountId: string
	Created: string
	LabelId: string
	TagusId: number
	Title: string
	Tags: string[]
	Notes: string
	IsDump: boolean
	IsPrimary: boolean
	MasterAccountTitle?: string
	LabelTitle?: string
}

export type FinancialAccount = {
	Balance: number
	Id: string
	AccountNumber: string
	MasterAccountId: string
	Created: Date
	LabelId: string
	TagusId: number
	Title: string
	Tags: string[]
	Notes: string
	IsDump: boolean
	IsPrimary: boolean
	MasterAccountTitle?: string
	LabelTitle?: string
}

export type ServerFinancialTransaction = {
	AccountId: string
	AccountName: string
	MasterAccountId: string
	Amount: number
	Category: string
	DateCreated: string
	DatePosted: string
	Description: string
	Id: string
	SubCategory: string
	IsPayment: boolean
	Sequence: number
	FromDiff: boolean
	FinancialImportId: string
	RunningBalance: number
	CategoryBalance: number
	InvoiceId: string
	InvoiceDescription: string
	OriginGross: number
	RunId: number
	RunTitle: string
	ShareType: string
}

export type FinancialTransaction = {
	AccountId: string
	AccountName: string
	MasterAccountId: string
	Amount: number
	Category: string
	DateCreated: Date
	DatePosted: Date
	Description: string
	Id: string
	SubCategory: string
	IsPayment: boolean
	Sequence: number
	FromDiff: boolean
	FinancialImportId: string
	RunningBalance: number
	CategoryBalance: number
	InvoiceId: string
	InvoiceDescription: string
	OriginGross: number
	RunId: number
	RunTitle: string
	ShareType: string
}

export type Balances = {
	Total: number
	Categorized: { [key: string]: number }
}

export function convertFinancialAccount(a: FinancialAccount): ServerFinancialAccount {
	return {
		...a,
		Created: a.Created?.toISOString(),
	}
}

export function convertServerFinancialAccount(a: ServerFinancialAccount): FinancialAccount {
	return {
		...a,
		Created: a.Created? new Date(a.Created): null
	}
}