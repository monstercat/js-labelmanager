import {Access, Client, Paginated, Query} from "../types"
import {convertWriter, ServerWriter, Writer} from "./model"

type GetWriterResponse = {
	Writer: ServerWriter
	MyAccess: Access
}

export default function WritersApi(client: Client) {
	return {
		async getWriters(query: Query) : Promise<Paginated<ServerWriter>> {
			type Response = {
				Writers: Paginated<ServerWriter>
			}
			const resp = await client.get<Response>("/writers", {params: query})
			return resp.data.Writers
		},
		async getWriter(id: string) : Promise<GetWriterResponse> {
			const resp = await client.get<GetWriterResponse>("/writer/" + id)
			return resp.data
		},
		async addWriter(writer: Writer) : Promise<string> {
			type Response = {
				WriterId: string
			}
			const resp = await client.post<Response>("/writer", {Writer: convertWriter(writer)})
			return resp.data.WriterId
		},
		async updateWriter(writer: Writer) {
			if (!writer.Id) return
			await client.post("/writer/" + writer.Id, {Writer: convertWriter(writer)})
		},
		async deleteWriter(id: string) {
			await client.post(`/writer/${id}/delete`)
		},
	}
}