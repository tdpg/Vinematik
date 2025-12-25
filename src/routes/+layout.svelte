<script lang="ts">
	import '@fontsource/poppins/100.css';
	import '@fontsource/poppins/200.css';
	import '@fontsource/poppins/300.css';
	import '@fontsource/poppins/400.css';
	import '@fontsource/poppins/500.css';
	import '@fontsource/poppins/600.css';
	import '@fontsource/poppins/700.css';
	import '@fontsource/poppins/800.css';
	import '@fontsource/poppins/900.css';
	import '@fontsource/poppins/100-italic.css';
	import '@fontsource/poppins/200-italic.css';
	import '@fontsource/poppins/300-italic.css';
	import '@fontsource/poppins/400-italic.css';
	import '@fontsource/poppins/500-italic.css';
	import '@fontsource/poppins/600-italic.css';
	import '@fontsource/poppins/700-italic.css';
	import '@fontsource/poppins/800-italic.css';
	import '@fontsource/poppins/900-italic.css';
	import './layout.css';
	import { page } from '$app/stores'; // Needed for canonical URL

	let { children } = $props();
	const SITE_URL = 'https://vine.mulayim.app';
</script>

<svelte:head>
	<!-- --- SEO --- -->
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<meta name="robots" content="index, follow" />
	<meta name="author" content="vinematik" />

	<!-- Canonical URL -->
	<link rel="canonical" href={$page.url.href} />

	<!-- --- FAVICONS & PWA --- -->
	<link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
	<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
	<link rel="shortcut icon" href="/favicon.ico" />
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
	<link rel="manifest" href="/site.webmanifest" />

	<!-- Theme Color -->
	<meta name="theme-color" content="#191e24;" />
	<!-- Apple cihazlar için status bar rengi -->
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
	<meta name="apple-mobile-web-app-title" content="vinematik" />
</svelte:head>

{@render children()}
