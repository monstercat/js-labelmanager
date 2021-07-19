import {Client, Paginated, Query} from "../types"
import {convertRun, convertServerRun, DiffSummary, Run, ServerRun, ServerRunSheet, SimpleSummary} from "./model"
import {LabelBasic} from "../labels/model"
import {ServerSheet} from "../sheets/model"

export type GetRunsResponse = {
	Runs: Paginated<ServerRun>
	Labels: LabelBasic[]
}

export type GetRunResponse = {
	Run: Run
	IsRunPublished: boolean
	HasUnprocessedSheets: boolean
	Sheets: Paginated<ServerSheet>
}

export type GetRunSheetsResponse = {
	RunSheets: Paginated<ServerRunSheet>
	TotalLines: number
	TotalAllocations: number
}

export default function RunsApi(client: Client) {
	return {
		async getRuns(query: Query): Promise<GetRunsResponse> {
			const resp = await client.get<GetRunsResponse>("/runs", {params: query})
			return resp.data
		},
		async getRun(id: number, q?: Query): Promise<GetRunResponse> {
			type Response = {
				Run: ServerRun
				IsRunPublished: boolean
				HasUnprocessedSheets: boolean
				Sheets: Paginated<ServerSheet>
			}
			const resp = await client.get<Response>("/run/" + id, {params: q})
			return {
				...resp.data,
				Run: convertServerRun(resp.data.Run)
			}
		},
		async getRunSheets(runId: number, query: Query): Promise<GetRunSheetsResponse> {
			const resp = await client.get<GetRunSheetsResponse>(`/run/${runId}/sheets`, {params: query})
			return resp.data
		},
		async getRunSummary(id: number, query: Query): Promise<Paginated<SimpleSummary>> {
			type Response = {
				RunSummary: Paginated<SimpleSummary>
			}
			const resp = await client.get<Response>(`/run/${id}/summary`, {params: query})
			return resp.data.RunSummary
		},
		async getRunDiffSummary(runId: number, againstId: number, query: Query): Promise<Paginated<DiffSummary>> {
			type Response = {
				RunDiffSummary: Paginated<DiffSummary>
			}
			const resp = await client.get<Response>(`/run/${runId}/compare/${againstId}`, {params: query})
			return resp.data.RunDiffSummary
		},
		async createRun(run: Run, allocationSetIds: number[]): Promise<number> {
			type Response = {
				RunId: number
			}
			const resp = await client.post<Response>("/run", {Run: convertRun(run), AllocationSetIds: allocationSetIds})
			return resp.data.RunId
		},
		async updateRun(run: Run) {
			if (!run.Id) return
			await client.post(`/run/${run.Id}`, {Run: convertRun(run)})
		},
		async removeAllocationSetFromRun(runId: number, allocationSetId: number) {
			await client.post(`/run/${runId}/sheets?mode=remove`, {AllocationSetId: allocationSetId})
		},
		async addAllocationSetToRun(runId: number, allocationSetid: number) {
			await client.post(`run/${runId}/sheets?mode=add`, {
				AllocationSetId: allocationSetid,
			})
		},
		async deleteRun(id: number) {
			if (!id) return
			await client.post(`/run/${id}/delete`)
		},
		async publishRunBalances(id: number, postedDate: Date, description: string) {
			await client.post(`/run/${id}/publish`, {
				PostedDate: postedDate.toISOString(),
				Description: description,
			})
		},
		async unpublishRunBalances(id: number) {
			await client.post(`/run/${id}/publish?unpublish`)
		},
		async publishDifferences(runId: number, againstId: number, postedDate: Date, description: string) {
			await client.post(`/run/${runId}/publish`, {
				AgainstId: againstId,
				PostedDate: postedDate.toISOString(),
				Description: description,
			})
		}
	}
}