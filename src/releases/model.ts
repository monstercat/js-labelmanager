import {ServerLink, ValidationInfo, LockStatus} from "../types"
import {ServerAsset} from "../assets/model"
import {ArtistInfo} from "../artists/model"
import {ServerReleaseInfo} from "../tracks/model"
import {DDEXStatus} from "../distributors/model"

export enum ReleaseType {
	Album = "Album",
	Ep = "Ep",
	Mixes = "Mixes",
	Podcast = "Podcast",
	Single = "Single",
	Compilation = "Compilation",
}

export type ServerRelease = {
	AlbumNotes: string
	ArtistsTitle: string
	BrandId: number
	CatalogId: string
	CopyrightPLine: string
	CoverFileId: string
	Created: string
	Description: string
	FeaturedArtistsTitle: string
	Flag: string
	FugaId: number
	GRid: string
	GenrePrimary: string
	GenreSecondary: string
	Id: string
	LabelId: string
	LabelLine: string
	LockStatus: LockStatus
	ManuallyDistributed: boolean
	Notes: string
	PriorityId: string
	PrereleaseDate: string
	PresaveDate: string
	Public: boolean
	ReleaseDate: string
	ReleaseDateTimezone: string
	RepresentativeId: string
	SpotifyId: string
	Tags: string[]
	TagusId: number
	Title: string
	Version: string
	Type: string
	UPC: string
	YouTubeUrl: string

	// From Join or View
	Brand: string
	LabelTitle: string
	LabelDefaultTimezone: string
	TracksCount: number
	FilesCount: number
	FilesAndTracksCount: number
	HasReleaseErrors: boolean
	HasTrackErrors: boolean
	ReleaseInfoErrors: ValidationInfo[]
	HasContractErrors: boolean
	RepresentativeName: string
	Priority: string
	PriorityColor: string

	Links?: ServerLink[]
	Tracks?: ServerTrackInfo[]
	TagusAsset?: ServerAsset
	Artists?: ArtistInfo[]
}

export type Release = {
	AlbumNotes: string
	ArtistsTitle: string
	BrandId: number
	CatalogId: string
	CopyrightPLine: string
	CoverFileId: string
	Created: Date
	Description: string
	FeaturedArtistsTitle: string
	Flag: string
	FugaId: number
	GRid: string
	GenrePrimary: string
	GenreSecondary: string
	Id: string
	LabelId: string
	LabelLine: string
	LockStatus: LockStatus
	ManuallyDistributed: boolean
	Notes: string
	PriorityId: string
	PrereleaseDate: Date
	PresaveDate: Date
	Public: boolean
	ReleaseDate: Date
	ReleaseDateTimezone: string
	RepresentativeId: string
	SpotifyId: string
	Tags: string[]
	TagusId: number
	Title: string
	Version: string
	Type: string
	UPC: string
	YouTubeUrl: string

	// From Join or View
	Brand: string
	LabelTitle: string
	LabelDefaultTimezone: string
	TracksCount: number
	FilesCount: number
	FilesAndTracksCount: number
	HasReleaseErrors: boolean
	HasTrackErrors: boolean
	ReleaseInfoErrors: ValidationInfo[]
	HasContractErrors: boolean
	RepresentativeName: string
	Priority: string
	PriorityColor: string

	Links?: ServerLink[]
	Tracks?: TrackInfo[]
	TagusAsset?: ServerAsset
	Artists?: ArtistInfo[]
}

export function convertServerRelease(r: ServerRelease): Release {
	return {
		...r,
		Created: r.Created ? new Date(r.Created) : null,
		PrereleaseDate: r.PrereleaseDate ? new Date(r.PrereleaseDate) : null,
		ReleaseDate: r.ReleaseDate ? new Date(r.ReleaseDate) : null,
		PresaveDate: r.PresaveDate ? new Date(r.PresaveDate) : null,
		Tracks: r.Tracks?.map(convertServerTrackInfo)
	}
}

export function convertRelease(r: Release): ServerRelease {
	return {
		...r,
		Created: r.Created?.toISOString(),
		PrereleaseDate: r.PrereleaseDate?.toISOString(),
		ReleaseDate: r.ReleaseDate?.toISOString(),
		PresaveDate: r.PresaveDate?.toISOString(),
		Tracks: r.Tracks?.map(convertTrackInfo)
	}
}

