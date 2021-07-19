import {Access, Client, Paginated, Query} from "../types"
import {LabelRole} from "./model"
import {ServerDirectoryUser} from "../users/model"

export enum RoleModule {
	Label = "label",
	LabelGroup = "label-group"
}

export type GetLabelRolesResponse = {
	MyAccess: Access
	Roles: Paginated<LabelRole>
}

export default function RolesApi(client: Client) {
	return {
		async getRoles(module: RoleModule, moduleId: string, query: Query) : Promise<GetLabelRolesResponse> {
			const resp = await client.get<GetLabelRolesResponse>(`${module}/${moduleId}/roles`, {params: query})
			return resp.data
		},

		async getRole(module: RoleModule, moduleId: string, roleId: string) : Promise<LabelRole> {
			type Response = {
				Role: LabelRole
			}
			const resp = await client.get<Response>(`${module}/${moduleId}/role/${roleId}`)
			return resp.data.Role
		},

		async updateRole(module: RoleModule, moduleId: string, Role: LabelRole) {
			await client.post(`${module}/${moduleId}/role/${Role.Id}`, {Role})
		},

		async addRole(module: RoleModule, moduleId: string, Role: LabelRole) : Promise<string>{
			type Response = {
				RoleId: string
			}
			const resp = await client.post<Response>(`${module}/${moduleId}/role`, {Role})
			return resp.data.RoleId
		},

		async deleteRole(module: RoleModule, moduleId: string, roleId: string) {
			return await client.post(`${module}/${moduleId}/role/${roleId}/delete`)
		},

		async getRoleUsers(module: RoleModule, moduleId: string, roleId: string, query: Query): Promise<Paginated<ServerDirectoryUser>> {
			type Response = {
				Users: Paginated<ServerDirectoryUser>
			}
			const resp = await client.get<Response>(`/${module}/${moduleId}/role/${roleId}/persons`, {params: query})
			return resp.data.Users
		},

		async addRolePerson(module: RoleModule, moduleId: string, roleId: string, personId: string) {
			await client.post(`/${module}/${moduleId}/role/${roleId}/person?mode=add`, {
				PersonId: personId,
			})
		},

		async deleteRoleUser(module: RoleModule, moduleId: string, roleId: string, personId: string) {
			await client.post(`/${module}/${moduleId}/role/${roleId}/person?mode=remove`, {
				PersonId: personId,
			})
		},
	}
}