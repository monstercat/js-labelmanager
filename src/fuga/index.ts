import {Client, Paginated, Query} from "../types"
import {
	convertServerFugaTransmission, convertServerFugaTransmissionMessage,
	FugaTransmission,
	FugaTransmissionMessage,
	ServerFugaTransmission,
	ServerFugaTransmissionMessage
} from "./model"

export type MostRecentTransmissionResponse = {
	Transmission: FugaTransmission
	Messages: FugaTransmissionMessage[]
}

export default function FugaApi(client: Client) {
	return {
		async getTransmissions(releaseId: string, query: Query): Promise<Paginated<ServerFugaTransmission>> {
			type Response = {
				Transmissions: Paginated<ServerFugaTransmission>
			}
			const resp = await client.get<Response>(`/release/${releaseId}/transmissions`, {params: query})
			return resp.data.Transmissions
		},
		async getTransmission(transmissionId: string): Promise<MostRecentTransmissionResponse> {
			type Response = {
				Transmission: ServerFugaTransmission
				Messages: ServerFugaTransmissionMessage[]
			}
			const resp = await client.get<Response>(`/fuga-transmission/${transmissionId}`)
			return {
				Transmission: convertServerFugaTransmission(resp.data.Transmission),
				Messages: resp.data.Messages?.map(convertServerFugaTransmissionMessage)
			}
		},
		async isReleaseTransmitting(releaseId: string): Promise<boolean> {
			type Response = {
				Transmitting: boolean
			}
			const resp = await client.get<Response>(`/release/${releaseId}/fuga-status`)
			return resp.data.Transmitting
		},
		async startReleaseTransmission(releaseId: string) {
			await client.post(`/release/${releaseId}/fuga`)
		},
	}
}