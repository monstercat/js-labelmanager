import {ServerAudioLanguage} from "./model"
import {Client, Paginated, Query} from "../types"

export default function AudioLanguageApi(client: Client) {
	return {
		async getLanguages(query: Query): Promise<Paginated<ServerAudioLanguage>> {
			type Response = {
				Languages: Paginated<ServerAudioLanguage>
			}
			const resp = await client.get<Response>("/audio-languages", {params: query})
			return resp.data.Languages
		}
	}
}