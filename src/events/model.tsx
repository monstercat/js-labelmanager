import {ArtistInfo} from "../artists/model"
import {ServerFile} from "../files/model"

export type ServerEvent = {
	// @deprecated
	BandsInTownId: string,

	CategoryId: string,
	CoverFileId: string,
	Created: string,
	Description: string,
	Details: { [key: string]: string | number | boolean },
	EndDate: string,
	ExternalURL: string,
	FacebookEventId: string,
	Id: string,
	LabelId: string,
	Location: string,
	PosterFileId: string,
	Public: boolean,
	StartDate: string,
	ScheduledDate: string,
	Tags: string[],
	TimeZoneName: string,
	Title: string,
	URI: string,
	Venue: string,
	YoutubeVideoId: string,

	LabelTitle?: string,
	Category?: string,
	Artists?: ArtistInfo[],
	Media?: ServerFile[],
}

export type LmEvent = {
	// @deprecated
	BandsInTownId: string,

	CategoryId: string,
	CoverFileId: string,
	Created: Date,
	Description: string,
	Details: { [key: string]: string | number | boolean },
	EndDate: Date,
	ExternalURL: string,
	FacebookEventId: string,
	Id: string,
	LabelId: string,
	Location: string,
	PosterFileId: string,
	Public: boolean,
	StartDate: Date,
	ScheduledDate: Date,
	Tags: string[],
	TimeZoneName: string,
	Title: string,
	URI: string,
	Venue: string,
	YoutubeVideoId: string,

	LabelTitle?: string,
	Category?: string,
	Artists?: ArtistInfo[],
	Media?: ServerFile[],
}

export function convertLmEvent(e: LmEvent): ServerEvent {
	return {
		...e,
		Created: e.Created?.toISOString(),
		EndDate: e.EndDate?.toISOString(),
		StartDate: e.StartDate?.toISOString(),
		ScheduledDate: e.ScheduledDate?.toISOString(),
	}
}