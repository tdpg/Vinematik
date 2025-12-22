<script lang="ts">
	import ThemeToggle from './ThemeToggle.svelte';
</script>

<header class="mb-6 flex w-full items-center justify-between">
	<div class="w-10"></div>
	<div class="text-center">
		<h1 class="text-4xl font-black tracking-tight">
			<span class="text-primary">vine</span><span class="text-base-content">matik</span>
		</h1>
		<p class="mt-1 text-sm text-base-content/60">random vines from the archive</p>
	</div>
	<ThemeToggle />
</header>