export type ServerTrackInfo = {
	ArtistTitle: string
	GenrePrimary: string
	GenreSecondary: string
	ISRC: string
	IsTagusChild: boolean
	Starred: boolean
	PrereleaseDate: string
	ReleaseDate: string
	Title: string
	TrackId: string
	TrackNumber: number
	Version: string
	WavFileId: string
	Duration: number
	Flag: string
	Tags: string[]
	LabelTitle: string
	Brand: string
	Lyrics: string
	BPM: number
	DebutDate: string
	Created: string
	FugaId: number

	Artists?: ArtistInfo[]
	Encodings?: string[]
}

export type TrackInfo = {
	ArtistTitle: string
	GenrePrimary: string
	GenreSecondary: string
	ISRC: string
	IsTagusChild: boolean
	Starred: boolean
	PrereleaseDate: Date
	ReleaseDate: Date
	Title: string
	TrackId: string
	TrackNumber: number
	Version: string
	WavFileId: string
	Duration: number
	Flag: string
	Tags: string[]
	LabelTitle: string
	Brand: string
	Lyrics: string
	BPM: number
	DebutDate: Date
	Created: Date
	FugaId: number

	Artists?: ArtistInfo[]
	Encodings?: string[]
}

export function convertServerTrackInfo(i: ServerTrackInfo): TrackInfo {
	return {
		...i,
		Created: i.Created ? new Date(i.Created) : null,
		PrereleaseDate: i.PrereleaseDate ? new Date(i.PrereleaseDate) : null,
		ReleaseDate: i.ReleaseDate ? new Date(i.ReleaseDate) : null,
		DebutDate: i.DebutDate ? new Date(i.DebutDate) : null,
	}
}

export function convertTrackInfo(i: TrackInfo): ServerTrackInfo {
	return {
		...i,
		Created: i.Created?.toISOString(),
		PrereleaseDate: i.PrereleaseDate?.toISOString(),
		ReleaseDate: i.ReleaseDate?.toISOString(),
		DebutDate: i.DebutDate?.toISOString(),
	}
}

export type ReleaseScheduleItem = {
	Id: string
	NumReleases: number
	DayOfWeek: number
	BrandId: number

	// From view / join table
	LabelId: string
	LabelTitle: string
	BrandTitle: string
}

export type MissingReleaseOnSchedule = ReleaseScheduleItem & {
	Date: Date
	NumMissingReleases: number
}

export type ReleaseStatus = {
	Info: {
		Errors: ValidationInfo[]
	}
	TracksComplete: boolean
	//TODO: Encoding
	//TODO:  Distribution:
}

export type ReleasePrivateLink = {
	Id: string
	ReleaseId: string
	Description: string
	Code: string
	Created: Date

	Tracks: ReleasePrivateLinkTrack[]
}

export type ServerReleasePrivateLink = {
	Id: string
	ReleaseId: string
	Description: string
	Code: string
	Created: string

	Tracks: ReleasePrivateLinkTrack[]
}

export function convertServerReleasePrivateLink(l: ServerReleasePrivateLink): ReleasePrivateLink {
	return {
		...l,
		Created: l.Created ? new Date(l.Created) : null,
	}
}

export type ReleasePrivateLinkTrack = {
	LinkId: string
	TrackId: string
	Downloadable: boolean
	Viewable: boolean

	// From join
	TrackTitle: string
}

export type DistributorInfo = {
	ReleaseId: string
	DistributorId: string
	Title: string
	DeliveryMethod: string
	UploadedId: string
	UploadedDate: Date
	Status: DDEXStatus
	UploaderId: string
}

export type ServerDistributorInfo = {
	ReleaseId: string
	DistributorId: string
	Title: string
	DeliveryMethod: string
	UploadedId: string
	UploadedDate: string
	Status: DDEXStatus
	UploaderId: string
}

export function convertServerDistributorInfo(i: ServerDistributorInfo): DistributorInfo {
	return {
		...i,
		UploadedDate: i.UploadedDate? new Date(i.UploadedDate): null,
	}
}

export function convertDistributorInfo(i: DistributorInfo): ServerDistributorInfo {
	return {
		...i,
		UploadedDate: i.UploadedDate?.toISOString(),
	}
}