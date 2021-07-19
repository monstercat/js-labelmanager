export enum TagusType {
	String = "String",
	Integer = "Integer",
	Number = "Number",
	Country = "Country",
	Date = "Date",
	Boolean = "Boolean",
	Currency = "Currency",
	Precise = "Precise",
	StringNumeric = "StringNumeric", // string that only has numeric numbers - such as 000011122
	StringAlphaNumeric = "StringAlphaNumeric",
}

export type DataType = {
	Id: number
	Name: string
	Notes: string
	Type: TagusType
}

export type DataTypeMapper = {
	DataTypeId: number
	ExpectedValue: string
	MappedValue: string
	Insensitive: boolean
	EntityId: number

	DataTypeName?: string
}
