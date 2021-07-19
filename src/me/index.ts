import {Address, Client, Paginated, Query} from "../types"
import {ServerUser} from "../users/model"
import {Feature} from "../roles/model"
import {ServerStatement} from "../statements/model"
import {ServerTrackContract} from "../contracts/model"
import {FinancialAccount} from "../financial-accounts/model"
import {Notification} from "./model"

export type MeResponse = {
	User: ServerUser
	HasDirectAccess: { [key: string]: boolean }
	LabelAccessFeatures: Feature[]
}

export type MyStatementsResponse = {
	User: ServerUser
	Statements: Paginated<ServerStatement>
}

export type MyContractsResponse = {
	User: ServerUser
	Statements: Paginated<ServerTrackContract>
}

export type MyAccountsResponse = {
	User: ServerUser
	FinancialAccounts: Paginated<FinancialAccount>
}

export type NotificationsResponse = {
	Notifications: Notification[]
	NotificationTypes: string[]
}

export type UpdateMePayload = Address & {
	Name: string
	Email: string
	NewPassword: string
	ConfirmPassword: string
	CurrentPassword: string
}

export default function MeApi(client: Client) {
	return {
		async me(): Promise<MeResponse> {
			return (await client.get("/me")).data
		},
		async myStatements(q: Query): Promise<MyStatementsResponse> {
			return (await client.get<MyStatementsResponse>("/me/statements", {params: q})).data
		},
		async myContracts(q: Query): Promise<MyContractsResponse> {
			return (await client.get<MyContractsResponse>("/me/contracts", {params: q})).data
		},
		async myFinancialAccounts(q: Query): Promise<MyAccountsResponse> {
			return (await client.get<MyAccountsResponse>("/me/financial-accounts", {params: q})).data
		},
		async myNotifications(): Promise<NotificationsResponse> {
			return (await client.get<NotificationsResponse>("/me/notifications")).data
		},
		async updateMe(user: UpdateMePayload) {
			await client.post(`/me`, {
				User: user
			})
		},
		async enable2FA(countryCode: number, phoneNumber: string) {
			await client.post(`/me/two-factor/enable`, {
				CountryCode: countryCode,
				PhoneNumber: phoneNumber,
			})
		},
		async disable2FA() {
			await client.post(`/me/two-factor/disable`)
		},
		async verify2FA(token: string) {
			await client.post(`/me/two-factor/verify`, {
				Token: token,
			})
		},
		async request2FAToken() {
			await client.post(`/me/two-factor/request-token`)
		},
		async addNotification(notif: Notification) {
			await client.post("/me/notifications", {
				Add: notif,
			})
		},
		async removeNotifications(notifs: Notification[]) {
			await client.post("/me/notifications", {
				Remove: notifs,
			})
		}
	}
}