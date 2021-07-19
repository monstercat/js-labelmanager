import {
	Access,
	Client,
	Paginated,
	Query
} from "../types"
import {convertLabel, Label, LabelPriority, ServerGeneratingInfo, ServerLabel} from "./model"
import {ServerLabelGroup} from "../label-groups/model"
import {ServerFinancialAccount} from "../financial-accounts/model"
import {UserAccess} from "../permissions/model"
import {ServerUser} from "../users/model"
import {applyImageOptionsToBase, ImageOptions} from "../files/model"

export type GetLabelResponse = {
	MyAccess: Access
	MyLabelGroupAccess: Access
	Label: ServerLabel
	LabelGroup: ServerLabelGroup
	StatementStatuses: { [key: string]: number } // todo; fix
	DumpAccount: ServerFinancialAccount
}

export type PayoutsOptions = {
	download?: boolean
	date?: string
}

export type LabelStatementErrorMessage = {
	StatementIds: string[]
	ErrorMessage: string
}

export type UpdateFugaPayload = {
	FugaId: number
	FugaUser: string
	FugaPassword: string
	Password: string
}

export type SendStatementsPayload = {
	Lines: string[]
	StatementUrl: string
	Omit: string[]
	From: string
	FromName: string
	ReportingPeriod: Date
}



export function payoutsOptionsToQueryString(options: PayoutsOptions): string {
	return [
		options.date && `date=${encodeURI(options.date)}`,
		options.download && "download=true"
	].filter(v => !!v).join("&")

}

