import {Client} from "../types"

export type SignedUrlInfo = {
	SignedUrl: string,
	Expires: string
}

export type ServerFile = {
	Created: string
	DiskPath: string
	Filepath: string
	Filename: string
	Id: string
	Sha1Sum: string
	Status: string
	UploaderId: string
	Public: boolean
	Tags: string[]

	Sort?: number
	UploaderName?: string
}

export type ImageOptions = {
	imageWidth?: number
	download?: boolean
}

export function imageOptionsToQueryString(options: ImageOptions): string {
	return [
		options.imageWidth && `imageWidth=${options.imageWidth}`,
		options.download && "download=true"
	].filter(v => !!v).join("&")
}

export function applyImageOptionsToBase(base: string, options?: ImageOptions): string {
	if (!options || Object.keys(options).length == 0) return base
	const opts = imageOptionsToQueryString(options)
	if (!opts) return base
	return base + "?" + opts
}
