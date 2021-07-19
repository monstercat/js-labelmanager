import {Client, Paginated, Query} from "../types"
import {EventCategory} from "./model"

export default function LabelEventCategoriesApi(client: Client) {
	return {
		async getEventCategories(labelId: string, q: Query): Promise<Paginated<EventCategory>> {
			type Response = {
				EventCategories: Paginated<EventCategory>
			}
			const resp = await client.get<Response>(`/label/${labelId}/event-categories`, {params: q})
			return resp.data.EventCategories
		},
		async createEventCategory(cat: EventCategory): Promise<string> {
			type Response = {
				Id: string
			}
			const resp = await client.post<Response>(`/label/${cat.LabelId}/event-category`, {
				EventCategory: cat,
			})
			return resp.data.Id
		},
		async updateEventCategory(cat: EventCategory): Promise<void> {
			await client.post(`/label/${cat.LabelId}/event-category/${cat.Id}`, {
				EventCategory: cat,
			})
		},
		async deleteEventCategory(cat: EventCategory): Promise<void> {
			await client.post(`/label/${cat.LabelId}/event-category/${cat.Id}/delete`)
		}
	}
}