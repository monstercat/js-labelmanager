import {convertFinancialAccount, FinancialAccount, ServerFinancialAccount} from "../financial-accounts/model"

export type ServerMasterAccount = {
	BillingEmails: string[],
	ContactedBy: string,
	ContactedByName: string,
	ContactedOn: string,
	Created: string,
	FinancialAccounts: ServerFinancialAccount[],
	Id: string,
	LegalName: string,
	Notes: string,
	NumSubAccounts: number
	PaymentMethod: string,
	PaypalEmail: string,
	Tags: string[]
	Title: string
}

export type MasterAccount = {
	BillingEmails: string[],
	ContactedBy: string,
	ContactedByName: string,
	ContactedOn: Date,
	Created: Date,
	FinancialAccounts: FinancialAccount[],
	Id: string,
	LegalName: string,
	Notes: string,
	NumSubAccounts: number
	PaymentMethod: string,
	PaypalEmail: string,
	Tags: string[]
	Title: string
}

export function convertMasterAccount(a: MasterAccount): ServerMasterAccount {
	return {
		...a,
		ContactedOn: a.ContactedOn?.toISOString(),
		Created: a.Created?.toISOString(),
		FinancialAccounts: a.FinancialAccounts?.map(convertFinancialAccount),
	}
}

export type ServerFinancialImport = {
	Id: string
	Description: string
	DateCreated: string
	DatePosted: string
	CreatorId: string
	Filename: string
	LabelId: string
	CreatorName?: string
}

export type FinancialImport = {
	Id: string
	Description: string
	DateCreated: Date
	DatePosted: Date
	CreatorId: string
	Filename: string
	LabelId: string
	CreatorName?: string
}
