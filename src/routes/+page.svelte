<script lang="ts">
	import VideoPlayer from '$lib/components/VideoPlayer.svelte';
	import NavigationControls from '$lib/components/NavigationControls.svelte';
	import Header from '$lib/components/Header.svelte';

	const TOTAL_VIDEOS = 3970;

	function getRandomVideoId(): number {
		return Math.floor(Math.random() * TOTAL_VIDEOS) + 1;
	}


	// History management for back/forth navigation
	let history: number[] = $state([getRandomVideoId()]);
	let historyIndex = $state(0);

	// Preloading: always have the next video ready
	let preloadedNextId = $state(getRandomVideoId());

	let currentVideoId = $derived(history[historyIndex]);

	// Preload the next video whenever current video changes
	$effect(() => {
		// Access currentVideoId to create dependency
		const _ = currentVideoId;
		// Generate a new preload ID (different from current)
		let nextId = getRandomVideoId();
		while (nextId === currentVideoId) {
			nextId = getRandomVideoId();
		}
		preloadedNextId = nextId;
	});

	function goToRandomVideo() {
		// Use the preloaded video ID for instant playback
		const newId = preloadedNextId;
		// Remove any forward history when going to a new random video
		history = [...history.slice(0, historyIndex + 1), newId];
		historyIndex = history.length - 1;
		// Note: the $effect will automatically preload the next video
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
				goToRandomVideo();
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

	// Swipe handlers - match the original behavior
	// Swipe left = next random video
	// Swipe right = previous video
	function handleSwipeLeft() {
		goToRandomVideo();
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

<main class="min-h-screen bg-base-200 flex flex-col items-center justify-center p-4">
	<Header />

	<div class="flex flex-col items-center gap-4 w-full max-w-2xl">
		{#key currentVideoId}
			<VideoPlayer
				videoId={currentVideoId}
				preloadVideoId={preloadedNextId}
				onEnded={handleVideoEnded}
				onSwipeLeft={handleSwipeLeft}
				onSwipeRight={handleSwipeRight}
			/>
		{/key}

		<NavigationControls
			{canGoBack}
			{canGoForward}
			onPrevious={goBack}
			onNext={goForward}
			onRandom={goToRandomVideo}
		/>

		<!-- Keyboard/Swipe hints -->
		<div class="flex flex-wrap justify-center gap-3 text-xs text-base-content/40">
			<span class="flex items-center gap-1">
				<kbd class="kbd kbd-xs">←</kbd>
				<span class="hidden sm:inline">or swipe →</span>
				prev
			</span>
			<span class="flex items-center gap-1">
				<kbd class="kbd kbd-xs">space</kbd> random
			</span>
			<span class="flex items-center gap-1">
				<kbd class="kbd kbd-xs">→</kbd>
				<span class="hidden sm:inline">or swipe ←</span>
				next
			</span>
		</div>
	</div>
</main>
