export type Writer = {
	Association: string
	Created: Date
	IPI: string
	Id: string
	Name: string
	Tags: string[]
}

export type ServerWriter = {
	Association: string
	Created: string
	IPI: string
	Id: string
	Name: string
	Tags: string[]
}

export function convertServerWriter(w: ServerWriter): Writer {
	return {
		...w,
		Created: w.Created ? new Date(w.Created) : null
	}
}

export function convertWriter(w: Writer): ServerWriter {
	return {
		...w,
		Created: null,
	}
}

export enum WriterRole {
	Author = "Author",
	Composer = "Composer",
	ComposerAuthor = "Composer/Author",
}

export enum WriterTerritory {
	WorldWide = "Worldwide",
	ExclChina = "Worldwide excluding China",
	NorthAmerica = "North America"

}