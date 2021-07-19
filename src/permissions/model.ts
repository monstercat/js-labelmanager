import {Access} from "../types"

export type UserAccess = {
	UserId: string
	UserName: string
	UserEmail: string
	Access: Access
}

export type Permission = {
	UserId: string
	UserName: string
	UserEmail: string
	Access: number
}

export type PermissionPresets = {
	Assignable: {[key: number]: number[]}
	Descriptor: {[key: number]: string}
	LabelAccessFeatures: string[]
}