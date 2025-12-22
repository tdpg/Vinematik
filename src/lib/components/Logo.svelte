<script lang="ts">
	import logoSrc from '$lib/assets/favicon.svg';

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();
</script>

<div
	class="logo {className}"
	style="--logo-src: url({logoSrc})"
	role="img"
	aria-label="vinematik"
></div>

<style>
	.logo {
		background-color: currentColor;
		-webkit-mask-image: var(--logo-src);
		mask-image: var(--logo-src);
		-webkit-mask-size: contain;
		mask-size: contain;
		-webkit-mask-repeat: no-repeat;
		mask-repeat: no-repeat;
		-webkit-mask-position: center;
		mask-position: center;
		aspect-ratio: 1;
	}
</style>
