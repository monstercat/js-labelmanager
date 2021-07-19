import {Client, Paginated, Query} from "../types"
import {
	Balances,
	convertFinancialAccount,
	convertServerFinancialAccount,
	FinancialAccount,
	ServerFinancialAccount,
	ServerFinancialTransaction
} from "./model"
import {ServerInvoice} from "../financial-invoices/model"
import {ServerAsset} from "../assets/model"
import {LabelBasic} from "../labels/model"

export type GetFinancialAccountTransactionsResponse = {
	FinancialTransactions: Paginated<ServerFinancialTransaction>
	Balances: Paginated<Balances>
}

export type GetFinancialAccountAssetsResponse = {
	Assets: Paginated<ServerAsset>
	Labels: LabelBasic[]
}

export default function FinancialAccountApi(client: Client) {
	return {
		async getFinancialAccount(id: string): Promise<FinancialAccount> {
			type Response = {
				SubAccount: ServerFinancialAccount
			}
			const resp = await client.get<Response>(`/sub-account/${id}`)
			return convertServerFinancialAccount(resp.data.SubAccount)
		},
		async updateFinancialAccount(a: FinancialAccount) {
			await client.post(`/sub-account/${a.Id}`, {
				FinancialAccount: convertFinancialAccount(a)
			})
		},
		async deleteFinancialAccount(id: string) {
			await client.post(`/sub-account/${id}/delete`)
		},
		async setFinancialAccountAsDump(id: string) {
			await client.post(`/sub-account/${id}/set-dump`)
		},
		async getFinancialAccountTransactions(id: string, q: Query) : Promise<GetFinancialAccountTransactionsResponse> {
			return (await client.get<GetFinancialAccountTransactionsResponse>(`/sub-account/${id}/transactions`, {
				params: q
			})).data
		},
		async getFinancialAccountInvoices(id: string, q: Query): Promise<Paginated<ServerInvoice>> {
			type Response = {
				Invoices: Paginated<ServerInvoice>
			}
			const resp = await client.get<Response>(`/sub-account/${id}/invoices`, {
				params: q
			})
			return resp.data.Invoices
		},
		async getFinancialAccountAssets(id: string, q: Query): Promise<GetFinancialAccountAssetsResponse> {
			return (await client.get<GetFinancialAccountAssetsResponse>(`/sub-account/${id}/assets`)).data
		}
	}
}