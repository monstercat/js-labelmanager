import {Client, Paginated, Query} from "../types"
import {Schema, SchemaAssumedValue, SchemaDataType} from "./model"

type SchemaResponse = {
	Schema: Schema
	DataTypes: SchemaDataType[]
}

export default function SchemaApi(client: Client) {
	return {
		async getSchemas(query: Query): Promise<Paginated<Schema>> {
			type Response = {
				Schemas: Paginated<Schema>
			}
			const resp = await client.get<Response>('/schemas', {params: query})
			return resp.data.Schemas
		},
		async getSchema(id: string): Promise<SchemaResponse> {
			const resp = await client.get<SchemaResponse>("/schema/" + id)
			return resp.data
		},
		async updateSchema(data: Schema) {
			await client.post("/schema/" + data.Id, {Schema: data})
		},
		async deleteSchema(id: string) {
			await client.post("/schema/" + id + "/delete")
		},
		async createSchema(data: Schema): Promise<number> {
			type Response = {
				SchemaId: number
			}
			const resp = await client.post<Response>("/schema", {Schema: data})
			return resp.data.SchemaId
		},
		async cloneSchema(id: string, suffix?: string): Promise<number> {
			type Response = {
				SchemaId: number
			}
			const resp = await client.post<Response>(`/schema/${id}/clone`, {
				Suffix: suffix,
			})
			return resp.data.SchemaId
		},
		async addDataType(id: string, dataType: SchemaDataType): Promise<string> {
			type Response = {
				Id: string
			}
			const resp = await client.post<Response>(`/schema/${id}/data-type`, {
				DataType: dataType,
			})
			return resp.data.Id
		},
		async updateDataType(data: SchemaDataType) {
			await client.post(`/schema-data-type/${data.Id}`, {
				DataType: data
			})
		},
		async deleteDataType(id: string) {
			await client.post(`/schema-data-type/${id}/delete`)
		},
		async addDefault(id: string, value: SchemaAssumedValue) {
			await client.post(`/schema/${id}/modify-defaults?mode=add`, {
				DataTypeId: value.DataTypeId,
				Value: value.AssumedValue,
			})
		},
		async updateDefault(id: string, value: SchemaAssumedValue, newValue: SchemaAssumedValue) {
			await client.post(`/schema/${id}/modify-defaults?mode=modify`, {
				DataTypeId: newValue.DataTypeId,
				Value: newValue.AssumedValue,
				OldDataTypeId: value.DataTypeId,
				OldValue: value.AssumedValue,
			})
		},
		async removeDefault(id: string, value: SchemaAssumedValue) {
			await client.post(`/schema/${id}/modify-defaults?mode=remove`, {
				DataTypeId: value.DataTypeId,
				Value: value.AssumedValue,
			})
		},
	}
}