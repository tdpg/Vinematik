<script lang="ts">
	interface Props {
		canGoBack: boolean;
		canGoForward: boolean;
		onPrevious: () => void;
		onNext: () => void;
		onRandom: () => void;
	}

	let { canGoBack, canGoForward, onPrevious, onNext, onRandom }: Props = $props();
</script>

<div class="flex items-center gap-2">
	<!-- Previous button -->
	<button
		class="btn btn-circle btn-outline"
		disabled={!canGoBack}
		onclick={onPrevious}
		title="Previous video (←)"
		aria-label="Previous video"
	>
		<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
		</svg>
	</button>

	<!-- Random/Shuffle button -->
	<button
		class="btn btn-circle btn-primary btn-lg"
		onclick={onRandom}
		title="Random video (Space)"
		aria-label="Random video"
	>
		<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
		</svg>
	</button>

	<!-- Next button -->
	<button
		class="btn btn-circle btn-outline"
		disabled={!canGoForward}
		onclick={onNext}
		title="Next video (→)"
		aria-label="Next video"
	>
		<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
		</svg>
	</button>
</div>

