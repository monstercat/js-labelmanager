
export type ShareType = {
	CategoryId: string
	Title: string
	ShareType: string
	Category: string
}

export type ShareCategory = {
	Id: string
	LabelId: string
	Category: string
	ShareTypes?: ShareType[]
}