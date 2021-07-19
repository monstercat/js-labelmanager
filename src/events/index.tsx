import {
	Access,
	Client,
	Paginated,
	Query,
} from "../types"
import {convertLmEvent, LmEvent, ServerEvent} from "./model"
import {LabelBasic} from "../labels/model"
import {addFile, FileSortUpdate, getFiles, getSignedUrlInfo, updateFileSort} from "../files"
import {applyImageOptionsToBase, ImageOptions, ServerFile, SignedUrlInfo} from "../files/model"

export type GetEventsResponse = {
	Events: Paginated<ServerEvent>
	Labels: LabelBasic[]
}

export type GetEventResponse = {
	Event: ServerEvent
	MyAccess: Access
}

export default function EventsApi(client: Client) {
	return {
		async getEvents(query: Query): Promise<GetEventsResponse> {
			const resp = await client.get<GetEventsResponse>("/events", {params: query})
			return resp.data
		},
		async getEvent(id: string): Promise<GetEventResponse> {
			const resp = await client.get<GetEventResponse>("/event/" + id)
			return resp.data
		},
		// TODO: implement ical funciton
		// async getEventIcal(id: string) {
		//
		// },
		eventCoverUri(id: string, options?: ImageOptions): string {
			return applyImageOptionsToBase(`${client.defaults.baseURL}/event/${id}/cover`, options)
		},
		eventPosterUri(id: string, options?: ImageOptions): string {
			return applyImageOptionsToBase(`${client.defaults.baseURL}/event/${id}/poster`, options)
		},
		async getEventCoverInfo(id: string): Promise<SignedUrlInfo> {
			return await getSignedUrlInfo(client, `/event/${id}/cover-info`)
		},
		async getEventPosterInfo(id: string): Promise<SignedUrlInfo> {
			return await getSignedUrlInfo(client, `/event/${id}/poster-info`)
		},
		async createEvent(event: LmEvent): Promise<string> {
			type Response = {
				EventId: string
			}
			const resp = await client.post<Response>("/event", {Event: convertLmEvent(event)})
			return resp.data.EventId
		},
		async updateEvent(event: LmEvent) {
			if (!event.Id) return
			await client.post(`/event/${event.Id}`, {Event: convertLmEvent(event)})
		},
		async deleteEvent(id: string) {
			if (!id) return
			await client.post(`/event/${id}/delete`)
		},
		async updateEventCover(eventId: string, file: File) {
			if (!eventId) return

			const data = new FormData()
			data.append('image', file)
			await client.post(`/event/${eventId}/cover`, data)
		},
		async deleteEventCover(eventId: string) {
			await client.post(`/event/${eventId}/cover/delete`)
		},
		async updateEventPoster(eventId: string, file: File) {
			if (!eventId) return
			const data = new FormData()
			data.append('image', file)
			await client.post(`/event/${eventId}/poster`, data)
		},
		async deleteEventPoster(eventId: string) {
			await client.post(`/event/${eventId}/poster/delete`)
		},
		async addEventFiles(id: string, file: File) {
			await addFile(client, `/event/${id}/add-file`, file)
		},
		async getEventFiles(id: string): Promise<Paginated<ServerFile>> {
			return await getFiles(client, `/event/${id}/files`)
		},
		async updateFileSort(id: string, files: FileSortUpdate[]) {
			await updateFileSort(client, `/event/${id}/files`, files)
		},
		async deleteEventFile(id: string, fileId: string) {
			await client.post(`/event/${id}/file/${fileId}/delete`)
		},
		eventFileUri(id: string, fileId: string): string {
			return `${client.defaults.baseURL}/event/${id}/file/${fileId}/download`
		},
		async getEventFileInfo(id: string, fileId: string): Promise<SignedUrlInfo> {
			return await getSignedUrlInfo(client, `/event/${id}/file/${fileId}/info`)
		}
	}
}