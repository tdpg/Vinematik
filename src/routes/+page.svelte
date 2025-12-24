<script lang="ts">
	import VideoPlayer from '$lib/components/VideoPlayer.svelte';
	import NavigationControls from '$lib/components/NavigationControls.svelte';
	import Header from '$lib/components/Header.svelte';
	import Filter from '$lib/components/Filter.svelte';

	// OLD WAY OF GETTING RANDOM VINES
	const BASE_URL = 'https://raw.githubusercontent.com/tdpg/vinematik-videos/main/';

	// NEW WAY OF GETTING RANDOM VINES
	// Error handling: if no creators are selected, create a toast and select all automatically
	let showResetToast = $state(false);

	const triggerResetToast = () => {
		showResetToast = true;
		setTimeout(() => {
			showResetToast = false;
		}, 3000);
	};

	// Creator list with their video counts
	const allCreators = [
		{ id: 'ae', name: 'Aykut Elmas', count: 1099 },
		{ id: 'hig', name: 'Halil İbrahim Göker', count: 134 },
		{ id: 'em', name: 'Emre Mutlu', count: 1098 },
		{ id: 'ak', name: 'Ahmet Karya', count: 60 },
		{ id: 'ca', name: 'Cihan Akıncı', count: 90 },
		{ id: 'ig', name: 'İlker Gümüşoluk', count: 55 },
		{ id: 'cg', name: 'Cem Gelinoğlu', count: 40 },
		{ id: 'sd', name: 'Sergen Deve', count: 373 },
		{ id: 'uca', name: 'Uğur Can Akgül', count: 35 }
	];

	let selectedIds = $state(allCreators.map((c) => c.id));
	let currentVideoSrc = $state(''); // NEW currentVideoId

	// Helper random number function
	const getRandomNumber = (min: number, max: number) => {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};

	// Toggle creator in an out of the selectedIds array
	const toggleCreator = (id: string) => {
		if (selectedIds.includes(id)) {
			// If already existing, remove
			selectedIds = selectedIds.filter((item) => item !== id);
		} else {
			// If non-existent, add
			selectedIds = [...selectedIds, id];
		}
	};

	// Select or deselect all creators
	const toggleAllSelection = () => {
		if (selectedIds.length > 0) {
			// If some stuff are selected, deselect all
			selectedIds = [];
		} else {
			// If nothing is selected, select all
			selectedIds = allCreators.map((c) => c.id);
		}
	};

	// --- Random selection with filters ---
	const pickRandomVine = () => {
		// A) If nobody is selected, alert and return
		if (selectedIds.length === 0) {
			triggerResetToast(); // Nobody is selected toast trigger
			selectedIds = allCreators.map((c) => c.id); // Select all automatically
		}

		// B) Filter selected creators by their id
		const activeCreators = allCreators.filter((c) => selectedIds.includes(c.id));

		// C) Select a random viner from active creators
		const randomCreatorIndex = getRandomNumber(0, activeCreators.length - 1);
		const targetCreator = activeCreators[randomCreatorIndex];

		// D) Select a random number in the range of that viner
		const randomVideoNum = getRandomNumber(1, targetCreator.count);

		// E) Create file name, doesn't need to return as we will use currentVideoSrc directly
		currentVideoSrc = `${targetCreator.id}${randomVideoNum}.mp4`;
		return currentVideoSrc;
	};

	// END OF CHANGES

	// History management for back/forth navigation
	const initialVideoId = pickRandomVine();
	let history: string[] = $state([initialVideoId]);
	let historyIndex = $state(0);

	// Preloading: always have the next random video ready
	// This is ONLY for the "random" action, not for history navigation
	let preloadedNextId = $state(pickRandomVine());

	let currentVideoId = $derived(history[historyIndex]);
	let preloadUrl = $derived(`${BASE_URL}${preloadedNextId}`);

	function goToRandomVideo() {
		// Use the preloaded video ID for instant playback
		const newId = preloadedNextId;
		// Remove any forward history when going to a new random video
		history = [...history.slice(0, historyIndex + 1), newId];
		historyIndex = history.length - 1;
		// Generate the next preload (different from the new current video)
		preloadedNextId = pickRandomVine();
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

<main class="flex min-h-screen w-full flex-col items-center justify-center bg-base-200 p-4">
	<div class="flex w-full max-w-2xl flex-col items-center">
		<!-- Pass currentVideoId as prop to have it dynamically to share -->
		<Header {currentVideoId} />

		<div class="flex w-full flex-col items-center gap-4">
			{#key currentVideoId}
				<VideoPlayer
					bind:this={videoPlayer}
					videoId={currentVideoId}
					onEnded={handleVideoEnded}
					onSwipeLeft={handleSwipeLeft}
					onSwipeRight={handleSwipeRight}
					onSwipeUp={goToRandomVideo}
				/>
			{/key}

			<div
				class="flex w-full flex-col items-center gap-4 sm:grid sm:grid-cols-3 sm:items-center sm:gap-0"
			>
				<div class="hidden sm:block"></div>
				<div class="flex justify-center">
					<NavigationControls
						{canGoBack}
						onPrevious={goBack}
						onNext={goForwardOrRandom}
						onRandom={goToRandomVideo}
					/>
				</div>
				<div class="flex w-full justify-center sm:justify-end">
					<Filter creators={allCreators} bind:selectedIds />
				</div>
			</div>

			<!-- Debug: show current video src -->
			<div class="flex flex-row items-center justify-center gap-4">
				<div class="badge badge-neutral">
					#{currentVideoSrc}
				</div>
				<button class="btn btn-soft" onclick={pickRandomVine}>test</button>
			</div>

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
	</div>
	<!-- TOAST Error Message -->
	{#if showResetToast}
		<div class="toast toast-end toast-top z-50 w-full transition-all duration-300 sm:w-max">
			<div class="alert alert-error shadow-lg">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5 shrink-0 stroke-current"
					fill="none"
					viewBox="0 0 24 24"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
					/></svg
				>
				<div class="flex flex-col">
					<h3 class="font-bold">kimse seçili değil!</h3>
					<div class="text-xs">filtreler otomatik olarak sıfırlandı.</div>
				</div>
			</div>
		</div>
	{/if}
</main>

<!-- Preload next random video OUTSIDE the {#key} block so it persists -->
<!-- svelte-ignore a11y_media_has_caption -->
<video src={preloadUrl} preload="auto" class="hidden" muted></video>
