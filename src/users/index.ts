import {Client, Paginated} from "../types"
import {LabelPersonRole, ServerSystemUser, ServerUser} from "./model"
import {Feature} from "../roles/model"

export type ServerSystemUserResponse = {
	User: ServerSystemUser
	Roles: LabelPersonRole[]
}

export type UpdateUserFeaturesPayload = {
	Id: string
	Features: Feature[]
}

export type InvitePayload = {
	Email: string
	Name: string
	SendInviteEmail: boolean
	ReturnUrlBase: string
}

export default function UsersApi(client: Client) {
	return {
		// Invite a person to Label Manager
		async create(payload: InvitePayload): Promise<string> {
			type Response = {
				UserId: string
			}
			// Add the ReturnUrlBase
			if (payload.SendInviteEmail) {
				payload.ReturnUrlBase = location.protocol + `/` + location.host + `/invite`
			}
			const newUser = await client.post<Response>(`/user`, payload)
			return newUser.data.UserId
		},
		async getUsers(opts = {}): Promise<Paginated<ServerUser>> {
			type Response = {
				Users: Paginated<ServerUser>
			}
			const resp = await client.get<Response>(`/users`, {params: opts})
			return resp.data.Users
		},
		getSystemUsers: async function (opts = {}): Promise<Paginated<ServerUser>> {
			type Response = {
				Users: Paginated<ServerSystemUser>
			}
			const resp = await client.get<Response>(`/system-users`, {params: opts})
			return resp.data.Users
		},

		async getSystemUser(userId): Promise<ServerSystemUserResponse> {
			const resp = await client.get<ServerSystemUserResponse>(`/system-user/${userId}`)
			return resp.data
		},

		async updateSystemUser(data: ServerUser) {
			await client.post(`/system-user/${data.Id}`, {User: data})
		},

		async updateUserFeatures(data: UpdateUserFeaturesPayload) {
			await client.post(`/system-user/${data.Id}/features`, data)
		},

		async generateKey(userId: string) {
			await client.post(`/system-user/${userId}/generate-key`)
		},

		// NOTE: this route should be used only by administration pages. A user who does not have administration privileges
		// can simply recreate the user.
		async sendUserInvite(userId: string) {
			const ReturnUrlBase = location.protocol + `/` + location.host + `/invite`
			await client.post(`/system-user/${userId}/send-invite`, {ReturnUrlBase})
		}
	}
}