import {Address, ServerLink} from "../types"

export type ServerArtist = {
	ActiveYears: number[]
	BandsInTownId: string
	Created: string
	Details: ServerArtistDetails
	Id: string
	Links: ServerLink[]
	Name: string
	ProfileFileId: string
	Public: boolean
	ShowEvent: boolean
	Tags: string[]
	URI: string
	URLs: string[]
	FeaturedReleaseId: string
	FeaturedVideoURL: string

	FeaturedReleaseCoverFileId?: string
}

export type ServerArtistDetails = {
	About: string
	Bookings: string
	ManagementDetails: string
}

export type ServerArtistRelationship = Address & {
	ArtistId: string
	UserId: string
	Role: string
	Name: string
	Email: string
}

export enum ArtistRoles {
	Primary = "Primary",
	Featured = "Featured",
	Remixer = "Remixer",
	Composer = "Composer",
	Writer = "Writer",
	Producer = "Producer"
}

export enum ArtistPlatform {
	All = "",
	Spotify = "Spotify"
}

export enum ArtistImageType {
	Cover = "cover",
	Logo = "logo",
	Square = "square",
	Portrait = "portrait",
	Landscape = "landscape"
}

export type ArtistInfo = {
	ArtistId: string
	ArtistURI: string
	EventId: string
	Name: string
	Platform: string
	ArtistNumber: number
	ReleaseId: string
	Role: string
	Tags: string[]
	TrackId: string
	Public: boolean
	ProfileFileId: string
	LogoFileId: string
	SquareFileId: string
	PortraitFileId: string
	LandscapeFileId: string
	Links: ServerLink[]
}