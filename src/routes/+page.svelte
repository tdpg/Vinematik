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
			case ' ':
				event.preventDefault();
				goToRandomVideo();
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
	<title>vinematik - random vines</title>
	<meta name="description" content="Watch random Vine videos from the archive" />
</svelte:head>

<main class="flex min-h-screen w-full flex-col items-center justify-center bg-base-200 p-4">
	<div class="flex w-full max-w-2xl flex-col items-center">
		<Header />

		<div class="flex w-full flex-col items-center gap-4">
			{#key currentVideoId}
				<VideoPlayer
					videoId={currentVideoId}
					onEnded={handleVideoEnded}
					onSwipeLeft={handleSwipeLeft}
					onSwipeRight={handleSwipeRight}
				/>
			{/key}

			<NavigationControls
				{canGoBack}
				onPrevious={goBack}
				onNext={goForwardOrRandom}
				onRandom={goToRandomVideo}
			/>

			<!-- Keyboard/Swipe hints -->
			<div class="flex flex-wrap justify-center gap-3 text-xs text-base-content/40">
				<span class="flex items-center gap-1">
					<kbd class="kbd kbd-xs">←</kbd>
					prev
				</span>
				<span class="flex items-center gap-1">
					<kbd class="kbd kbd-xs">space</kbd>
					<span class="hidden sm:inline">or swipe</span>
					random
				</span>
				<span class="flex items-center gap-1">
					<kbd class="kbd kbd-xs">→</kbd>
					next
				</span>
			</div>
		</div>
	</div>
</main>

<!-- Preload next random video OUTSIDE the {#key} block so it persists -->
<!-- svelte-ignore a11y_media_has_caption -->
<video src={preloadUrl} preload="auto" class="hidden" muted></video>
