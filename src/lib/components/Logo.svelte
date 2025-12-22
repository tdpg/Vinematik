<script lang="ts">
	import logoSrc from '$lib/assets/8-vinematikKartooniOneLine.svg';
	import logoRaw from '$lib/assets/8-vinematikKartooniOneLine.svg?raw';

	type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'responsive';

	interface Props {
		size?: Size;
		class?: string;
	}

	let { size = 'md', class: className = '' }: Props = $props();

	// Parse viewBox from SVG to get aspect ratio
	function getAspectRatio(svg: string): number {
		const match = svg.match(/viewBox=["']([^"']+)["']/);
		if (match) {
			const [, , width, height] = match[1].split(/\s+/).map(Number);
			return width / height;
		}
		return 1;
	}

	const aspectRatio = getAspectRatio(logoRaw);
</script>

<div
	class="logo logo-{size} {className}"
	style="--logo-src: url({logoSrc}); --aspect-ratio: {aspectRatio}"
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
		aspect-ratio: var(--aspect-ratio);
	}

	.logo-xs {
		height: 2.5rem;
	}
	.logo-sm {
		height: 4rem;
	}
	.logo-md {
		height: 4rem;
	}
	.logo-lg {
		height: 5rem;
	}
	.logo-xl {
		height: 6rem;
	}
	.logo-2xl {
		height: 7rem;
	}

	/* Responsive: scales based on screen size */
	.logo-responsive {
		height: 2rem; /* xs screens */
	}

	@media (min-width: 480px) {
		.logo-responsive {
			height: 2.5rem; /* sm screens */
		}
	}

	@media (min-width: 640px) {
		.logo-responsive {
			height: 3rem; /* md screens */
		}
	}

	@media (min-width: 768px) {
		.logo-responsive {
			height: 3.5rem; /* lg screens */
		}
	}

	@media (min-width: 1024px) {
		.logo-responsive {
			height: 4rem; /* xl screens */
		}
	}
</style>
