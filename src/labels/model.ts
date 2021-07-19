import {ShareCategory} from "../share-type/model"

export type ServerLabel = {
	DPId: string
	GenresPrimary: string[]
	GenresSecondary: string[]
	GRid: string
	GRidIssuer: string
	InvoiceTypes: string[]
	ISRC: string
	PLineCopy: string
	ReleaseLine: string
	Title: string
	DefaultTimezone: string
	LabelGroupId: string
	LabelGroupDefault: boolean

	City: string
	Country: string
	Province: string
	Street: string
	SupportEmail: string

	Id: string
	Created: string
	TagusId: number
	FugaId: number
	FugaUser: string
	FugaOrganizationId: number
	ImageFileId: string

	LabelGroupName?: string
	DumpAccountId?: string
	DumpAccountTitle?: string

	Brands?: LabelBrand[]
	ShareCategories?: ShareCategory[]
}

export type Label = {
	DPId: string
	GenresPrimary: string[]
	GenresSecondary: string[]
	GRid: string
	GRidIssuer: string
	InvoiceTypes: string[]
	ISRC: string
	PLineCopy: string
	ReleaseLine: string
	Title: string
	DefaultTimezone: string
	LabelGroupId: string
	LabelGroupDefault: boolean

	City: string
	Country: string
	Province: string
	Street: string
	SupportEmail: string

	Id: string
	Created: Date
	TagusId: number
	FugaId: number
	FugaUser: string
	FugaOrganizationId: number
	ImageFileId: string

	LabelGroupName?: string
	DumpAccountId?: string
	DumpAccountTitle?: string

	Brands?: LabelBrand[]
	ShareCategories?: ShareCategory[]
}

export type LabelBrand = {
	Active: boolean
	Id: number
	LabelId: string
	Title: string
	LabelTitle?: string
}

export type ServerGeneratingInfo = {
	ReportingDate: string
	Title: string
	StartDate: string
	FinishDate: string
	EmailSent: number
	EmailUnsent: number
	EmailQueued: number
	Processing: number
	Queued: number
	Ready: number
	Error: number
	Unsent: number
	Held: boolean
	Published: number
	Unpublished: number
}

export type LabelPriority = {
	Id: string
	LabelId: string
	Priority: string
	Color: string
}

export type LabelBasic = {
	Id: string
	TagusId: number
	Title: string
}

export function convertLabel(l: Label): ServerLabel {
	return {
		...l,
		Created: l.Created.toISOString(),
	}
}