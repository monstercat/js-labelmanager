import {ServerArtist} from "../artists/model"
import {ServerLink, ValidationInfo} from "../types"
import {convertServerTrackContract, convertTrackContract, ServerTrackContract, TrackContract} from "../contracts/model"
import {ServerAsset} from "../assets/model"
import {WriterTerritory} from "../writers/model"
import {ServerFile} from "../files/model"

export enum PerformanceType {
	Instrumental = "Instrumental",
	Vocal = "Vocal"
}

export enum TrackVersion {
	AcousticMix = "Acoustic Mix",
	Cover = "Cover",
	ExtendedMix = "Extended Mix",
	InstrumentalMix = "Instrumental Mix",
	Original = "Original",
	RadioEdit = "Radio Edit",
	Remix = "Remix",
	Vip = "Vip",
}

export enum TrackAudioFormat {
	MP3 = "MP3_320",
	MP3_NC = "MP3_320_NC",
	FLAC = "FLAC",
	WAV = "WAV"
}

export type ServerTrack = {
	ArtistTitle: string,
	Artists: ServerArtist[],
	AudioLanguage: string,
	BPM: number,
	Brand: string,
	BrandId: number,
	ContractuallySatisfiedUntil: string,
	Created: string,
	CreatedById: string,
	CreatedByName: string,
	CreatorFriendly: boolean,
	DebutDate: string,
	Duration: number,
	Explicit: boolean,
	FugaId: number,
	GenrePrimary: string,
	GenreSecondary: string,
	ISRC: string,
	ISWC: string,
	Id: string,
	LabelDefaultTimezone: string,
	LabelId: string,
	LabelTitle: string,
	LockStatus: string,
	Lyrics: string,
	LyricsLanguage: string,
	Notes: string,
	OwnedCommercially: boolean,
	PerformanceType: string,
	PreviewLength: string,
	PreviewStart: string,
	Public: boolean,
	SpotifyId: string,
	SyncRights: boolean,
	Tags: string[],
	TagusId: number,
	Title: string,
	TrackInfoErrors?: [],
	Version: string,
	WavFileId: string,

	ArtistsInfo: ArtistsInfo[]
	Contracts: ServerTrackContract[]
	Releases: ServerReleaseInfo[]
	TagusAsset: ServerAsset
	Writers: WriterInfo[]
}

export type Track = {
	ArtistTitle: string,
	Artists: ServerArtist[],
	AudioLanguage: string,
	BPM: number,
	Brand: string,
	BrandId: number,
	ContractuallySatisfiedUntil: string,
	Created: Date,
	CreatedById: string,
	CreatedByName: string,
	CreatorFriendly: boolean,
	DebutDate: Date,
	Duration: number,
	Explicit: boolean,
	FugaId: number,
	GenrePrimary: string,
	GenreSecondary: string,
	ISRC: string,
	ISWC: string,
	Id: string,
	LabelDefaultTimezone: string,
	LabelId: string,
	LabelTitle: string,
	LockStatus: string,
	Lyrics: string,
	LyricsLanguage: string,
	Notes: string,
	OwnedCommercially: boolean,
	PerformanceType: string,
	PreviewLength: string,
	PreviewStart: string,
	Public: boolean,
	SpotifyId: string,
	SyncRights: boolean,
	Tags: string[],
	TagusId: number,
	Title: string,
	TrackInfoErrors?: [],
	Version: string,
	WavFileId: string,

	ArtistsInfo: ArtistsInfo[]
	Contracts: TrackContract[]
	Releases: ReleaseInfo[]
	TagusAsset: ServerAsset
	Writers: WriterInfo[]
}

export function convertServerTrack(t: ServerTrack): Track {
	return {
		...t,
		Created: t.Created ? new Date(t.Created) : null,
		DebutDate: t.DebutDate ? new Date(t.DebutDate) : null,
		Contracts: t.Contracts?.map(convertServerTrackContract),
		Releases: t.Releases?.map(convertServerReleaseInfo)
	}
}

