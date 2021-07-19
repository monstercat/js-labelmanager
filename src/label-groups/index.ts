import {Access, Client, Paginated, Query} from "../types"
import {ServerLabelGroup} from "./model"
import {ServerLabel} from "../labels/model"

export type GetLabelGroupResponse = {
	LabelGroup: ServerLabelGroup
	Labels: ServerLabel[]
	MyAccess: Access
}

export default function LabelGroupApi(client: Client) {
	return {
		async getLabelGroups(query: Query): Promise<Paginated<ServerLabelGroup>> {
			type Response = {
				LabelGroups: Paginated<ServerLabelGroup>
			}
			const resp = await client.get<Response>("/label-groups", {params: query})
			return resp.data.LabelGroups
		},
		async getLabelGroup(id: string): Promise<GetLabelGroupResponse> {
			const resp = await client.get<GetLabelGroupResponse>("/label-group/" + id)
			return resp.data
		},
		async createLabelGroup(labelGroup: ServerLabelGroup) : Promise<string> {
			type Response = {
				LabelGroupId: string
			}
			const resp = await client.post<Response>("/label-group", {LabelGroup: labelGroup})
			return resp.data.LabelGroupId
		},
		async updateLabelGroup(data: ServerLabelGroup) {
			await client.post("/label-group/" + data.Id, {LabelGroup: data})
		},
		async deleteLabelGroup(id: string) {
			await client.post("/label-group/" + id + "/delete")
		},
	}
}