import {Client, Paginated} from "../types"
import {ReleaseScheduleItem} from "./model"

export default function ReleaseScheduleApi(client: Client) {
	return {
		async getScheduleItems(labelId: string) : Promise<Paginated<ReleaseScheduleItem>> {
			type Response = {
				Schedule: Paginated<ReleaseScheduleItem>
			}
			const resp = await client.get<Response>(`/label/${labelId}/release-schedule`)
			return resp.data.Schedule
		},
		async getScheduleItem(labelId: string, id: string) : Promise<ReleaseScheduleItem>{
			type Response = {
				Item: ReleaseScheduleItem
			}
			const resp = await client.get<Response>(`/label/${labelId}/release-schedule/${id}`)
			return resp.data.Item
		},
		async createScheduleItem(data: ReleaseScheduleItem) : Promise<string> {
			type Response = {
				ItemId: string
			}
			const resp = await client.post<Response>(`/label/${data.LabelId}/release-schedule`, {Item: data})
			return resp.data.ItemId
		},
		async updateScheduleItem(data: ReleaseScheduleItem) {
			await client.post(`/label/${data.LabelId}/release-schedule/${data.Id}`, {Item: data})
		},
		async deleteScheduleItem(labelId: string, id: string) {
			await client.post(`/label/${labelId}/release-schedule/${id}/delete`)
		},		
	}
}