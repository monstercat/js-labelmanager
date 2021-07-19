export enum InvoiceTransactionType {
	Income = "Income",
	Expense = "Expense"
}

export enum InvoiceRelation {
	None = "None",
	Track = "Track",
	Release = "Release",
	Event = "Event",
	Asset = "Asset"
}

export type ServerInvoice = {
	AssetTitle: string
	AmountOriginal: number
	AmountOriginalCurrency: string
	AmountEffective: number
	Category: string
	CreatorId: string
	CreatorName: string
	DatePosted: string
	DateCreated: string
	DateProcessed: string
	DateInvoiced: string
	Description: string
	EventTitle: string
	Id: string
	LabelId: string
	LabelInvoiceTypes: string[]
	LabelDefaultTimezone: string
	LabelTitle: string
	LabelTagusId: number
	Number: string
	Notes: string
	Published: boolean
	Quantity: number
	Processed: boolean
	RelationId: string
	RelationType: InvoiceRelation
	ReleaseTitle: string
	ReleaseArtistsTitle: string
	ReleaseVersion: string
	Timezone: string
	TrackTitle: string
	TrackArtistsTitle: string
	TrackVersion: string
	TransactionType: InvoiceTransactionType
	Type: string
	Vendor: string

	// Share Amount will be calculated when an invoice is requested.
	// If there is an error (e.g., the fractions do not total to 1), it will show -1.
	// Otherwise, it will show the appropriate amount.
	//
	// There are two choices:
	// - use custom splits (which is stored in Shares
	// - use asset shares. In this case, it will use the Share type to
	//   correspond to the share type of the asset, and use those shares.
	UseAssetShares: boolean
	ShareType: string
	Shares: InvoiceShare[]
}

export type Invoice = {
	AssetTitle: string
	AmountOriginal: number
	AmountOriginalCurrency: string
	AmountEffective: number
	Category: string
	CreatorId: string
	CreatorName: string
	DatePosted: Date
	DateCreated: Date
	DateProcessed: Date
	DateInvoiced: Date
	Description: string
	EventTitle: string
	Id: string
	LabelId: string
	LabelInvoiceTypes: string[]
	LabelDefaultTimezone: string
	LabelTitle: string
	LabelTagusId: number
	Number: string
	Notes: string
	Published: boolean
	Quantity: number
	Processed: boolean
	RelationId: string
	RelationType: InvoiceRelation
	ReleaseTitle: string
	ReleaseArtistsTitle: string
	ReleaseVersion: string
	Timezone: string
	TrackTitle: string
	TrackArtistsTitle: string
	TrackVersion: string
	TransactionType: InvoiceTransactionType
	Type: string
	Vendor: string

	// Share Amount will be calculated when an invoice is requested.
	// If there is an error (e.g., the fractions do not total to 1), it will show -1.
	// Otherwise, it will show the appropriate amount.
	//
	// There are two choices:
	// - use custom splits (which is stored in Shares
	// - use asset shares. In this case, it will use the Share type to
	//   correspond to the share type of the asset, and use those shares.
	UseAssetShares: boolean
	ShareType: string
	Shares: InvoiceShare[]
}

export type InvoiceShare = {
	InvoiceId: string
	AccountId: string
	AccountTitle: string
	Fraction: string
	Amount: number

	MasterAccountId?: string
	MasterAccountTitle?: string
	AccountNumber?: string
	LabelTitle?: string
}

export function convertFinancialInvoice(i : Invoice) : ServerInvoice {
	return {
		...i,
		DatePosted: i.DatePosted?.toISOString(),
		DateCreated: i.DateCreated?.toISOString(),
		DateProcessed: i.DateProcessed?.toISOString(),
		DateInvoiced: i.DateInvoiced?.toISOString()
	}
}