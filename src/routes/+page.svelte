<script lang="ts">
	import VideoPlayer from '$lib/components/VideoPlayer.svelte';
	import NavigationControls from '$lib/components/NavigationControls.svelte';
	import Header from '$lib/components/Header.svelte';

	const TOTAL_VIDEOS = 3970;
	const BASE_URL = 'https://raw.githubusercontent.com/ondersumer07/vinematik-videos/master/vid/';

	function getRandomVideoId(exclude?: number): number {
		let id = Math.floor(Math.random() * TOTAL_VIDEOS) + 1;
		// Avoid generating the same ID as the excluded one
		while (exclude !== undefined && id === exclude) {
			id = Math.floor(Math.random() * TOTAL_VIDEOS) + 1;
		}
		return id;
	}

	// History management for back/forth navigation
	const initialVideoId = getRandomVideoId();
	let history: number[] = $state([initialVideoId]);
	let historyIndex = $state(0);

	// Preloading: always have the next random video ready
	// This is ONLY for the "random" action, not for history navigation
	let preloadedNextId = $state(getRandomVideoId(initialVideoId));

	let currentVideoId = $derived(history[historyIndex]);
	let preloadUrl = $derived(`${BASE_URL}${preloadedNextId}.mp4`);

	function goToRandomVideo() {
		// Use the preloaded video ID for instant playback
		const newId = preloadedNextId;
		// Remove any forward history when going to a new random video
		history = [...history.slice(0, historyIndex + 1), newId];
		historyIndex = history.length - 1;
		// Generate the next preload (different from the new current video)
		preloadedNextId = getRandomVideoId(newId);
	}

	function goBack() {
		if (historyIndex > 0) {
			historyIndex--;
		}
	}

	function goForward() {
		if (historyIndex < history.length - 1) {
			historyIndex++;
		}
	}

	// Go forward in history if available, otherwise go to random
	function goForwardOrRandom() {
		if (canGoForward) {
			goForward();
		} else {
			goToRandomVideo();
		}
	}

	let canGoBack = $derived(historyIndex > 0);
	let canGoForward = $derived(historyIndex < history.length - 1);

	// Reference to the video player for play/pause control
	let videoPlayer: ReturnType<typeof VideoPlayer> | undefined = $state();

	// Keyboard shortcuts
	function handleKeydown(event: KeyboardEvent) {
		// Ignore if user is typing in an input
		if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
			return;
		}

		switch (event.key) {
			case 'ArrowLeft':
				if (canGoBack) goBack();
				break;
			case 'ArrowRight':
				goForwardOrRandom();
				break;
			case 'r':
			case 'ArrowUp':
				goToRandomVideo();
				break;
			case ' ':
				event.preventDefault();
				videoPlayer?.togglePlay();
				break;
		}
	}

	function handleVideoEnded() {
		goToRandomVideo();
	}

	// Swipe handlers
	// Swipe left = next (forward in history or random)
	// Swipe right = previous video
	function handleSwipeLeft() {
		goForwardOrRandom();
	}

	function handleSwipeRight() {
		if (canGoBack) goBack();
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<svelte:head>
	<title>vinematik</title>
	<meta name="description" content="Arşivden rastgele Vine videoları izle" />
</svelte:head>

<main
	class="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center bg-base-100 p-4"
>
	<!-- Pass currentVideoId as prop to have it dynamically to share -->
	<Header {currentVideoId} />
	<div class="flex w-full flex-col items-center gap-4">
		<VideoPlayer
			bind:this={videoPlayer}
			videoId={currentVideoId}
			onEnded={handleVideoEnded}
			onSwipeLeft={handleSwipeLeft}
			onSwipeRight={handleSwipeRight}
			onSwipeUp={goToRandomVideo}
		/>

		<NavigationControls
			{canGoBack}
			onPrevious={goBack}
			onNext={goForwardOrRandom}
			onRandom={goToRandomVideo}
		/>

		<!-- Keyboard hints (desktop) -->
		<div class="hidden flex-wrap justify-center gap-3 text-xs text-base-content/40 sm:flex">
			<span class="flex items-center gap-1">
				<kbd class="kbd kbd-xs">←</kbd>
				önceki
			</span>
			<span class="flex items-center gap-1">
				<kbd class="kbd kbd-xs">boşluk</kbd>
				oynat/duraklat
			</span>
			<span class="flex items-center gap-1">
				<kbd class="kbd kbd-xs">r</kbd>
				rastgele
			</span>
			<span class="flex items-center gap-1">
				<kbd class="kbd kbd-xs">→</kbd>
				sonraki
			</span>
		</div>
		<!-- Swipe hints (mobile) -->
		<div class="flex flex-wrap justify-center gap-3 text-xs text-base-content/40 sm:hidden">
			<span>← önceki</span>
			<span>↑ rastgele</span>
			<span>sonraki →</span>
		</div>
	</div>
</main>

<!-- Preload next random video OUTSIDE the {#key} block so it persists -->
<!-- svelte-ignore a11y_media_has_caption -->
<video src={preloadUrl} preload="auto" class="hidden" muted></video>
