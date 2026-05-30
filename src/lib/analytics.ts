import {
	creatorIdFromVideoId,
	creatorNameById,
	creatorNameFromVideoId,
	videoSlug
} from './creators';

type EventData = Record<string, string | number | boolean>;

interface UmamiApi {
	track: (event: string, data?: EventData) => void;
}

/** SSR-safe accessor for the Umami client. Returns null on the server or before the script loads. */
function umami(): UmamiApi | null {
	if (typeof window === 'undefined') return null;
	const u = (window as unknown as { umami?: UmamiApi }).umami;
	return u && typeof u.track === 'function' ? u : null;
}

/** Fire a custom event. Never throws — analytics must never break the UX. */
function track(event: string, data?: EventData): void {
	try {
		umami()?.track(event, data);
	} catch {
		/* best-effort: ignore analytics failures */
	}
}

export type ViewSource = 'initial' | 'shared-link' | 'random' | 'next' | 'previous' | 'autoplay';

function videoFields(videoId: string): EventData {
	return {
		video: videoSlug(videoId),
		creator: creatorIdFromVideoId(videoId),
		creatorName: creatorNameFromVideoId(videoId)
	};
}

/** A video became the active/playing one. `viewIndex` is the running view count for this visit. */
export function trackVideoView(videoId: string, source: ViewSource, viewIndex: number): void {
	if (!videoId) return;
	track('video-view', { ...videoFields(videoId), source, viewIndex });
}

/** A video played all the way to its end. */
export function trackVideoCompleted(videoId: string): void {
	if (!videoId) return;
	track('video-completed', videoFields(videoId));
}

/** The user left a video before it finished. */
export function trackVideoSkipped(
	videoId: string,
	watchedSeconds: number,
	percentWatched: number,
	via: ViewSource
): void {
	if (!videoId) return;
	track('video-skipped', {
		...videoFields(videoId),
		watchedSeconds: Math.round(watchedSeconds),
		percentWatched: Math.round(percentWatched),
		via
	});
}

/** A video source failed to load. */
export function trackVideoError(videoId: string): void {
	if (!videoId) return;
	track('video-error', videoFields(videoId));
}

/** The share modal was opened. */
export function trackShareModalOpen(videoId: string): void {
	track('share-modal-open', videoId ? videoFields(videoId) : {});
}

/** A share action was taken. */
export function trackShare(
	videoId: string,
	method: 'copy' | 'native' | 'whatsapp' | 'twitter'
): void {
	track('share', { ...(videoId ? videoFields(videoId) : {}), method });
}

/** A single creator was toggled in the filter. */
export function trackFilterChange(
	creatorId: string,
	action: 'select' | 'deselect',
	selectedCount: number
): void {
	track('filter-creator', {
		creator: creatorId,
		creatorName: creatorNameById(creatorId),
		action,
		selectedCount
	});
}

/** The "select all / clear all" filter control was used. */
export function trackFilterToggleAll(
	action: 'select-all' | 'deselect-all',
	selectedCount: number
): void {
	track('filter-toggle-all', { action, selectedCount });
}

/** The light/dark theme was changed. */
export function trackThemeChange(theme: 'light' | 'dark'): void {
	track('theme-change', { theme });
}
