import { LabelManagerApi, LockStatus, Paginated, Query } from "../types";
import { convertTrack, PerformanceType, ServerTrack, Track, TrackPreview, TrackVersion } from "./model";
import { LabelBrand } from "../labels/model";
import { DataType, ServerAsset } from "../assets/model";
import { ServerFile } from "../files/model";
import { ServerTrackContract } from "../contracts/model";
import { ServerRelease } from "../releases/model";
import { ArtistInfo } from "../artists/model";
import { generateFilePublicLink, getFiles, getFileVersions, updateFile, UpdateFilePayload } from "../files";

export type GetTracksResponse = {
	Tracks: Paginated<ServerTrack>;
	Brands: LabelBrand[];
};

export type GetTrackResponse = {
	Track: Track;
	Asset: ServerAsset;
	Brands: LabelBrand[];
	FileInfo: ServerFile;
	PerformanceTypes: PerformanceType[];
	PrimaryGenres: string[];
	SecondaryGenres: string[];
	TrackVersions: TrackVersion[];
	Contracts: ServerTrackContract[];
	Releases: ServerRelease[];
	DataTypes: DataType[];
};

export class TracksApi extends LabelManagerApi {

	public async getTracks(query: Query): Promise<GetTracksResponse> {
		const resp = await this.client.get<GetTracksResponse>("/tracks", { params: query });
		return resp.data;
	}

	public async getTrack(id: string): Promise<GetTrackResponse> {
		const resp = await this.client.get<GetTrackResponse>("/track/" + id);
		return resp.data;
	}

	public trackWavUri(id: string, download?: boolean): string {
		return `${this.client.defaults.baseURL}/track/${id}/wav${download ? "?download=true" : ""}`;
	}

	public async getTrackSha1(id: string): Promise<string> {
		type Response = {
			Sha1: string;
		};
		const resp = await this.client.get<Response>(`/track/${id}/sha1`);
		return resp.data.Sha1;
	}

	/**
	 * Get track Md5 sum
	 * @param id Track ID
	 * @returns Md5 as string
	 */
	public async getTrackMd5(id: string): Promise<string> {
		type Response = {
			Md5: string;
		};
		const resp = await this.client.get<Response>(`/track/${id}/md5`);
		return resp.data.Md5;
	}

	public async addTracksTags(ids: string[], tags: string[]) {
		await this.client.post('/tracks/tags', { Ids: ids, Tags: tags });
	}

	/**
	 * Creates a new track. For adding artists if you leave the 'Platform' field blank it assumes world wide.
	 * @param track Track data
	 * @returns Track ID
	 */
	public async createTrack(track: Track): Promise<string> {
		type Response = {
			TrackId: string;
		};
		const resp = await this.client.post<Response>("/track", { Track: convertTrack(track) });
		return resp.data.TrackId;
	}

	public async updateTrack(track: Track) {
		if (!track.Id) return;
		await this.client.post(`/track/${track.Id}`, { Track: convertTrack(track) });
	}

	public async updateTrackLock(trackId: string, newStatus: LockStatus) {
		if (!trackId) return;
		await this.client.post(`/track/${trackId}/lock`, { Track: { LockStatus: newStatus } });
	}

	public async clearTrackFugaId(trackId: string) {
		await this.client.post(`/track/${trackId}/clear-fuga-id`);
	}

	public async deleteTrackWav(id: string) {
		if (!id) return;
		await this.client.post(`/track/${id}/wav/delete`);
	}

	public async deleteTrack(id: string) {
		if (!id) return;
		await this.client.post(`/track/${id}/delete`);
	}

	public async generateArtistTitle(artistInfos: ArtistInfo[]): Promise<string> {
		type Response = {
			ArtistsTitlePreview: string;
		};
		const resp = await this.client.post<Response>(`/generate-artist-title`, {
			Artists: artistInfos
		});
		return resp.data.ArtistsTitlePreview;
	}

	// TODO: zip tracks is missing, because POST streaming is disallowed by XHR. We will need to find a soluation for this.
	public async getTrackPreviews(id: string): Promise<TrackPreview[]> {
		type Response = {
			Previews: TrackPreview[];
		};
		const resp = await this.client.get<Response>(`/track/${id}/previews`);
		return resp.data.Previews;
	}

	public async createTrackPreview(id: string): Promise<TrackPreview> {
		type Response = {
			Preview: TrackPreview;
		};
		const resp = await this.client.post<Response>(`/track/${id}/preview`);
		return resp.data.Preview;
	}

	public async updateTrackPreview(id: string, preview: TrackPreview) {
		await this.client.post(`/track/${id}/preview/${preview.Id}`, {
			Preview: preview,
		});
	}

	public async deleteTrackPreview(trackId: string, previewId: string) {
		await this.client.post(`/track/${trackId}/preview/${previewId}/delete`);
	}

	public async getTrackFiles(trackId: string): Promise<Paginated<ServerFile>> {
		return await getFiles(this.client, `/track/${trackId}/files`);
	}

	public downloadBatchFilesUri(trackId: string, fileIds: string[]): string {
		return encodeURI(`${this.client.defaults.baseURL}/track/${trackId}/files/download?file-ids=${fileIds.join(",")}`);
	}

	public async getTrackFileVersions(trackId: string, fileId: string): Promise<ServerFile[]> {
		return await getFileVersions(this.client, `/track/${trackId}/file/${fileId}/versions`);
	}

	// Updates the filename and tags
	public async updateTrackFileData(trackId: string, fileId: string, p: UpdateFilePayload) {
		await updateFile(this.client, `/track/${trackId}/file/${fileId}`, p);
	}

	public async deleteTrackFile(trackId: string, fileId: string) {
		await this.client.post(`/track/${trackId}/file/${fileId}/delete`);
	}

	public downloadTrackFileUri(trackId: string, fileId: string): string {
		return `${this.client.defaults.baseURL}/track/${trackId}/file/${fileId}/download`;
	}

	public async generateFilePublicLink(trackId: string, fileId: string): Promise<string> {
		return await generateFilePublicLink(this.client, `/track/${trackId}/file/${fileId}/public-link`);
	}

	public filePreviewUri(trackId: string, fileId: string): string {
		return `${this.client.defaults.baseURL}/track/${trackId}/file/${fileId}/preview`;
	}

	public async getTrackFileSha1(id: string, fileId: string): Promise<string> {
		type Response = {
			Sha1: string;
		};
		const resp = await this.client.get<Response>(`/track/${id}/file/${fileId}/sha1`);
		return resp.data.Sha1;
	}

	public async getTrackFileMd5(id: string, fileId: string): Promise<string> {
		type Response = {
			Md5: string;
		};
		const resp = await this.client.get<Response>(`/track/${id}/file/${fileId}/md5`);
		return resp.data.Md5;
	}

	// TODO: track wav upload
	// TODO: track file upload
}


export default TracksApi;