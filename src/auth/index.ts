import {Address, Client} from "../types"
import {ServerUser} from "../users/model"

export const ErrNeed2FA = "user needs 2fa"

export default function AuthApi(client: Client) {
	return {
		async signIn(email: string, password: string): Promise<ServerUser & Address> {
			const resp = await client.post<ServerUser & Address>("/sign-in", {Email: email, Password: password})
			if (resp.status == 203) {
				throw ErrNeed2FA
			}
			return resp.data
		},
		async getUserNameByVerifyCode(code: string): Promise<string> {
			type Response = {
				Name: string
			}
			const resp = await client.get<Response>(`/verify/${code}`)
			return resp.data.Name
		},
		async verify(code: string, name: string, password: string): Promise<ServerUser> {
			const resp = await client.post<ServerUser>(`/verify`, {
				Name: name,
				VerificationCode: code,
				Password: password
			})
			return resp.data
		},
		async resetPassword(code: string, password: string): Promise<ServerUser> {
			const resp = await client.post<ServerUser>("/reset-password", {
				VerificationCode: code,
				Password: password
			})
			return resp.data
		},
		async forgotPassword(email: string, returnUrl: string) {
			await client.post("/forgot-password", {
				Email: email,
				ReturnUrl: returnUrl
			})
		},
		async signOut() {
			await client.get("/sign-out")
		}
	}
}