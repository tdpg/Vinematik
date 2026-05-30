export interface Creator {
	id: string;
	name: string;
	count: number;
}

// Single source of truth for the vine creators and their archive sizes.
export const allCreators: Creator[] = [
	{ id: 'ae', name: 'Aykut Elmas', count: 1121 },
	{ id: 'sd', name: 'Sergen Deve', count: 379 },
	{ id: 'hig', name: 'Halil İbrahim Göker', count: 134 },
	{ id: 'kf', name: 'Kontravolta Fevzi', count: 110 },
	{ id: 'ig', name: 'İlker Gümüşoluk', count: 867 },
	{ id: 'cg', name: 'Cem Gelinoğlu', count: 244 },
	{ id: 'uca', name: 'Uğur Can Akgül', count: 218 },
	{ id: 'ca', name: 'Cihan Akıncı', count: 445 },
	{ id: 'em', name: 'Emre Mutlu', count: 1098 },
	{ id: 'ak', name: 'Ahmet Karya', count: 585 }
];

/** Extract the creator id (leading letters) from a video id, e.g. "ae123.mp4" -> "ae". */
export function creatorIdFromVideoId(videoId: string): string {
	const match = videoId.match(/^[a-z]+/i);
	return match ? match[0].toLowerCase() : 'unknown';
}

/** Resolve a human-readable creator name from a creator id; falls back to the id. */
export function creatorNameById(id: string): string {
	return allCreators.find((c) => c.id === id)?.name ?? id;
}

/** Resolve a human-readable creator name from a video id. */
export function creatorNameFromVideoId(videoId: string): string {
	return creatorNameById(creatorIdFromVideoId(videoId));
}

/** Strip the .mp4 extension for cleaner labels: "ae123.mp4" -> "ae123". */
export function videoSlug(videoId: string): string {
	return videoId.replace(/\.mp4$/i, '');
}
