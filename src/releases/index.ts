import {Client, LockStatus, Paginated, Query, ValidationInfo} from "../types"
import {
	MissingReleaseOnSchedule,
	Release,
	ReleaseType,
	ServerRelease,
	ReleaseStatus,
	convertServerRelease,
	ReleasePrivateLink,
	DistributorInfo,
	ServerDistributorInfo,
	convertServerDistributorInfo,
	convertRelease, TrackInfo, convertDistributorInfo
} from "./model"
import {Label, LabelBrand} from "../labels/model"
import {DataType, ServerAsset} from "../assets/model"
import {ServerArtist} from "../artists/model"
import {applyImageOptionsToBase, ImageOptions, ServerFile, SignedUrlInfo} from "../files/model"
import {
	generateFilePublicLink,
	getFiles,
	getFileVersions,
	getSignedUrlInfo,
	updateFile,
	UpdateFilePayload
} from "../files"
import {
	convertServerTrackEncoding,
	convertServerTrackInfoComplete, ServerTrackEncoding,
	ServerTrackInfoComplete, Track,
	TrackAudioFormat, TrackEncoding,
	TrackInfoComplete
} from "../tracks/model"
import {DDEXBatch, Deal} from "../distributors/model"

export type GetReleasesPayload = {
	Brands: LabelBrand[]
	Releases: Paginated<ServerRelease>
}

export type GetReleaseCalendarPayload = {
	Calendar: Paginated<ServerRelease>
	MissingReleases: MissingReleaseOnSchedule[]
	Brands: LabelBrand[]
}

export type GetReleasePayload = {
	Release: Release
	Asset: ServerAsset // TODO: convert to asset
	Artists: ServerArtist[] // TODO: convert to artist
	Label: Label
	Brands: LabelBrand[],
	PrimaryGenres: string[]
	ReleaseTypes: ReleaseType[]
	SecondaryGenres: string[]
	ReleaseStatus: ReleaseStatus
	ReleasesStatus: {
		[key: string]: {
			Errors: ValidationInfo[]
		}
	}
	DataTypes: DataType[]
}

export type ReleasePrivateLinkResponse = {
	Release: Release
	Link: ReleasePrivateLink
}

export type GetReleaseDistributorsResponse = {
	Release: Release
	Distributors: DistributorInfo[]
}

export type TrackInfoPayload = {
	TrackId: string
	TrackNumber: number
	Starred: boolean
	IsTagusChild: boolean
	Flag: string
	PrereleaseDate?: Date
	ReleaseDate?: Date
}

export type ReleaseDistributorDealsResponse = {
	Deals: Deal
	Usages: string[]
	CommercialModelTypes: string[]
}

