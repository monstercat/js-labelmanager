import {Client} from "../types"
import {ShareCategory, ShareType} from "./model"

export default function ShareTypesApi(client: Client) {
	return {
		async createShareCategory(category: ShareCategory) {
			await client.post(`/label/${category.LabelId}/share-category`, {
				ShareCategory: category,
			})
		},
		async updateShareCategory(labelId: string, category: ShareCategory) {
			await client.post(`/label/${labelId}/share-category/${category.Id}`, {
				Sharecategory: category,
			})
		},
		async deleteShareCategory(labelId: string, categoryId: string) {
			await client.post(`/label/${labelId}/share-category/${categoryId}`)
		},
		async createShareType(labelId: string, categoryId: string, t: ShareType, oldShareType?: ShareType) {
			type Payload = {
				ShareType: ShareType
				OldShareType?: ShareType
			}
			const p : Payload = {
				ShareType: t,
			}
			if (oldShareType) {
				p.OldShareType = oldShareType
			}
			await client.post(`/label/${labelId}/share-category/${categoryId}/type`, p)
		},
		async deleteShareType(labelId: string, categoryId: string, t: ShareType) {
			await client.post(`/label/${labelId}/share-category/${categoryId}/type/delete`, {
				ShareType: t,
			})
		}
	}
}