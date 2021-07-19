import {ObjectType} from "../types";

export type ServerFugaTransmission = {
	Id: string
	Created: string
	CreatedBy: string
	ObjectId: string
	LabelId: string
	ObjectType: ObjectType

	// From View
	CreatedByName: string
	LastMessageId: string
	LastMessage: string
	LastMessageDetail: { [key: string]: string | number | boolean }
	LastMessageState: FugaTransmissionState
}

export type FugaTransmission = {
	Id: string
	Created: Date
	CreatedBy: string
	ObjectId: string
	LabelId: string
	ObjectType: ObjectType

	// From View
	CreatedByName: string
	LastMessageId: string
	LastMessage: string
	LastMessageDetail: { [key: string]: string | number | boolean }
	LastMessageState: FugaTransmissionState
}

export function convertServerFugaTransmission(t: ServerFugaTransmission): FugaTransmission {
	return {
		...t,
		Created: t.Created? new Date(t.Created): null,
	}
}

export type ServerFugaTransmissionMessage = {
	Id: string
	Created: string
	TransmissionId: string
	State: FugaTransmissionState
	Message: string
	Objects: FugaTransmissionObject []
	Detail: { [key: string]: string | number | boolean }
}

export type FugaTransmissionMessage = {
	Id: string
	Created: Date
	TransmissionId: string
	State: FugaTransmissionState
	Message: string
	Objects: FugaTransmissionObject []
	Detail: { [key: string]: string | number | boolean }
}

export function convertServerFugaTransmissionMessage(m: ServerFugaTransmissionMessage): FugaTransmissionMessage {
	return {
		...m,
		Created: m.Created? new Date(m.Created): null
	}
}

export type FugaTransmissionObject = {
	ObjectId: string
	ObjectType: ObjectType
	MessageId: string
	ObjectName: string
}


export enum FugaTransmissionState {
	Error = "Error",
	Warning = "Warning",
	Info = "Info"
}