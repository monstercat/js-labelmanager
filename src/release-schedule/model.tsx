export type ReleaseScheduleItem = {
	Id: string
	NumReleases: number
	DayOfWeek: number
	BrandId: number
	LabelId?: string
	LabelTitle?: string
	BrandTitle?: string
}