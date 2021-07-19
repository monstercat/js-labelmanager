import {Client} from "../types"
import {convertServerTrack, ServerTrack, Track} from "../tracks/model"
import {ServerFile} from "../files/model"
import {convertServerTrackContract, convertTrackContract, ServerTrackContract, TrackContract} from "./model"

export type TrackContractResponse = {
	TrackContract: TrackContract
	Track: Track,
	Files: ServerFile[]
}

export default function TrackContractsApi(client: Client) {
	return {
		async getContract(contractId: string): Promise<TrackContractResponse> {
			type Response = {
				TrackContract: ServerTrackContract
				Track: ServerTrack
				Files: ServerFile[]
			}
			const resp = await client.get<Response>(`/track-contract/${contractId}`)
			return {
				TrackContract: convertServerTrackContract(resp.data.TrackContract),
				Track: convertServerTrack(resp.data.Track),
				Files: resp.data.Files,
			}
		},
		trackContractFileUri (id: string, fileId: string) : string{
			return `${client.defaults.baseURL}/track-contract/${id}/file/${fileId}`
		},
		async createContract(trackContract: TrackContract, updateSatisfiedDate: boolean) {
			type Response = {
				TrackContractId: string
			}
			const resp = await client.post(`/track-contract`, {
				TrackContract: convertTrackContract(trackContract),
				UpdateSatisfiedDate: updateSatisfiedDate
			})
		},
		async updateContract(trackContract: TrackContract, updateSatisfiedDate: boolean) {
			await client.post(`/track-contract/${trackContract.Id}`, {
				TrackContract: convertTrackContract(trackContract),
				UpdateSatisfiedDate: updateSatisfiedDate
			})
		},
		async deleteContract(id: string) {
			await client.post(`/track-contract/${id}/delete`)
		},
		async addContractFile(id: string, file: File) : Promise<string> {
			type Response = {
				FileId: string
			}
			const data = new FormData()
			data.append("file", file)
			const resp = await client.post<Response>(`/track-contract/${id}/file`, data)
			return resp.data.FileId
		}
	}
}