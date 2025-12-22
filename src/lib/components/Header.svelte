<script lang="ts">
	import ThemeToggle from './ThemeToggle.svelte';
	import Logo from './Logo.svelte';
</script>

<header class="mb-6 flex w-full items-center justify-between">
	<div class="w-10"></div>
	<div class="flex flex-col items-center text-center">
		<Logo class="h-28 text-primary" />
		<p class="text-sm text-base-content/60">random vines from the archive</p>
	</div>
	<ThemeToggle />
</header>
