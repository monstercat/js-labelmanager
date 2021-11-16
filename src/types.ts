export abstract class LabelManagerApi {
	public constructor(protected readonly client: Client) { }
}

export type RequestConfig = {
	data?: any;
	headers?: any;
	params?: any;
	onUploadProgress?: (progressEvent: any) => void;
	onDownloadProgress?: (progressEvent: any) => void;
};

export type Response<T> = {
	data: T;
	status: number;
	headers: any;
};

export interface Client {
	defaults: {
		baseURL?: string;
	};

	post<T = any, R = Response<T>>(url: string, data?: any, config?: RequestConfig): Promise<R>;

	get<T = any, R = Response<T>>(url: string, config?: RequestConfig): Promise<R>;
}

export enum ArchiveMode {
	None,
	Any,
	Only,
}

export enum Visibility {
	PublicOnly,
	PrivateOnly,
	All,
}

export type ServerLink = {
	Id: string;
	Platform?: string;
	Url: string;
	Sort: number;
};

export type Address = {
	AddressLine1: string;
	AddressLine2: string;
	City: string;
	PostalCode: string;
	Province: string;
	Country: string;
};

export enum Access {
	Owner,
	Write,
	Read,
	None
}

export type Paginated<T> = {
	Count: number;
	Limit: number;
	Total: number;
	Offset: number;
	Search: string;
	Data: T[];
	Sort: string[];
	Fields: { [key: string]: string[]; };
};

export type Query = {
	[key: string]: string | number | boolean | string[] | number[];
};

export type GlobalSearchResult = {
	Subtitle: string;
	Title: string;
	Id: string;
	Type: string;
	Public: boolean;
	Version: string;
	LabelId: string;
	LabelTitle: string;
	ReleaseType: string;
	TagusId: number;
};

export enum ObjectType {
	Release = "Release",
	Track = "Track",
	Artist = "Artist",
	Writer = "Writer"
}

export type ValidationInfo = {
	Field: string;
	Type: string;
	Message: string;
	Index: number;
	Value: any;
};

export enum LockStatus {
	Draft = "Draft",
	Approved = "Approved",
	Scheduled = "Scheduled",
	Cancelled = "Cancelled",
}

