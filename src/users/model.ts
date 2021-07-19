import {Address} from "../types"

export type ServerUser = {
	ApiKey: string
	Archived: boolean
	Created: string
	Email: string
	Id: string
	IsRobot: boolean
	LastLoggedIn?: string
	LastSeen?: string
	Name: string
	Password: string
	VerificationCode: string
	TwoFactorState: TwoFactorState
	TwoFactorId: string
	LastFourPhone: string
	Address: Address
}

export type ServerSystemUser = ServerUser & {
	Features: string[] //TODO: change to enum AccessFeatures
	Initiated: boolean
}

export enum TwoFactorState {
	Disabled = "Disabled",
	Enabled = "Enabled",
	PendingDisabled = "PendingDisabled",
	PendingEnabled = "PendingEnabled",
	PendingSignIn = "PendingSignIn"
}

export type LabelPersonRole = {
	RoleId: string
	RoleTitle: string
	LabelId: string
	LabelTitle: string
	LabelGroupId: string
	LabelGroupName: string
}

export type ServerDirectoryUser = {
	Id: string
	Name: string
	Email: string
	Created: string
}