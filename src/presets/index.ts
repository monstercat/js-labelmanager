import {Client, Access} from "../types"
import {LabelBrand} from "../labels/model"
import {PerformanceType, TrackVersion} from "../tracks/model"
import {ReleaseType} from "../releases/model"
import {Currency} from "./model"

export type GetTrackTypesResponse = {
	Brands: LabelBrand[]
	PerformanceTypes: PerformanceType[]
	PrimaryGenres: string[]
	SecondaryGenres: string[]
	TrackVersions: TrackVersion[]
}

export type GetReleaseTypesResponse = {
	Brands: LabelBrand[]
	PrimaryGenres: string[]
	SecondaryGenres: string[]
	ReleaseTypes: ReleaseType[]
}

export type GetPermPresetsResponse = {
	Assignable: { [key in Access]: number[] }
	Descriptor: { [key in Access]: string }
}

export default function PresetsApi(client: Client) {
	return {
		async getTags(term?: string): Promise<string[]> {
			type Response = {
				Tags: string[]
			}
			const resp = await client.get<Response>(`/presets/tags`, {
				params: {term}
			})
			return resp.data.Tags
		},
		async getTrackTypes(labelId: string): Promise<GetTrackTypesResponse> {
			return (await client.get<GetTrackTypesResponse>("/presets/track-types", {
				params: {labelId}
			})).data
		},
		async getReleaseTypes(labelId: string): Promise<GetReleaseTypesResponse> {
			return (await client.get<GetReleaseTypesResponse>("/presets/release-types", {
				params: {labelId}
			})).data
		},
		async getPaymentTypes(): Promise<string[]> {
			type Response = {
				PaymentTypes: string[]
			}
			const resp = await client.get<Response>("/presents/payment-types")
			return resp.data.PaymentTypes
		},
		async getCurrencies(): Promise<{ [key: string]: Currency }> {
			type Response = {
				Currencies: { [key: string]: Currency }
			}
			const resp = await client.get<Response>("/presets/currencies")
			return resp.data.Currencies
		},
		async getPermPresets() : Promise<GetPermPresetsResponse>{
			return (await client.get<GetPermPresetsResponse>("/presets/permissions")).data
		}
	}
}