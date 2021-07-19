import {Client, Query} from "../types"
import {AssetContract, DataType, ServerAsset} from "./model"
import {ShareType} from "../share-type/model"
import {ServerRelease} from "../releases/model"
import {ServerTrack} from "../tracks/model"

export type GetAssetResponse = {
	Asset: ServerAsset,
	Contracts: AssetContract[],
	DataTypes: DataType[],
	ShareTypes: ShareType[],
	Release: ServerRelease,
	Track: ServerTrack,
}

export type GetLabelPresetsResponse = {
	Contracts: AssetContract[],
	DataTypes: DataType[],
	ShareTypes: ShareType[],
}

export default function AssetsApi(client: Client) {
	return {
		async getAssets(query: Query) {
			const resp = await client.get("/assets", {params: query})
			return resp.data
		},

		async getLabelPresets(tagusId: number | string): Promise<GetLabelPresetsResponse> {
			const resp = await client.get<GetLabelPresetsResponse>(`/entity/${tagusId}/types`)
			return resp.data
		},

		async addAsset(asset: ServerAsset): Promise<string> {
			type Response = {
				AssetId: string
			}
			const resp = await client.post<Response>("/asset", {Asset: asset})
			return resp.data.AssetId
		},

		async getAsset(id: string): Promise<GetAssetResponse> {
			const resp = await client.get<GetAssetResponse>("/asset/" + id)
			return resp.data
		},

		async getAssetShareTypes(id: string) {
			return await client.get(`/asset/${id}/share-types`)
		},

		async deleteAsset(id: string | number): Promise<void> {
			if (!id) return
			const resp = await client.post(`/asset/${id}/delete`)
			return resp.data
		},

		async updateAsset(asset: ServerAsset) {
			if (!asset.Id) return
			await client.post(`/asset/${asset.Id}`, {Asset: asset})
		},

		async duplicateAsset(asset: ServerAsset, data: string): Promise<number> {
			if (!asset.Id) return
			type Response = {
				AssetId: number
			}
			const resp = await client.post<Response>(`/asset/${asset.Id}/clone`, {
				Title: data,
			})
			return resp.data.AssetId
		}
	}
}