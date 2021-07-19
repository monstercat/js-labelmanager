import {Client} from "../types"
import {ServerFile} from "../files/model"
import {convertServerStatement, ServerStatement, Statement} from "./model"

export type GetStatementResponse = {
	Files: ServerFile
	Statement: Statement
}

export type StatementEmailOpts = {
	Lines: string[]
	StatementUrl: string
	Omit: string[] // Emails to omit sending from
	From: string
	FromName: string
}

export default function StatementsApi(client: Client) {
	return {
		async getStatement(id: string): Promise<GetStatementResponse> {
			type Response = {
				Files: ServerFile
				Statement: ServerStatement
			}
			const resp = await client.get<Response>(`/statment/${id}`)
			return {
				Files: resp.data.Files,
				Statement: convertServerStatement(resp.data.Statement)
			}
		},
		statementFileUri(id: string, fileId: string) {
			return `${client.defaults.baseURL}/statement/${id}/file/${fileId}`
		},
		async deleteStatementFile(id: string, fileId: string) {
			await client.post(`/statement/${id}/file/${fileId}/delete`)
		},
		async sendStatementEmail(id: string, opts: StatementEmailOpts) {
			await client.post(`/statement/${id}/send`, opts)
		},
		async deleteStatement(id: string) {
			await client.post(`/statement/${id}/delete`)
		},
		async regenerateStatement(id: string) {
			await client.post(`/statement/${id}/regenerate`)
		}
	}
}