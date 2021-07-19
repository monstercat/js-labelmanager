import {Client, Paginated, Query} from "../types"
import {ServerAllocationSet, GetAllocationSetSummaryResponse, AllocationSetErrorBlob} from "./model"
import {ServerSheet} from "../sheets/model"

export type AllocationSetError = {
	AccountId: number,
	AllocationSetId: number,
	AssignedAccountId?: string,
	AssignedAccountTitle: string,
	AssignedAssetId: number,
	AssignedAssetTitle: string,
	Blob: AllocationSetErrorBlob,
	ColumnNumber: number,
	Count: number,
	Id: number,
	Ignore: boolean,
	Message: string,
	RowNumber: number,
}

export type GetAllocationSetResponse = {
	AllocationSet: ServerAllocationSet,
	Sheet: ServerSheet
}

export type GetAllocationSetErrorResponse = {
	ErrorType: string,
	Errors: Paginated<AllocationSetError>,
	Sheet: ServerSheet
}

export type MatchingErrorPayload = {
	AssignedAssetId: number,
	Ignore: boolean
}


export default function AllocationSetsApi(client: Client) {
	return {
		async getAllocationSets(sheetId: string, q: Query): Promise<Paginated<ServerAllocationSet>> {
			type Response = {
				AllocationSets: Paginated<ServerAllocationSet>
			}
			const resp = await client.get<Response>(`/sheet/${sheetId}/allocation-sets`)
			return resp.data.AllocationSets
		},
		async addAllocationSet(sheetId: string, data: ServerAllocationSet): Promise<string> {
			const resp = await client.post(`/sheet/${sheetId}/allocation-set`, {
				AllocationSet: data
			})
			return resp.data.AllocationSetId
		},
		async updateAllocationSet(data: ServerAllocationSet) {
			return await client.post(`/sheet/${data.SheetId}/allocation-set/${data.Id}`, {
				AllocationSet: data
			})
		},
		async getAllocationSet(sheetId: string, allocSetId: string): Promise<GetAllocationSetResponse> {
			const resp = await client.get<GetAllocationSetResponse>(`/sheet/${sheetId}/allocation-set/${allocSetId}`)
			return resp.data
		},
		async deleteAllocationSet(sheetId: string, allocSetId: string): Promise<void> {
			return await client.post(`/sheet/${sheetId}/allocation-set/${allocSetId}/delete`)
		},

		async processAllocationSet(sheetId: string, allocSetId: string, mode: string) {
			await client.post(`/sheet/${sheetId}/allocation-set/${allocSetId}/process?mode=${mode}`)
		},

		async getAllocationSetErrors(sheetId: string, allocSetId: string, type: string, query: Query): Promise<GetAllocationSetErrorResponse> {
			const resp = await client.get<GetAllocationSetErrorResponse>(`/sheet/${sheetId}/allocation-set/${allocSetId}/errors`, {params: {type, ...query}})
			return resp.data
		},

		async getAllocationSetSummary(sheetId: string, allocSetId: string, query: Query): Promise<GetAllocationSetSummaryResponse> {
			const resp = await client.get<GetAllocationSetSummaryResponse>(`/sheet/${sheetId}/allocation-set/${allocSetId}/summary`, {params: query})
			return resp.data
		},

		async getAllocationSetPreview(sheetId: string, start: string, finish: string): Promise<string> {
			if (!sheetId || start === undefined || finish === undefined) return
			const {data} = await client.get(`/sheet/${sheetId}/preview?lines=1,${start}-${finish}`)
			if (data.includes("NoSuchKey: The specified key does not exist.")) return ""

			return data
		},

		async ignoreRemainingErrors(sheetId: string, allocSetId: string) {
			await client.post(`/sheet/${sheetId}/allocation-set/${allocSetId}/ignore-remaining`)
		},

		async updateMatchingErrors(sheetId: string, allocSetId: string, errorId: string, error: MatchingErrorPayload) {
			await client.post(`/sheet/${sheetId}/allocation-set/${allocSetId}/error/${errorId}`, {Error: error})
		},

		async setAllocationSetAsDefault(sheetId: string, allocSetId: string) {
			await client.post(`/sheet/${sheetId}/allocation-set/${allocSetId}/set-default`)
		}
	}
}