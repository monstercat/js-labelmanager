import {ServerFile} from "../files/model"

export type TrackContract = {
	Created: Date
	FinishDate: Date
	Id: string
	Notes: string
	StartDate: Date
	Title: string
	TrackId: string
	Timezone: string

	FileIds?: string[]
	Files?: ServerFile[]
}

export type ServerTrackContract = {
	Created: string
	FinishDate: string
	Id: string
	Notes: string
	StartDate: string
	Title: string
	TrackId: string
	Timezone: string

	FileIds?: string[]
	Files?: ServerFile[]
}

export function convertTrackContract(c: TrackContract): ServerTrackContract {
	return {
		...c,
		Created: c.Created?.toISOString(),
		FinishDate: c.FinishDate?.toISOString(),
		StartDate: c.StartDate?.toISOString(),
	}
}


export function convertServerTrackContract(c: ServerTrackContract): TrackContract {
	return {
		...c,
		Created: c.Created? new Date(c.Created) : null,
		FinishDate: c.FinishDate? new Date(c.FinishDate) : null,
		StartDate: c.StartDate? new Date(c.StartDate) : null
	}
}