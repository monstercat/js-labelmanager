import {Access, Client, GlobalSearchResult, Paginated, Query} from "../types"
import {convertFinancialInvoice, Invoice, InvoiceShare, ServerInvoice} from "./model"
import {LabelBasic} from "../labels/model"
import {ServerDirectoryUser} from "../users/model"
import {ServerFile} from "../files/model"
import {ServerFinancialTransaction} from "../financial-accounts/model"
import {addFile, getFiles} from "../files"

export type GetInvoicesResponse = {
	FinancialInvoices: Paginated<ServerInvoice>
	Labels: LabelBasic[]
	SelectedCreators: ServerDirectoryUser[]
	SelectedRelations: GlobalSearchResult[]
	SelectedTypes: string[]
}

export type GetInvoiceResponse = {
	FinancialInvoice: ServerInvoice
	MyAccess: Access
	Files?: ServerFile[]
	FinancialTransactions?: ServerFinancialTransaction[]
}

export default function FinancialInvoicesApi(client: Client) {
	return {
		async getInvoices(query: Query): Promise<GetInvoicesResponse> {
			const resp = await client.get<GetInvoicesResponse>("/invoices", {params: query})
			return resp.data
		},
		async getInvoiceCategories(search: string): Promise<string[]> {
			type Response = {
				Categories: string[]
			}
			const resp = await client.get<Response>("/invoices/categories", {params: {search}})
			return resp.data.Categories
		},
		async getInvoice(id: string): Promise<GetInvoiceResponse> {
			return (await client.get<GetInvoiceResponse>("/invoice/" + id)).data
		},
		async getInvoiceShares(id: string, assetId: string, date: Date): Promise<{ [key: string]: InvoiceShare[] }> {
			type Response = {
				Shares: { [key: string]: InvoiceShare[] }
			}
			const resp = await client.get<Response>("/invoice/" + id + "/shares", {params: {assetId, date}})
			return resp.data.Shares
		},
		async getInvoicePreview(id: string) : Promise<ServerFinancialTransaction[]> {
			type Response = {
				Transactions: ServerFinancialTransaction[]
			}
			const resp = await client.get<Response>(`/invoice/${id}/preview`)
			return resp.data.Transactions
		},
		async calculateInvoiceShareBalances(id: string, shares: InvoiceShare[]) : Promise<InvoiceShare[]> {
			type Response = {
				Shares: InvoiceShare[]
			}
			const resp = await client.post<Response>("/invoice/" + id + "/calculate-share-balances", {
				Shares: shares,
			})
			return resp.data.Shares
		},
		async createInvoice(data: Invoice) : Promise<string> {
			type Response = {
				FinancialInvoiceId: string
			}
			const resp = await client.post<Response>("/invoice", {
				FinancialInvoice: convertFinancialInvoice(data)
			})
			return resp.data.FinancialInvoiceId
		},
		async updateInvoice(invoice: Invoice) {
			await client.post("/invoice/" + invoice.Id, {
				FinancialInvoice: convertFinancialInvoice(invoice),
			})
		},
		async deleteInvoice(id: string) {
			await client.post("/invoice/" + id + "/delete")
		},
		async publishInvoice(invoiceId: string) {
			await client.post(`/invoice/${invoiceId}/pub?action=publish`)
		},
		async unpublishInvoice(invoiceId: string) {
			await client.post(`/invoice/${invoiceId}/pub?action=unpublish`)
		},
		async addInvoiceFile(id: string, file: File) {
			await addFile(client, `/invoice/${id}/add-file`, file)
		},
		async getInvoiceFiles(id: string): Promise<Paginated<ServerFile>> {
			return await getFiles(client, `/invoice/${id}/files`)
		},
		async deleteInvoiceFile(id: string, fileId: string) {
			await client.post(`/invoice/${id}/file/${fileId}/delete`)
		},
		invoiceFileUri(id: string, fileId: string): string {
			return `${client.defaults.baseURL}/invoice/${id}/file/${fileId}/download`
		},
	}
}