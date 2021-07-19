export type ServerAsset = {
	EntityId: number,
	Title: string,
	Notes: string,
	ContractId: number,
	Tags: string[],
	ChildAssets?: ServerAsset[]
	ContractTitle?: string,
	Created?: string,
	Id?: number,
	LabelId?: string,
	LabelTitle?: string,
	Matchers?: AssetMatcher[],
	MetaBlob?: any, //TODO: Check on these types
	MetadataId?: any, //TODO: Check on these types
	MetadataIds?: any, //TODO: Check on these types
	ParentAssets?: ServerAsset[]
	Rank?: number,
	Shares?: AssetShare[],
	Uuid?: string,
	Version?: string,
}

export type AssetMatcher = {
	AssetId: number,
	AssetTitle: string,
	DataTypeId: number,
	DataTypeName: string,
	EntityId: number,
	Id: number,
	Notes: string,
	Value: string,
}

export type AssetShare = {
	AccountId: number,
	AccountNumber: string,
	AccountTitle: string,
	AssetId: number,
	AssetTitle: string,
	End: string,
	EntityId: number,
	Fraction: string,
	Id: number,
	LabelTitle: string,
	MasterAccountId: string,
	MasterAccountTitle: string,
	OverrideDataType: {Int64: number, Valid: boolean}
	OverrideValues: null
	ShareAmount: number,
	Start: string,
	Type: string,
}

export type AssetContract = {
	Created: string,
	EntityId: number,
	Id: number,
	Logic: string,
	Title: string,
}

export type DataType = {
	Id: number,
	Name: string,
	Notes: string,
	Type: string,
}