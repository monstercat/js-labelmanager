export type ServerSchema = {
	Archived: boolean
	Created: string
	Id: number
	TargetType: string
	Title: string

	// extras
	DataTypes?: SchemaDataType[]
	AssumedDataTypes: SchemaAssumedValue[]
}

export type Schema = {
	Archived: boolean
	Created: Date
	Id: number
	TargetType: string
	Title: string

	// extras
	DataTypes?: SchemaDataType[]
	AssumedDataTypes: SchemaAssumedValue[]
}

export function convertServerSchema(s: ServerSchema): Schema {
	return {
		...s,
		Created: s.Created? new Date(s.Created): null,
	}
}

export function convertSchema(s: Schema): ServerSchema {
	return {
		...s,
		Created: s.Created ? s.Created.toISOString() : null,
	}
}

export type SchemaDataType = {
	ColumnName: string
	ColumnNumber: number
	DataSchemaId: number
	DataTypeId: number
	Delimiter: string
	Hnumber: string
	Id: number
	Insensitive: boolean
	MatchingWeight: number
	Notes: string
	Prefix: string
}

export type SchemaAssumedValue = {
	AssumedValue: string
	DataSchemaId: number
	DataTypeName: string
	DataType: string
	DataTypeId: number
}