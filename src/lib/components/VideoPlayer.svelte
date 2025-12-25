<script lang="ts">
	import Plyr from 'plyr';
	import 'plyr/dist/plyr.css';
	import { swipe } from '$lib/actions/swipe';

	interface Props {
		videoId: number;
		onEnded?: () => void;
		onSwipeLeft?: () => void;
		onSwipeRight?: () => void;
		onSwipeUp?: () => void;
	}

	let { videoId, onEnded, onSwipeLeft, onSwipeRight, onSwipeUp }: Props = $props();

	const BASE_URL = 'https://raw.githubusercontent.com/ondersumer07/vinematik-videos/master/vid/';

	let containerElement: HTMLDivElement | undefined = $state();
	let player: Plyr | undefined;
	let hasError = $state(false);
	let currentLoadedId: number | undefined;

	function createPlayer(videoEl: HTMLVideoElement) {
		return new Plyr(videoEl, {
			controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'],
			keyboard: { focused: true, global: false },
			hideControls: true,
			clickToPlay: true,
			resetOnEnd: false,
			loadSprite: true,
			iconUrl: 'https://cdn.plyr.io/3.8.3/plyr.svg',
			// Don't force aspect ratio - let video use its natural dimensions
			ratio: undefined,
			// Use our outer container for fullscreen - this persists across source changes!
			fullscreen: {
				enabled: true,
				fallback: true,
				container: '.plyr-container' // CSS selector, not element!
			},
			i18n: {
				restart: 'Baştan başlat',
				play: 'Oynat',
				pause: 'Duraklat',
				seek: 'Ara',
				played: 'Oynatıldı',
				buffered: 'Önbelleğe alındı',
				currentTime: 'Şu anki zaman',
				duration: 'Süre',
				volume: 'Ses',
				mute: 'Sesi kapat',
				unmute: 'Sesi aç',
				enterFullscreen: 'Tam ekran',
				exitFullscreen: 'Tam ekrandan çık',
				settings: 'Ayarlar',
				speed: 'Hız',
				quality: 'Kalite'
			}
		});
	}

	// Set initial source via Plyr API
	function setSource(id: number) {
		if (!player) return;
		player.source = {
			type: 'video',
			sources: [
				{
					src: `${BASE_URL}${id}.mp4`,
					type: 'video/mp4'
				}
			]
		};
	}

	// Initialize Plyr once when container is available
	$effect(() => {
		if (!containerElement) return;

		const videoEl = containerElement.querySelector('video');
		if (!videoEl) return;

		// First time setup only
		if (!player) {
			player = createPlayer(videoEl);

			player.on('ended', () => onEnded?.());
			player.on('error', () => {
				hasError = true;
			});
			player.on('playing', () => {
				hasError = false;
			});

			// Set initial source
			setSource(videoId);
			currentLoadedId = videoId;

			player.play()?.catch(() => {
				// Autoplay may be blocked
			});
		}

		return () => {
			player?.destroy();
			player = undefined;
			currentLoadedId = undefined;
		};
	});

	// Handle video ID changes separately
	$effect(() => {
		if (player && videoId !== currentLoadedId) {
			hasError = false;
			currentLoadedId = videoId;
			setSource(videoId);
			player.play()?.catch(() => {
				// Autoplay may be blocked
			});
		}
	});

	export function togglePlay() {
		player?.togglePlay();
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	bind:this={containerElement}
	class="plyr-container relative mx-auto aspect-video w-full overflow-hidden rounded-box bg-base-100 shadow-2xl"
	use:swipe={{
		threshold: 50,
		timeout: 500,
		onSwipeLeft,
		onSwipeRight,
		onSwipeUp
	}}
>
	{#if hasError}
		<div class="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-base-100">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-16 w-16 text-error"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
			<p class="text-base-content/70">video bulunamadı</p>
			<p class="text-sm text-base-content/50">#{videoId}</p>
		</div>
	{/if}

	<!-- svelte-ignore a11y_media_has_caption -->
	<video playsinline></video>
</div>

<!-- Video ID badge -->
<div class="mt-3 flex justify-center">
	<div class="badge badge-neutral">#{videoId}</div>
</div>

<style>
	/* Plyr theme customization using vinematik theme variables */
	.plyr-container :global(.plyr) {
		/* Main accent color - uses primary (green) */
		--plyr-color-main: var(--color-primary);

		/* Video background */
		--plyr-video-background: var(--color-base-100);

		/* Menu styling */
		--plyr-menu-background: var(--color-base-200);
		--plyr-menu-color: var(--color-base-content);

		/* Control colors */
		--plyr-control-color: var(--color-base-content);
		--plyr-control-icon-size: 18px;

		/* Range/slider styling */
		--plyr-range-fill-background: var(--color-primary);
		--plyr-range-thumb-background: var(--color-primary-content);
		--plyr-range-thumb-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);

		/* Tooltip styling */
		--plyr-tooltip-background: var(--color-base-200);
		--plyr-tooltip-color: var(--color-base-content);
		--plyr-tooltip-radius: var(--radius-field);

		/* Badge/time styling */
		--plyr-badge-background: var(--color-primary);
		--plyr-badge-text-color: var(--color-primary-content);
		--plyr-badge-border-radius: var(--radius-field);

		/* Font */
		--plyr-font-family: inherit;
		--plyr-font-size-base: 14px;

		height: 100%;
	}

	.plyr-container :global(.plyr__poster) {
		background-color: var(--color-base-300);
	}

	.plyr-container :global(.plyr__video-wrapper) {
		background: var(--color-base-300);
		height: 100%;
	}

	.plyr-container :global(.plyr--video) {
		border-radius: var(--radius-box);
		overflow: hidden;
	}

	/* Ensure video fits within container without cropping */
	.plyr-container :global(video) {
		object-fit: contain;
	}

	/* Control bar background */
	.plyr-container :global(.plyr__controls) {
		background: linear-gradient(
			transparent,
			color-mix(in srgb, var(--color-base-300) 80%, transparent)
		);
	}

	/* Big play button */
	.plyr-container :global(.plyr__control--overlaid) {
		background: var(--color-primary);
		color: var(--color-primary-content);
	}

	.plyr-container :global(.plyr__control--overlaid:hover),
	.plyr-container :global(.plyr__control--overlaid:focus) {
		background: color-mix(in srgb, var(--color-primary) 85%, black);
	}

	/* Progress bar buffered */
	.plyr-container :global(.plyr__progress__buffer) {
		background: color-mix(in srgb, var(--color-base-content) 25%, transparent);
	}
</style>
