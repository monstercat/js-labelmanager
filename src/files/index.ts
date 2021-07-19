import {Client, Paginated, Query} from "../types"
import {ServerFile, SignedUrlInfo} from "./model"

export type FileSortUpdate = {
	Id: string
	Sort: number
}

export async function getSignedUrlInfo(client: Client, url: string, q?: Query) : Promise<SignedUrlInfo>{
	return (await client.get<SignedUrlInfo>(url, {params: q})).data
}

export async function addFile(client: Client, url: string, file: File) {
	const data = new FormData()
	data.append("file", file)
	await client.post(url, data)
}

export async function getFiles(client: Client, url: string): Promise<Paginated<ServerFile>> {
	type Response = {
		Files: Paginated<ServerFile>
	}
	return (await client.get<Response>(url)).data.Files
}

export async function updateFileSort(client: Client, url: string, files: FileSortUpdate[]) {
	await client.post(url, {
		Files: files,
	})
}

export async function getFileVersions(client: Client, url: string): Promise<ServerFile[]> {
	type Response = {
		Files: ServerFile[]
	}
	return (await client.get<Response>(url)).data.Files
}

export type UpdateFilePayload = {
	Filename: string
	Tags: string[]
}

export async function updateFile(client: Client, url: string, p: UpdateFilePayload)  {
	await client.post(url, {
		File: p,
	})
}

export async function generateFilePublicLink(client: Client, url: string): Promise<string> {
	type Response = {
		Key: string
	}
	return (await client.get<Response>(url)).data.Key
}