export default function LabelsApi(client: Client) {
	return {
		async getLabels(query: Query): Promise<Paginated<ServerLabel>> {
			type Response = {
				Labels: Paginated<ServerLabel>
			}
			const resp = await client.get<Response>("/labels", {params: query})
			return resp.data.Labels
		},
		async getLabel(id: string): Promise<GetLabelResponse> {
			const resp = await client.get<GetLabelResponse>("/label/" + id)
			return resp.data
		},
		async getLabelInvoiceTypes(q: Query): Promise<string[]> {
			type Response = {
				InvoiceTypes: string[]
			}
			const resp = await client.get<Response>("/labels/invoice-types", {params: q})
			return resp.data.InvoiceTypes
		},
		async getLabelPermissions(id: string): Promise<UserAccess[]> {
			type Response = {
				Permissions: UserAccess[]
			}
			const resp = await client.get<Response>(`/label/${id}/permissions`)
			return resp.data.Permissions
		},
		labelImageUri(id: string, options?: ImageOptions): string {
			return applyImageOptionsToBase(`${client.defaults.baseURL}/label/${id}/image`, options)
		},
		exportPayoutsUri(id: string, options?: PayoutsOptions): string {
			const base = `${client.defaults.baseURL}/label/${id}/payouts`
			if (!options || Object.keys(options).length == 0) return base

			const opts = payoutsOptionsToQueryString(options)
			if (!opts) return base
			return base + "?" + opts
		},
		async getLabelStatementsStatuses(id: string, q: Query): Promise<Paginated<ServerGeneratingInfo>> {
			type Response = {
				Generating: Paginated<ServerGeneratingInfo>
			}
			const resp = await client.get<Response>(`/label/${id}/statements`, {
				params: q,
			})
			return resp.data.Generating
		},
		async getLabelBillingEmails(id: string): Promise<string[]> {
			type Response = {
				Emails: string[]
			}
			const resp = await client.get<Response>(`/label/${id}/billing-emails`)
			return resp.data.Emails
		},
		async getStatementsErrors(id: string, q: Query): Promise<LabelStatementErrorMessage[]> {
			type Response = {
				Messages: LabelStatementErrorMessage[]
			}
			const resp = await client.get<Response>(`/label/${id}/statements-errors`, {
				params: q,
			})
			return resp.data.Messages
		},
		async getLabelRepresentatives(id: string, q: Query): Promise<Paginated<ServerUser>> {
			type Response = {
				Users: Paginated<ServerUser>
			}
			const resp = await client.get<Response>(`/label/${id}/representatives`, {
				params: q,
			})
			return resp.data.Users
		},
		async getRepresentatives(q: Query): Promise<Paginated<ServerUser>> {
			type Response = {
				Users: Paginated<ServerUser>
			}
			const resp = await client.get<Response>(`/labels/representatives`, {
				params: q,
			})
			return resp.data.Users
		},
		async getLabelPriorities(id: string): Promise<LabelPriority[]> {
			type Response = {
				Priorities: LabelPriority[]
			}
			const resp = await client.get<Response>(`/label/${id}/priorities`)
			return resp.data.Priorities
		},
		async createLabel(label: Label, group: ServerLabelGroup, setDefault?: boolean): Promise<string> {
			type Response = {
				LabelId: string
			}
			const resp = await client.post<Response>("/label", {
				Label: convertLabel(label),
				LabelGroupId: group?.Id,
				LabelGroupName: group?.Name,
				SetDefault: !!setDefault,
			})
			return resp.data.LabelId
		},
		async updateLabel(label: Label) {
			await client.post(`/label/${label.Id}`, {
				Label: convertLabel(label),
			})
		},
		// This route updates the FUGA parameters for a label. The password specified in the payload is the
		// current user's password (used to authenticate).
		async updateLabelFuga(id: string, payload: UpdateFugaPayload) {
			await client.post(`/label/${id}/update-fuga`, payload)
		},
		async deleteLabel(id: string) {
			await client.post(`/label/${id}/delete`)
		},
		async setLabelAsDefault(id: string) {
			await client.post(`/label/${id}/set-default`)
		},
		async updateLabelImage(id: string, file: File) {
			const data = new FormData()
			data.append('image', file)
			await client.post(`/label/${id}/image`, data)
		},
		async addUPCsFromFile(id: string, file: File) {
			const data = new FormData()
			data.append('file', file)
			await client.post(`/label/${id}/upc`)
		},
		async createLabelPriority(id: string, priority: LabelPriority): Promise<string> {
			type Response = {
				LabelPriorityId: string
			}
			const resp = await client.post<Response>(`/label/${id}/priority`, {
				LabelPriority: priority
			})
			return resp.data.LabelPriorityId
		},
		async updateLabelPriority(id: string, priority: LabelPriority) {
			await client.post(`/label/${id}/priority/${priority.Id}`, {
				LabelPriority: priority,
			})
		},
		async deleteLabelPriority(id: string, priorityId: string) {
			await client.post(`'/label/${id}/priority/${priorityId}/delete`)
		},
		async deleteLabelImage(id: string) {
			await client.post(`/label/${id}/image/delete`)
		},
		async importPayouts(id: string, date: Date, description: string, file: File): Promise<string> {
			const data = new FormData()
			data.append('date', date.toISOString())
			data.append('description', description)
			data.append('file', file)

			type Response = {
				ImportId: string
			}
			const resp = await client.post<Response>(`/label/${id}/payouts`, data)
			return resp.data.ImportId
		},
		async importTransactions(id: string, description: string, file: File, date?: Date) {
			const data = new FormData()
			data.append('file', file)
			data.append('description', description)
			if (date) {
				data.append('date', date.toISOString())
			}

			type Response = {
				ImportId: string
			}
			const resp = await client.post<Response>(`/label/${id}/transactions`, data)
			return resp.data.ImportId
		},
		async importInvoices(id: string, file: File) {
			const data = new FormData()
			data.append('file', file)
			await client.post(`label/${id}/invoices`, data)
		},
		async generateLabelStatements(id: string, startDate: Date, finishDate: Date, reportPeriod: Date, title: string) {
			await client.post(`/label/${id}/generate-statements`, {
				StartDate: startDate.toISOString(),
				FinishDate: finishDate.toISOString(),
				ReportPeriod: reportPeriod.toISOString(),
				Title: title,
			})
		},
		async deleteLabelStatements(id: string, title: string) {
			await client.post(`/label/${id}/delete-statements`, {
				Title: title,
			})
		},
		async publishLabelStatements(id: string, title: string) {
			await client.post(`/label/${id}/publish-statements`, {
				Title: title,
			})
		},
		async unpublishLabelStatements(id: string, title: string) {
			await client.post(`/label/${id}/unpublish-statements`, {
				Title: title,
			})
		},
		async sendLabelStatements(id: string, payload: SendStatementsPayload) {
			await client.post(`/label/${id}/send-statements`, {
				LabelId: id,
				...payload,
			})
		}
	}
}