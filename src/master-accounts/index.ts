import {Client, Paginated, Query} from "../types"
import {LabelBasic} from "../labels/model"
import {convertMasterAccount, MasterAccount, ServerFinancialImport, ServerMasterAccount} from "./model"
import {convertFinancialAccount, FinancialAccount, ServerFinancialAccount} from "../financial-accounts/model"
import {ServerStatement} from "../statements/model"

export type GetAccountsResponse = {
	Labels: LabelBasic[],
	MasterAccounts: Paginated<ServerMasterAccount>
}

export type GetAccountResponse = {
	MasterAccount: ServerMasterAccount
	MyAccess: number
	PaymentTypes: string[]
}

export type GetMasterAccountFinancialAccountsResponse = {
	FinancialAccounts: Paginated<ServerFinancialAccount>
	Labels: LabelBasic[]
}

export default function MasterAccountsApi(client: Client) {
	return {
		async getMasterAccounts(query: Query): Promise<GetAccountsResponse> {
			return (await client.get<GetAccountsResponse>("/financial-accounts", {params: query})).data
		},
		async getMasterAccount(id: string): Promise<GetAccountResponse> {
			const resp = await client.get<GetAccountResponse>(`/financial-account/${id}`)
			return resp.data
		},
		async createMasterAccount(data: MasterAccount): Promise<string> {
			type Response = {
				MasterAccountId: string
			}
			const resp = await client.post<Response>(`/financial-account`, {MasterAccount: convertMasterAccount(data)})
			return resp.data.MasterAccountId
		},
		async updateMasterAccount(data: MasterAccount) {
			if (!data.Id) return
			await client.post(`/financial-account/${data.Id}`, {MasterAccount: convertMasterAccount(data)})
		},
		async deleteMasterAccount(id: string) {
			await client.post(`/financial-account/${id}/delete`)
		},
		async getMasterAccountFinancialAccounts(id: string, q: Query): Promise<GetMasterAccountFinancialAccountsResponse> {
			return (await client.get<GetMasterAccountFinancialAccountsResponse>(`/financial-account/${id}/sub-accounts`, {
				params: q
			})).data
		},
		async getMasterAccountStatements(id: string, q: Query): Promise<Paginated<ServerStatement>> {
			type Response = {
				FinancialStatements: Paginated<ServerStatement>
			}
			const resp = await client.get<Response>(`/financial-account/${id}/statements`)
			return resp.data.FinancialStatements
		},
		async createSubAccount(id: string, data: FinancialAccount) : Promise<string> {
			type Response = {
				FinancialAccountId: string
			}
			const resp = await client.post<Response>(`/financial-account/${id}/sub-account`, {FinancialAccount: convertFinancialAccount(data)})
			return resp.data.FinancialAccountId
		},
		async getFinancialImports(query: Query): Promise<Paginated<ServerFinancialImport>> {
			type Response = {
				FinancialImports: Paginated<ServerFinancialImport>
			}
			const resp = await client.get<Response>("financial-accounts/imports", {params: query})
			return resp.data.FinancialImports
		},
		async undoImportTransactions(importId: string) {
			await client.post(`financial-accounts/import/${importId}/undo`)
		},
	}
}