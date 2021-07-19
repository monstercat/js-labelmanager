import {Client, LockStatus, Paginated, Query} from "../types"
import {convertTrack, PerformanceType, ServerTrack, Track, TrackAudioFormat, TrackPreview, TrackVersion} from "./model"
import {LabelBrand} from "../labels/model"
import {DataType, ServerAsset} from "../assets/model"
import {ServerFile} from "../files/model"
import {ServerTrackContract} from "../contracts/model"
import {ServerRelease} from "../releases/model"
import {ArtistInfo} from "../artists/model"
import {generateFilePublicLink, getFiles, getFileVersions, updateFile, UpdateFilePayload} from "../files"

export type GetTracksResponse = {
	Tracks: Paginated<ServerTrack>
	Brands: LabelBrand[]
}

export type GetTrackResponse = {
	Track: Track
	Asset: ServerAsset
	Brands: LabelBrand[]
	FileInfo: ServerFile
	PerformanceTypes: PerformanceType[]
	PrimaryGenres: string[]
	SecondaryGenres: string[]
	TrackVersions: TrackVersion[]
	Contracts: ServerTrackContract[]
	Releases: ServerRelease[]
	DataTypes: DataType[]
}

export default function TracksApi(client: Client) {
	return {
		async getTracks(query: Query): Promise<GetTracksResponse> {
			const resp = await client.get<GetTracksResponse>("/tracks", {params: query})
			return resp.data
		},
		async getTrack(id: string): Promise<GetTrackResponse> {
			const resp = await client.get<GetTrackResponse>("/track/" + id)
			return resp.data
		},
		trackWavUri(id: string, download?: boolean): string {
			return `${client.defaults.baseURL}/track/${id}/wav${download ? "?download=true" : ""}`
		},
		async getTrackSha1(id: string): Promise<string> {
			type Response = {
				Sha1: string
			}
			const resp = await client.get<Response>(`/track/${id}/sha1`)
			return resp.data.Sha1
		},
		async getTrackMd5(id: string): Promise<string> {
			type Response = {
				Md5: string
			}
			const resp = await client.get<Response>(`/track/${id}/md5`)
			return resp.data.Md5
		},
		async addTracksTags(ids: string[], tags: string[]) {
			await client.post('/tracks/tags', {Ids: ids, Tags: tags})
		},
		// Notes:  Creates a new track. For adding artists if you leave the 'Platform' field blank it assumes world wide.
		async createTrack(track: Track): Promise<string> {
			type Response = {
				TrackId: string
			}
			const resp = await client.post<Response>("/track", {Track: convertTrack(track)})
			return resp.data.TrackId
		},
		async updateTrack(track: Track) {
			if (!track.Id) return
			await client.post(`/track/${track.Id}`, {Track: convertTrack(track)})
		},
		async updateTrackLock(trackId: string, newStatus: LockStatus) {
			if (!trackId) return
			await client.post(`/track/${trackId}/lock`, {Track: {LockStatus: newStatus}})
		},
		async clearTrackFugaId(trackId: string) {
			await client.post(`/track/${trackId}/clear-fuga-id`)
		},
		async deleteTrackWav(id: string) {
			if (!id) return
			await client.post(`/track/${id}/wav/delete`)
		},
		async deleteTrack(id: string) {
			if (!id) return
			await client.post(`/track/${id}/delete`)
		},
		async generateArtistTitle(artistInfos: ArtistInfo[]) : Promise<string> {
			type Response = {
				ArtistsTitlePreview: string
			}
			const resp = await client.post<Response>(`/generate-artist-title`, {
				Artists: artistInfos
			})
			return resp.data.ArtistsTitlePreview
		},
		// TODO: zip tracks is missing, because POST streaming is disallowed by XHR. We will need to find a soluation for this.
		async getTrackPreviews(id: string): Promise<TrackPreview[]> {
			type Response = {
				Previews: TrackPreview[]
			}
			const resp = await client.get<Response>(`/track/${id}/previews`)
			return resp.data.Previews
		},
		async createTrackPreview(id: string, preview: TrackPreview): Promise<TrackPreview> {
			type Response = {
				Preview: TrackPreview
			}
			const resp = await client.post<Response>(`/track/${id}/preview`)
			return resp.data.Preview
		},
		async updateTrackPreview(id: string, preview: TrackPreview) {
			await client.post(`/track/${id}/preview/${preview.Id}`, {
				Preview: preview,
			})
		},
		async deleteTrackPreview(trackId: string, previewId: string) {
			await client.post(`/track/${trackId}/preview/${previewId}/delete`)
		},
		async getTrackFiles(trackId: string) : Promise<Paginated<ServerFile>>{
			return await getFiles(client, `/track/${trackId}/files`);
		},
		downloadBatchFilesUri(trackId: string, fileIds: string[]) : string {
			return encodeURI(`${client.defaults.baseURL}/track/${trackId}/files/download?file-ids=${ fileIds.join(",") }`)
		},
		async getTrackFileVersions(trackId: string, fileId: string): Promise<ServerFile[]> {
			return await getFileVersions(client, `/track/${trackId}/file/${fileId}/versions`)
		},
		// Updates the filename and tags
		async updateTrackFileData(trackId: string, fileId: string, p: UpdateFilePayload) {
			await updateFile(client, `/track/${trackId}/file/${fileId}`, p)
		},
		async deleteTrackFile(trackId: string, fileId: string) {
			await client.post(`/track/${trackId}/file/${fileId}/delete`)
		},
		downloadTrackFileUri(trackId: string, fileId: string): string {
			return `${client.defaults.baseURL}/track/${trackId}/file/${fileId}/download`
		},
		async generateFilePublicLink(trackId: string, fileId: string): Promise<string> {
			return await generateFilePublicLink(client, `/track/${trackId}/file/${fileId}/public-link`)
		},
		filePreviewUri(trackId: string, fileId: string) : string {
			return `${client.defaults.baseURL}/track/${trackId}/file/${fileId}/preview`
		},
		async getTrackFileSha1(id: string, fileId: string): Promise<string> {
			type Response = {
				Sha1: string
			}
			const resp = await client.get<Response>(`/track/${id}/file/${fileId}/sha1`)
			return resp.data.Sha1
		},
		async getTrackFileMd5(id: string, fileId: string): Promise<string> {
			type Response = {
				Md5: string
			}
			const resp = await client.get<Response>(`/track/${id}/file/${fileId}/md5`)
			return resp.data.Md5
		},

		// TODO: track wav upload
		// TODO: track file upload
	}
}