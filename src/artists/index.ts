import {Client, Paginated, Access, Query} from "../types"
import {ArtistImageType, ServerArtist, ServerArtistRelationship} from "./model"
import {LabelBrand} from "../labels/model"
import {GetTracksResponse} from "../tracks"
import {ServerTrack} from "../tracks/model"
import {applyImageOptionsToBase, ImageOptions, SignedUrlInfo} from "../files/model"
import {getSignedUrlInfo} from "../files"
import {ServerEvent} from "../events/model"

export type GetArtistResponse = {
	Artist: ServerArtist
	MyAccess: Access
}

export type GetArtistTracksResponse = {
	Tracks: Paginated<ServerTrack & { Featured: boolean }>
	Brands: LabelBrand[]
}


export default function ArtistsApi(client: Client) {
	return {
		async getArtists(query: Query): Promise<Paginated<ServerArtist>> {
			type Response = {
				Artists: Paginated<ServerArtist>
			}
			const resp = await client.get<Response>("/artists", {params: query})
			return resp.data.Artists
		},
		async getLatestArtists(query: Query): Promise<Paginated<ServerArtist>> {
			type Response = {
				Artists: Paginated<ServerArtist>
			}
			const resp = await client.get<Response>("/latest-artists", {params: query})
			return resp.data.Artists
		},
		async getArtist(id: string): Promise<GetArtistResponse> {
			const resp = await client.get<GetArtistResponse>("/artist/" + id)
			return resp.data
		},
		async getArtistFeaturedTracks(artistId: string, query: Query): Promise<GetTracksResponse> {
			const resp = await client.get<GetTracksResponse>(`/artist/${artistId}/featured-tracks`, {
				params: query,
			})
			return resp.data
		},
		async getArtistTracks(artistId: string, query: Query): Promise<GetArtistTracksResponse> {
			const resp = await client.get<GetArtistTracksResponse>(`/artist/${artistId}/tracks`, {
				params: query,
			})
			return resp.data
		},
		async getRelatedArtists(id, query): Promise<Paginated<ServerArtist>> {
			type Response = {
				Artists: Paginated<ServerArtist>
			}
			const resp = await client.get<Response>("/artist/" + id + "/related", {params: query})
			return resp.data.Artists
		},
		async getArtistRelationships(artistId: string): Promise<ServerArtistRelationship[]> {
			if (!artistId) return
			const resp = await client.get<ServerArtistRelationship[]>(`/artist/${artistId}/relationships`)
			return resp.data
		},
		async createArtistRelationship(data: ServerArtistRelationship) {
			if (!data?.ArtistId) return
			await client.post(`/artist/${data.ArtistId}/relationship`, {ArtistUserRelationship: data})
		},
		async deleteArtistRelationship(artistId: string, userId: string) {
			if (!artistId || !userId) return
			await client.post(`/artist/${artistId}/relationship/${userId}/delete`)
		},
		artistImageUri(id: string, imageType: ArtistImageType, o: ImageOptions) : string {
			return applyImageOptionsToBase(`/artist/${id}/${imageType}`, o)
		},
		async getArtistImageInfo(id: string, imageType: ArtistImageType): Promise<SignedUrlInfo> {
			return await getSignedUrlInfo(client, `/artist/${id}/${imageType}`)
		},
		async createArtist(artist: ServerArtist): Promise<string> {
			type Response = {
				ArtistId: string
			}
			const resp = await client.post<Response>("/artist", {Artist: artist})
			return resp.data.ArtistId
		},
		async updateArtist(artist: ServerArtist) {
			if (!artist.Id) return
			await client.post(`/artist/${artist.Id}`, {Artist: artist})
		},
		async deleteArtist(id: string) {
			if (!id) return
			const resp = await client.post(`/artist/${id}/delete`)
			return resp.data
		},
		async uploadArtistImage(artistId: string, imageType: ArtistImageType, file: File) {
			if (!artistId) return

			const data = new FormData()
			data.append('cover', file)
			await client.post(`/artist/${artistId}/${imageType}`, data)
		},
		async deleteArtistImage(artistId: string, imageType: ArtistImageType) {
			if (!artistId) return
			await client.post(`/artist/${artistId}/${imageType}/delete`)
		},
		async getArtistEvents(id: string, q: Query) : Promise<Paginated<ServerEvent>> {
			type Response = {
				Event: Paginated<ServerEvent>
			}
			const resp = await client.get<Response>(`/artist/${id}/events`, {params: q})
			return resp.data.Event
		},
		async setFeaturedReleaseId(artistId: string, releaseId: string): Promise<void> {
			await client.post(`/artist/${artistId}/featured-release?mode=set`, {
				FeaturedReleaseId: releaseId,
			})
		},
		async clearFeaturedReleaseId(artistId: string): Promise<void> {
			await client.post(`/artist/${artistId}/featured-release?mode=clear`)
		},
		async addArtistFeaturedTracks(artistId: string, trackId: string) : Promise<void> {
			await client.post(`/artist/${artistId}/featured-tracks?mode=add`, {
				ArtistId: artistId,
				TrackId: trackId,
			})
		},
		async removeArtistFeaturedTracks(artistId: string, trackId: string) : Promise<void> {
			await client.post(`/artist/${artistId}/featured-tracks?mode=remove`, {
				ArtistId: artistId,
				TrackId: trackId,
			})
		},
		async addRelatedArtists(artist1: string, artist2: string) : Promise<void> {
			await client.post(`/related-artists?mode=add`, {
				Artist1Id: artist1,
				Artist2Id: artist2,
			})
		},
		async removeRelatedArtists(artist1: string, artist2: string) : Promise<void> {
			await client.post(`/related-artists?mode=remove`, {
				Artist1Id: artist1,
				Artist2Id: artist2,
			})
		},
	}
}