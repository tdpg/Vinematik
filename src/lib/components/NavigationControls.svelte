<script lang="ts">
	interface Props {
		canGoBack: boolean;
		onPrevious: () => void;
		onNext: () => void;
		onRandom: () => void;
	}

	let { canGoBack, onPrevious, onNext, onRandom }: Props = $props();
</script>

<div class="flex items-center gap-2">
	<!-- Previous button -->
	<button
		class="btn btn-circle btn-outline"
		disabled={!canGoBack}
		onclick={onPrevious}
		title="önceki video (←)"
		aria-label="önceki video"
	>
		<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
		</svg>
	</button>

	<!-- Random/Shuffle button -->
	<button
		class="btn btn-circle btn-primary btn-lg"
		onclick={onRandom}
		title="rastgele video (boşluk)"
		aria-label="rastgele video"
	>
		<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
		</svg>
	</button>

	<!-- Next button (always enabled - goes forward in history or random) -->
	<button
		class="btn btn-circle btn-outline"
		onclick={onNext}
		title="sonraki video (→)"
		aria-label="sonraki video"
	>
		<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
		</svg>
	</button>
</div>
