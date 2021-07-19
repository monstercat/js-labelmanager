import {Client, Paginated} from "../types"
import {DataType, DataTypeMapper} from "./model"

export type GetDataTypeMappingsResponse = {
	DataTypeMappings: Paginated<DataTypeMapper>
	DataTypes: { [key: number]: DataType }
}

export default function DataTypeApi(client: Client) {
	return {
		async getDataTypeMappings(entityId: number): Promise<GetDataTypeMappingsResponse> {
			return (await client.get<GetDataTypeMappingsResponse>(`/data-type-mappings/${entityId}`)).data
		},
		async updateDataTypeMapping(entityId: number, mapper: DataTypeMapper, oldExpectedValue?: string) {
			await client.post(`/data-type-mappings/${entityId}?mode=update`, {
				DataTypeMapper: mapper,
				OldExpectedValue: oldExpectedValue,
			})
		},
		async deleteDataTypeMapping(entityId: number, mapper: DataTypeMapper) {
			await client.post(`/data-type-mappings/${entityId}?mode=delete`, {
				DataTypeMapper: mapper,
			})
		},
	}
}