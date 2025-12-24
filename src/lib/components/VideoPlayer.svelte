<script lang="ts">
	import { Spring } from 'svelte/motion';
	import { swipe } from '$lib/actions/swipe';

	interface Props {
		videoId: string;
		onEnded?: () => void;
		onSwipeLeft?: () => void;
		onSwipeRight?: () => void;
		onSwipeUp?: () => void;
	}

	let { videoId, onEnded, onSwipeLeft, onSwipeRight, onSwipeUp }: Props = $props();

	const BASE_URL = 'https://raw.githubusercontent.com/tdpg/vinematik-videos/main/';

	let videoElement: HTMLVideoElement | undefined = $state();
	let isLoading = $state(true);
	let hasError = $state(false);
	let progress = $state(0);
	let duration = $state(0);
	let paused = $state(true);
	let isHovering = $state(false);

	let videoSrc = $derived(`${BASE_URL}${videoId}`);

	// Show native controls on hover (desktop only)
	let showControls = $derived(isHovering && !paused && !isLoading && !hasError);

	const progressSpring = new Spring(0, { stiffness: 0.1, damping: 0.5 });

	$effect(() => {
		progressSpring.target = progress;
	});

	function handleLoadStart() {
		isLoading = true;
		hasError = false;
	}

	function handleCanPlay() {
		isLoading = false;
		videoElement?.play();
	}

	function handleError() {
		isLoading = false;
		hasError = true;
	}

	function handleTimeUpdate() {
		if (videoElement && duration > 0) {
			progress = (videoElement.currentTime / duration) * 100;
		}
	}

	function handleLoadedMetadata() {
		if (videoElement) {
			duration = videoElement.duration;
		}
	}

	function handleVideoClick() {
		// Only handle click when native controls are not showing
		// Otherwise, let the native controls handle play/pause
		if (!showControls && videoElement) {
			if (paused) {
				videoElement.play();
			} else {
				videoElement.pause();
			}
		}
	}

	export function togglePlay() {
		if (videoElement) {
			if (paused) {
				videoElement.play();
			} else {
				videoElement.pause();
			}
		}
	}

	function handleEnded() {
		onEnded?.();
	}
</script>

<!-- Fixed container to prevent layout shift -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="group relative aspect-video w-full max-w-2xl overflow-hidden rounded-box bg-base-300 shadow-2xl"
	use:swipe={{
		threshold: 50,
		timeout: 500,
		onSwipeLeft,
		onSwipeRight,
		onSwipeUp
	}}
	onmouseenter={() => (isHovering = true)}
	onmouseleave={() => (isHovering = false)}
>
	{#if isLoading}
		<div class="absolute inset-0 z-10 flex items-center justify-center bg-base-300">
			<span class="loading loading-lg loading-spinner text-primary"></span>
		</div>
	{/if}

	{#if hasError}
		<div class="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-base-300">
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
	<video
		bind:this={videoElement}
		bind:paused
		src={videoSrc}
		class="h-full w-full cursor-pointer object-contain"
		class:show-controls={showControls}
		controls={showControls}
		playsinline
		onclick={handleVideoClick}
		onloadstart={handleLoadStart}
		oncanplay={handleCanPlay}
		onerror={handleError}
		ontimeupdate={handleTimeUpdate}
		onloadedmetadata={handleLoadedMetadata}
		onended={handleEnded}
	></video>

	<!-- Progress bar (hidden when native controls are visible) -->
	<div
		class="absolute right-0 bottom-0 left-0 h-1 bg-base-100/30 transition-opacity duration-200"
		class:opacity-0={showControls}
	>
		<div class="h-full bg-primary transition-all" style="width: {progressSpring.current}%"></div>
	</div>

	<!-- Play/Pause overlay -->
	{#if paused && !isLoading && !hasError}
		<button
			class="absolute inset-0 z-5 flex items-center justify-center bg-base-300/30"
			onclick={togglePlay}
			aria-label="videoyu oynat"
		>
			<div class="btn btn-circle btn-lg btn-primary">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-8 w-8"
					fill="currentColor"
					viewBox="0 0 24 24"
				>
					<path d="M8 5v14l11-7z" />
				</svg>
			</div>
		</button>
	{/if}

	<!-- Swipe hint overlay (only on touch devices) -->
	<div
		class="pointer-events-none absolute top-4 right-4 left-4 flex justify-between opacity-0 transition-opacity peer-active:opacity-100"
	>
		<div class="badge badge-ghost badge-sm">← önceki</div>
		<div class="badge badge-ghost badge-sm">sonraki →</div>
	</div>
</div>

<!-- Video ID badge -->
<div class="mt-3 badge badge-neutral">
	#{videoId}
</div>