export default function ReleasesApi(client: Client) {
	return {
		async getReleases(query: Query): Promise<GetReleasesPayload> {
			const resp = await client.get<GetReleasesPayload>("/releases", {params: query})
			return resp.data
		},
		async updateTagsForReleases(ids: string[], tags: string[]) {
			await client.post(`/releases/tag`, {
				Ids: ids,
				Tags: tags,
			})
		},
		async getReleaseCalendar(q: Query): Promise<GetReleaseCalendarPayload> {
			const resp = await client.get<GetReleaseCalendarPayload>("/release-calendar", {params: q})
			return resp.data
		},
		async getReleaseCalendarMissingSchedules(q: Query): Promise<Paginated<MissingReleaseOnSchedule>> {
			type Response = {
				MissingSchedules: Paginated<MissingReleaseOnSchedule>
			}
			const resp = await client.get<Response>(`/release-calendar/missing-schedules`, {params: q})
			return resp.data.MissingSchedules
		},
		async getScheduledBrands(): Promise<LabelBrand[]> {
			type Response = {
				Brands: LabelBrand[]
			}
			const resp = await client.get<Response>(`/release-calendar/schedule-brands`)
			return resp.data.Brands
		},
		async getRelease(id: string): Promise<GetReleasePayload> {
			type Response = {
				Release: ServerRelease
				Asset: ServerAsset
				Artists: ServerArtist[]
				Label: Label
				Brands: LabelBrand[],
				PrimaryGenres: string[]
				ReleaseTypes: ReleaseType[]
				SecondaryGenres: string[]
				ReleaseStatus: ReleaseStatus
				ReleasesStatus: {
					[key: string]: {
						Errors: ValidationInfo[]
					}
				}
				DataTypes: DataType[]
			}
			const resp = await client.get<Response>("/release/" + id)
			return {
				...resp.data,
				Release: convertServerRelease(resp.data.Release)
			}
		},
		async getReleaseFiles(id: string): Promise<Paginated<ServerFile>> {
			return await getFiles(client, `/release/${id}/files`)
		},
		downloadBatchFilesUri(releaseId: string, fileIds: string[]): string {
			return encodeURI(`${client.defaults.baseURL}/release/${releaseId}/files/download?file-ids=${fileIds.join(",")}`)
		},
		async getReleaseFileVersions(releaseId: string, fileId: string): Promise<ServerFile[]> {
			return await getFileVersions(client, `/release/${releaseId}/file/${fileId}/versions`)
		},
		// Updates the filename and tags
		async updateReleaseFileData(releaseId: string, fileId: string, p: UpdateFilePayload) {
			await updateFile(client, `/release/${releaseId}/file/${fileId}`, p)
		},
		async deleteReleaseFile(releaseId: string, fileId: string) {
			await client.post(`/release/${releaseId}/file/${fileId}/delete`)
		},
		downloadReleaseFileUri(releaseId: string, fileId: string): string {
			return `${client.defaults.baseURL}/release/${releaseId}/file/${fileId}/download`
		},
		async generateFilePublicLink(releaseId: string, fileId: string): Promise<string> {
			return await generateFilePublicLink(client, `/release/${releaseId}/file/${fileId}/public-link`)
		},
		filePreviewUri(releaseId: string, fileId: string): string {
			return `${client.defaults.baseURL}/release/${releaseId}/file/${fileId}/preview`
		},
		async getReleaseFileSha1(id: string, fileId: string): Promise<string> {
			type Response = {
				Sha1: string
			}
			const resp = await client.get<Response>(`/release/${id}/file/${fileId}/sha1`)
			return resp.data.Sha1
		},
		async getReleaseFileMd5(id: string, fileId: string): Promise<string> {
			type Response = {
				Md5: string
			}
			const resp = await client.get<Response>(`/release/${id}/file/${fileId}/md5`)
			return resp.data.Md5
		},
		async getReleaseTracks(id: string): Promise<TrackInfoComplete[]> {
			type Response = {
				Tracks: ServerTrackInfoComplete[]
			}
			const resp = await client.get<Response>(`/release/${id}/tracks`)
			return resp.data.Tracks?.map(convertServerTrackInfoComplete)
		},
		async getReleaseSimplified(id: string): Promise<Release> {
			type Response = {
				Release: ServerRelease
			}
			const resp = await client.get<Response>(`/release/${id}`)
			return convertServerRelease(resp.data.Release)
		},
		async getReleaseByPrivateLink(code: string): Promise<ReleasePrivateLinkResponse> {
			return (await client.get<ReleasePrivateLinkResponse>(`/private-link/${code}`)).data
		},
		downloadReleaseByPrivateLinkUri(code: string): string {
			return `${client.defaults.baseURL}/private-link/${code}/download`
		},
		downloadReleaseTrackByPrivateLinkUri(code: string, trackId: string): string {
			return `${client.defaults.baseURL}/private-link/${code}/track/${trackId}/download`
		},
		async updateReleasePrivateLink(code: string, link: ReleasePrivateLink) {
			await client.post(`/private-link/${code}`, {
				Link: link,
			})
		},
		async regenerateReleasePrivateLink(code: string): Promise<string> {
			type Response = {
				Code: string
			}
			const resp = await client.post<Response>(`/private-link/${code}/regenerate`)
			return resp.data.Code
		},
		async deleteReleasePrivateLink(code: string) {
			await client.post(`/private-link/${code}/delete`)
		},
		async getReleasePrivateLinks(id: string, q: Query): Promise<Paginated<ReleasePrivateLink>> {
			type Response = {
				Links: Paginated<ReleasePrivateLink>
			}
			const resp = await client.get<Response>(`/release/${id}/private-links`, {
				params: q,
			})
			return resp.data.Links
		},
		async getReleaseDistributors(id: string): Promise<GetReleaseDistributorsResponse> {
			type Response = {
				Release: ServerRelease
				Distributors: ServerDistributorInfo[]
			}
			const resp = await client.get<Response>("/release/" + id + "/ddex")
			return {
				Release: convertServerRelease(resp.data.Release),
				Distributors: resp.data.Distributors?.map(convertServerDistributorInfo)
			}
		},
		releaseCoverUri(releaseId: string, o: ImageOptions): string {
			return applyImageOptionsToBase(`${client.defaults.baseURL}/release/${releaseId}/cover`, o)
		},
		async getReleaseCoverInfo(releaseId: string): Promise<SignedUrlInfo> {
			return await getSignedUrlInfo(client, `/release/${releaseId}/cover-info`)
		},
		async getReleaseTrackEncodingInfo(id: string, trackId: string, format: TrackAudioFormat): Promise<SignedUrlInfo> {
			return await getSignedUrlInfo(client, `/release/${id}/track-encoding/${trackId}`, {
				format,
			})
		},
		async getReleaseEncodings(id: string, format: TrackAudioFormat): Promise<TrackEncoding[]> {
			type Response = {
				Encodings: ServerTrackEncoding[]
			}
			const resp = await client.get<Response>("/release/" + id + "/encodings", {params: {format}})
			return resp.data?.Encodings?.map(convertServerTrackEncoding)
		},
		releaseEncodingsZipUri(releaseId: string, format: TrackAudioFormat): string {
			return `${client.defaults.baseURL}/release/${releaseId}/encoding?format=${format}`
		},
		async getReleaseTrackTags(id: string): Promise<string[]> {
			type Response = {
				Tags: string[]
			}
			const resp = await client.get<Response>(`/release/${id}/track-tags`)
			return resp.data.Tags
		},
		async createRelease(release: Release): Promise<string> {
			type Response = {
				ReleaseId: string
			}
			const resp = await client.post<Response>("/release", {Release: convertRelease(release)})
			return resp.data.ReleaseId
		},
		async updateRelease(release: Release) {
			if (!release.Id) return
			await client.post(`/release/${release.Id}`, {Release: convertRelease(release)})
		},
		async updateReleaseLockStatus(releaseId: string, newStatus: LockStatus) {
			if (!releaseId) return
			await client.post(`/release/${releaseId}/lock`, {Release: {LockStatus: newStatus}})
		},
		async addReleaseTrack(releaseId: string, track: TrackInfoPayload) {
			await client.post(`/release/${releaseId}/track?mode=add`, {
				TrackInfo: {
					...track,
					PrereleaseDate: track.PrereleaseDate?.toISOString(),
					ReleaseDate: track.ReleaseDate?.toISOString()
				}
			})
		},
		async updateReleaseTrack(releaseId: string, oldTrackId: string, track: TrackInfoPayload) {
			await client.post(`/release/${releaseId}/track?mode=update`, {
				TrackInfo: {
					...track,
					PrereleaseDate: track.PrereleaseDate?.toISOString(),
					ReleaseDate: track.ReleaseDate?.toISOString()
				}, OldTrackId: oldTrackId
			})
		},
		async removeReleaseTrack(releaseId: string, trackId: string) {
			await client.post(`/release/${releaseId}/track?mode=remove`, {oldTrackId: trackId})
		},
		async updateReleaseFlag(releaseId: string, flag: string) {
			await client.post(`/release/${releaseId}/flag`, {Flag: flag})
		},
		async clearReleaseFugaId(releaseId: string) {
			await client.post(`/release/${releaseId}/clear-fuga-id`)
		},
		async deleteRelease(id: string) {
			if (!id) return
			await client.post(`/release/${id}/delete`)
		},
		async uploadCoverFile(releaseId: string, file: File) {
			if (!releaseId) return
			const data = new FormData()
			data.append('cover', file)
			await client.post(`/release/${releaseId}/cover`, data)
		},
		async deleteCoverImage(releaseId: string) {
			if (!releaseId) return
			await client.post(`/release/${releaseId}/cover/delete`)
		},
		async encodeRelease(releaseId: string) {
			await client.post(`/release/${releaseId}/encode`)
		},
		async encodeReleaseTrack(releaseId: string, trackId: string) {
			await client.post(`/release/${releaseId}/encode-one/${trackId}`)
		},
		async encodeReleaseStreamingPreview(releaseId: string) {
			await client.post(`/release/${releaseId}/prepare`)
		},
		async encodeReleaseTrackStreamingPreview(releaseId: string, trackId: string) {
			await client.post(`/release/${releaseId}/prepare-one/${trackId}`)
		},
		async getReleaseDistributorLogs(id: string, distId: string): Promise<Paginated<DDEXBatch>> {
			type Response = {
				Logs: Paginated<DDEXBatch>
			}
			const resp = await client.get<Response>(`/release/${id}/distributor/${distId}/logs`)
			return resp.data.Logs
		},
		async sendToDistributors(releaseId: string, distributorIds?: string[]) {
			await client.post(`/release/${releaseId}/distribute-ddex`, distributorIds?.map(id => ({
				DistributorId: id,
			})))
		},
		async takedownFromDistributor(releaseId: string, distributorIds?: string[]) {
			await client.post(`/release/${releaseId}/takedown-ddex`, distributorIds?.map(id => ({
				DistributorId: id,
			})))
		},
		async createReleasePrivateLink(id: string, link: ReleasePrivateLink): Promise<string> {
			type Response = {
				Code: string
			}
			const resp = await client.post<Response>(`/release/${id}/private-link`, {
				Link: link,
			})
			return resp.data.Code
		},
		async updateReleaseDistributors(id: string, distributors: DistributorInfo[]) {
			await client.post("/release/" + id + "/ddex-distributors", distributors.map(convertDistributorInfo))
		},
		async getReleaseDistributorDeals(id: string, distId: string): Promise<ReleaseDistributorDealsResponse> {
			const resp = await client.get<ReleaseDistributorDealsResponse>(`/release/${id}/distributor/${distId}/deals`)
			return resp.data
		},
		async setReleaseDistributorDeals(id: string, distId: string, deals: Deal[]) {
			await client.post(`/release/${id}/distributor/${distId}/deals`, {Deals: deals})
		},
	}
}