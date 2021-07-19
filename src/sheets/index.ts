import {Client, Paginated, Query} from "../types"
import {convertServerSheet, convertSheet, ServerSheet, Sheet, SheetError} from "./model"
import {LabelBasic} from "../labels/model"
import {ServerLabelGroup} from "../label-groups/model"
import {RunBasic} from "../run/model"

export type GetSheetsResponse = {
	Sheets: Paginated<ServerSheet>
	Labels: LabelBasic[]
	LabelGroups: ServerLabelGroup[]
}

export type GetSheetResponse = {
	Sheet: Sheet
	Runs: RunBasic[]
}

export type GetSheetBasicErrorsResponse = {
	Sheet: ServerSheet
	Errors: Paginated<SheetError>
}

export type ValidateSheetGrossResponse = {
	Matched: boolean
	Gross: number
}

export default function SheetsApi(client: Client) {
	return {
		async getSheets(q: Query): Promise<GetSheetsResponse> {
			return (await client.get<GetSheetsResponse>(`/sheets`, {
				params: q,
			})).data
		},
		async getSheet(id: number): Promise<GetSheetResponse> {
			type Response = {
				Sheet: ServerSheet
				Runs: RunBasic[]
			}
			const resp = await client.get<Response>(`/sheet/${id}`)
			return {
				Sheet: convertServerSheet(resp.data.Sheet),
				Runs: resp.data.Runs,
			}
		},
		async getSheetPreview(id: number, start: number, finish: number): Promise<string> {
			if (!id || start === undefined || finish === undefined) return
			const {data} = await client.get<string>(`/sheet/${id}/preview?lines=1,${start}-${finish}`)
			if (data.includes("NoSuchKey: The specified key does not exist.")) throw {
				response: {
					status: 404,
				}
			}
			return data
		},
		sheetFileUri(id: number) : string{
			return `${client.defaults.baseURL}/sheet/${id}/file`
		},
		async getSheetBasicErrors(id: number, q: Query) : Promise<GetSheetBasicErrorsResponse> {
			const resp = await client.get<GetSheetBasicErrorsResponse>(`/sheet/${id}/errors`, {
				params: q,
			})
			return resp.data
		},
		async validateSheetGross(id: number) : Promise<ValidateSheetGrossResponse> {
			return (await client.get<ValidateSheetGrossResponse>(`/sheet/${id}/validate-gross`)).data
		},
		async createSheet(sheet: Sheet): Promise<number> {
			type Response = {
				SheetId: number
			}
			const resp = await client.post<Response>('/sheet', {
				Sheet: convertSheet(sheet),
			})
			return resp.data.SheetId
		},
		async updateSheet(sheet: Sheet) {
			await client.post(`/sheet/${sheet.Id}`, {
				Sheet: convertSheet(sheet),
			})
		},
		async deleteSheet(id: number) {
			await client.post(`/sheet/${id}/delete`)
		},

		// TODO: upload sheet file
	}
}