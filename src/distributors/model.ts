import {Label} from "../labels/model";

export enum DistributorAudioFormat {
	WAV = "WAV",
	MP3 = "MP3"
}

export enum DeliveryMechanism {
	FTP = "FTP",
	FTPOverTLS = "FTPOverTLS",
	SFTPWithPassword = "SFTPWithPassword",
	SFTPWithKey = "SFTPWithKey"
}

export enum DDEXStatus {
	AwaitingDelivery = "Awaiting Delivery",
	Queued = "Queued",
	Canceled = "Canceled",
	InProgress = "In Progress",
	Delivered = "Delivered",
	TakenDown = "Taken Down",
	Skipped = "Skipped",
	Error = "Error"
}

export type Distributor = {
	Title: string
	Id: string
	DPId: string
	AutoDelivery: boolean
	AutoDeliveryInterval: number
	AutoDeliveryUnit: string // Unit types same as postgres interval units
	AudioFormat: DistributorAudioFormat
	DeliveryMechanism: DeliveryMechanism
	DisplayArtistNameMatch: string
	DisplayArtistNameOverride: string
	LabelId: string
	LabelGroupId: string
	LabelTitle: string
	UPCFolders: boolean
	UpdateIndicator: boolean
	Mead: boolean
	Username: string
	Host: string
	Password: string
	RootFolder: string
	ReceivingName: string
	Deals: Deal[]
}

export type Deal = {
	Usages: string[]
	IncludedTerritoryCodes: string[]
	ExcludedTerritoryCodes: string[]
	CommercialModelType: string
	PriceInformations: PriceInformation[]
}

export type PriceInformation = {
	Description: string
	PriceRangeType: string
	PriceType: string
	WholesalePricePerUnit: string
	BulkOrderWholesalePricePerUnit: string
	CurrencyCode: string
}

export type ServerDDEXBatch = {
	Id: string
	Bulk: boolean
	Created: string
	DistributorId: string
	ErrorMessage: string
	UploadedFiles: number
	Status: DDEXStatus
	Takedown: boolean
	Title: string
	TotalFiles: number
	UploaderId: string
	LastActivity: string

	ReleaseIds: string[]
}

export type DDEXBatch = {
	Id: string
	Bulk: boolean
	Created: Date
	DistributorId: string
	ErrorMessage: string
	UploadedFiles: number
	Status: DDEXStatus
	Takedown: boolean
	Title: string
	TotalFiles: number
	UploaderId: string
	LastActivity: Date

	ReleaseIds: string[]
}

export type ServerPendingBatchUpload = PendingBatchReleaseInfo & {
	Created: string
	DistributorId: string
	GroupId: string
	PendingBatchReleaseInfo
}

export type PendingBatchUpload = PendingBatchReleaseInfo & {
	Created: Date
	DistributorId: string
	GroupId: string
	PendingBatchReleaseInfo
}

export type PendingBatchReleaseInfo = {
	UPC: string
	MissingISRCs: boolean
	MissingMP3s: boolean
	MissingWAVs: boolean
	EmptyTrackDurations: boolean
	MissingAudioFiles: boolean
	TrackGaps: boolean
	MissingCoverFile: boolean
	MissingCatalogId: boolean
	MissingGrid: boolean
	Valid: boolean
	ReleaseTitle: string
	ReleaseId: string
}

export function convertServerDDEXBatch(b: ServerDDEXBatch): DDEXBatch {
	return {
		...b,
		Created: b.Created? new Date(b.Created): null,
		LastActivity: new Date(b.LastActivity)
	}
}

export function convertDDEXBatch(b: DDEXBatch): ServerDDEXBatch {
	return {
		...b,
		Created: b.Created.toISOString(),
		LastActivity: b.LastActivity.toISOString(),
	}
}