export function convertTrack(t: Track): ServerTrack {
	return {
		...t,
		Created: t.Created?.toISOString(),
		DebutDate: t.DebutDate?.toISOString(),
		Contracts: t.Contracts?.map(convertTrackContract),
		Releases: t.Releases?.map(convertReleaseInfo)
	}
}

export type ArtistsInfo = {
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

export type ReleaseInfo = {
	CatalogId: string
	PrereleaseDate: Date
	ReleaseBrand: string
	ReleaseDate: Date
	ReleaseDateTimezone: string
	ReleaseId: string
	ReleaseType: string
	ReleaseVersion: string
	Title: string
	TrackNumber: number
	TrackId: string
	UPC: string
}

export type ServerReleaseInfo = {
	CatalogId: string
	PrereleaseDate: string
	ReleaseBrand: string
	ReleaseDate: string
	ReleaseDateTimezone: string
	ReleaseId: string
	ReleaseType: string
	ReleaseVersion: string
	Title: string
	TrackNumber: number
	TrackId: string
	UPC: string
}

export function convertServerReleaseInfo(r: ServerReleaseInfo): ReleaseInfo {
	return {
		...r,
		PrereleaseDate: r.PrereleaseDate ? new Date(r.PrereleaseDate) : null,
		ReleaseDate: r.ReleaseBrand ? new Date(r.ReleaseDate) : null
	}
}

export function convertReleaseInfo(r: ReleaseInfo): ServerReleaseInfo {
	return {
		...r,
		PrereleaseDate: r.PrereleaseDate?.toISOString(),
		ReleaseDate: r.ReleaseDate?.toISOString(),
	}
}

export type WriterInfo = {
	PublisherId: string
	PublisherShare: string
	Territories: WriterTerritory[]
	WriterId: string
	WriterRole: string
	WriterShare: string

	// This is filled by join tables.
	// Select should ignore these.
	WriterAssociation?: string
	PublisherAssociation?: string
	PublisherName?: string
	WriterIPI?: string
	WriterName?: string
}

export type TrackPreview = {
	Id: string
	TrackId: string
	Timestamp: number
	IsDefault: boolean
	Caption: string
}

export type TrackInfoComplete = Track & {
	// From join
	ReleaseId: string
	TrackNumber: number
	Encodings: string[]
	IsTagusChild: boolean
	ReleaseDate: Date
	Starred: boolean
	Flag: string

	// Added afterwards.
	Errors: ValidationInfo[]
}

export type ServerTrackInfoComplete = ServerTrack & {
	// From join
	ReleaseId: string
	TrackNumber: number
	Encodings: string[]
	IsTagusChild: boolean
	ReleaseDate: string
	Starred: boolean
	Flag: string

	// Added afterwards.
	Errors: ValidationInfo[]
}

export function convertServerTrackInfoComplete(i: ServerTrackInfoComplete): TrackInfoComplete {
	return {
		...i,
		...convertServerTrack(i),
		ReleaseDate: i.ReleaseDate ? new Date(i.ReleaseDate) : null,
	}
}

export type TrackEncoding = {
	Id: string
	Date: Date
	TrackId: string
	ReleaseId: string
	Status: string
	Log: string
	ProcessId: string
	FileId: string
	WavFileId: string
	Sha1Hash: string
	Filename: string
	Mime: string
	Public: boolean
	File: ServerFile
}

export type ServerTrackEncoding = {
	Id: string
	Date: string
	TrackId: string
	ReleaseId: string
	Status: string
	Log: string
	ProcessId: string
	FileId: string
	WavFileId: string
	Sha1Hash: string
	Filename: string
	Mime: string
	Public: boolean
	File: ServerFile
}

export function convertServerTrackEncoding(t: ServerTrackEncoding): TrackEncoding {
	return {
		...t,
		Date: t.Date? new Date(t.Date): null,
	}
}