import {Client, Paginated, Query} from "../types"
import {
	convertDDEXBatch,
	convertServerDDEXBatch,
	DDEXBatch, Deal,
	DeliveryMechanism, Distributor,
	ServerDDEXBatch, ServerPendingBatchUpload
} from "./model"

export type GetDistributorsResponse = {
	Distributors: Paginated<Distributor>
	DeliveryMechanisms: DeliveryMechanism[]
}

type _GetDistributorResponse<T> = {
	Distributor: T,
	Usages: string[]
	CommercialModelTypes: string[]
	DeliveryMechanisms: DeliveryMechanism[]
}

export type GetDistributorResponse = _GetDistributorResponse<Distributor>

export type CreatePendingBatchResponse = {
	GroupId: string
	NumValid: number
	NumInvalid: number
}

export default function DistributorsApi(client: Client) {
	return {
		async getDistributors(labelId: string, q: Query): Promise<GetDistributorsResponse> {
			const resp = await client.get<GetDistributorsResponse>(`/label/${labelId}/distributors`, {
				params: q,
			})
			return resp.data
		},
		async getPublicKey(): Promise<string> {
			type Response = {
				Key: string
			}
			const resp = await client.get<Response>(`/public-key`)
			return resp.data.Key
		},
		async getDistributor(labelId: string, id: string): Promise<GetDistributorResponse> {
			const resp = await client.get<GetDistributorResponse>(`/label/${labelId}/distributor/${id}`)
			return resp.data
		},
		async createDistributor(labelId: string, distributor: Distributor): Promise<string> {
			type Response = {
				DistributorId: string
			}
			const resp = await client.post<Response>(`/label/${labelId}/distributor`, {
				Distributor: distributor,
			})
			return resp.data.DistributorId
		},
		async updateDistributor(labelId: string, distributor: Distributor) {
			await client.post(`/label/${labelId}/distributor/${distributor.Id}`, {
				Distributor: distributor,
			})
		},
		async updateDistributorDeals(labelId: string, id: string, deals: Deal[]) {
			await client.post(`/label${labelId}/distributor/${id}/deals`, {
				Deals: deals,
			})
		},
		async deleteDistributor(labelId: string, id: string) {
			await client.post(`/label/${labelId}/distributor/${id}/delete`)
		},
		async getDistributorBatches(labelId: string, id: string): Promise<Paginated<ServerDDEXBatch>> {
			type Response = {
				Batches: Paginated<ServerDDEXBatch>
			}
			const resp = await client.get<Response>(`/label/${labelId}/distributor/${id}/batches`)
			return resp.data.Batches
		},
		async getDistributorBatch(labelId: string, distributorId: string, id: string): Promise<DDEXBatch> {
			type Response = {
				Batch: ServerDDEXBatch
			}
			const resp = await client.get<Response>(`/label/${labelId}/distributor/${distributorId}/batch/${id}`)
			return convertServerDDEXBatch(resp.data.Batch)
		},
		async createDistributorBatch(labelId: string, distributorId: string, batch: DDEXBatch): Promise<string> {
			type Response = {
				BatchId: string
			}
			const resp = await client.post<Response>(`/label/${labelId}/distributor/${distributorId}/batch`, {
				Batch: convertDDEXBatch(batch)
			})
			return resp.data.BatchId
		},
		async createPendingDistributorBatchFromUPCFile(labelId: string, distributorId: string, file: File): Promise<CreatePendingBatchResponse> {
			const data = new FormData()
			data.append("file", file)
			const resp = await client.post<CreatePendingBatchResponse>(`/label/${labelId}/distributor/${distributorId}/pending-batch`, data)
			return resp.data
		},
		async sendPendingDistributorBatch(labelId: string, distributorId: string, groupId: string) {
			await client.post(`/label/${labelId}/distributor/${distributorId}/pending-batch/${groupId}/send`)
		},
		async getPendingDistributorBatchUploads(labelId: string, distributorId: string, groupId: string): Promise<Paginated<ServerPendingBatchUpload>> {
			type Response = {
				PendingUploads: Paginated<ServerPendingBatchUpload>
			}
			const resp = await client.get<Response>(`/label/${labelId}/distributor/${distributorId}/pending-batch/${groupId}`)
			return resp.data.PendingUploads
		},
	}
}