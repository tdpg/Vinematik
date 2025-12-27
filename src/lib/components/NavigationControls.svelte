<script lang="ts">
	import { ChevronLeft, RotateCcw, ChevronRight } from '@lucide/svelte';

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
		<ChevronLeft class="h-5 w-5" />
	</button>

	<!-- Random/Shuffle button -->
	<button
		class="btn btn-circle btn-primary btn-lg"
		onclick={onRandom}
		title="rastgele video (boşluk)"
		aria-label="rastgele video"
	>
		<RotateCcw class="h-6 w-6" />
	</button>

	<!-- Next button (always enabled - goes forward in history or random) -->
	<button
		class="btn btn-circle btn-outline"
		onclick={onNext}
		title="sonraki video (→)"
		aria-label="sonraki video"
	>
		<ChevronRight class="h-5 w-5" />
	</button>
</div>
