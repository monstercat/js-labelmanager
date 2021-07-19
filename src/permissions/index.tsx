import {Client} from "../types"
import {Permission, PermissionPresets} from "./model"

function getUpdatePermissionsUrl(module: string, targetId: string, mode?: string) {
	return `/permissions/${module}/${targetId}` + (mode ? "?mode=" + mode : "")
}

function requestPermissionsUrl(module: string, targetId: string) {
	return `/permissions/request/${module}/${targetId}`
}

function getPermissionUrl(module: string, id: string) {
	return `/${module}/${id}/permissions`
}

export type RequestPermissionsPayload = {
	RequestedId: string
	Access: number
	ReturnURL: string
	ObjectTitle: string
	ObjectType: string
}

export enum PermissionsModule {
	Artist = "artist",
	Event = "event",
	FinancialAccount = "sub-account",
	FinancialInvoice = "invoice",
	MasterAccount = "financial-account",
	Release = "release",
	Track = "track",
	TrackContract = "track-contract",
	Writer = "writer",
}

export default function PermissionsApi(client: Client) {
	return {
		async getPresets(): Promise<PermissionPresets> {
			const resp = await client.get<PermissionPresets>("/presets/permissions")
			return resp.data
		},

		async getPermissions(module: PermissionsModule, id: string): Promise<Permission[]> {
			type PermissionPayload = { Permissions: Permission[] }
			const resp = await client.get<PermissionPayload>(getPermissionUrl(module, id))
			return resp.data.Permissions
		},

		async addPermissions(module: PermissionsModule, UserId: string, TargetId: string, Access: number, TargetTitle: string, ReturnUrl: string): Promise<void> {
			await client.post(getUpdatePermissionsUrl(module, TargetId), {
				TargetTitle,
				UserId,
				Access,
				ReturnUrl,
			})
		},

		async modifyPermission(module: PermissionsModule, UserId: string, TargetId: string, Access: number, TargetTitle: string, ReturnUrl: string): Promise<void> {
			await client.post(getUpdatePermissionsUrl(module, TargetId, "modify"), {
				TargetTitle,
				UserId,
				Access,
				ReturnUrl,
			})
		},

		async revokePermission(module: PermissionsModule, UserId: string, TargetId: string, Access: number, TargetTitle: string, ReturnUrl: string): Promise<void> {
			await client.post(getUpdatePermissionsUrl(module, TargetId, "revoke"), {
				TargetTitle,
				UserId,
				Access,
				ReturnUrl,
			})
		},

		async requestPermissions(module: PermissionsModule, TargetId: string, payload: RequestPermissionsPayload): Promise<void> {
			await client.post(requestPermissionsUrl(module, TargetId), payload)
		}
	}
}