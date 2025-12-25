<script lang="ts">
	import ThemeToggle from './ThemeToggle.svelte';
	import Logo from './Logo.svelte';

	import { page } from '$app/stores';

	// Props because Header is used in +page.svelte, also const is okay since it's dynamic by Svelte.
	const { currentVideoId } = $props<{ currentVideoId: string }>();

	// $derived.by here to recompute when currentVideoId changes.
	let shareLink = $derived(`${$page.url.host}/?${currentVideoId.slice(0, -4)}`); // remove .mp4 for cleaner link

	// Copy function, pretty standard
	let copied = $state(false);
	async function copyToClipboard() {
		let linkToCopy = 'https://' + shareLink;
		try {
			await navigator.clipboard.writeText(linkToCopy);
			copied = true;

			setTimeout(() => {
				copied = false;
			}, 1500);
		} catch (err) {
			console.error('Kopyalanamadı', err);
		}
	}

	// WhatsApp message function
	function getWPLink() {
		const text = `arşivden sana bir vine: https://${shareLink}`;
		return `https://wa.me/?text=${encodeURIComponent(text)}`;
	}

	// Tweet function because apparently Twitter doesn't let you DM people without using the API as a security measure
	function getTWLink() {
		return `https://twitter.com/intent/tweet?text=${encodeURIComponent(
			`işte sizin için bir vine: https://${shareLink}`
		)}`;
	}

	// Native share function
	async function nativeShare() {
		let urlForNS = 'https://' + shareLink;
		if (!navigator.share) {
			// fallback (kopyala ya da toast)
			return;
		}

		try {
			await navigator.share({
				title: 'vinematik',
				text: 'arşivden sana bir vine!',
				url: urlForNS
			});
		} catch (err) {
			// kullanıcı iptal ederse hata fırlatır, normal
			console.debug('Paylaşım iptal edildi');
		}
	}
</script>

<header class="relative mb-4 flex w-full items-center sm:justify-center">
	<!-- Logo and description -->
	<div class="flex flex-col items-start gap-1 sm:items-center sm:text-center">
		<Logo size="responsive" class="text-primary" />
		<p class="text-sm text-base-content/60">arşivden rastgele vine'lar</p>
	</div>

	<!-- Share and theme switch -->
	<div class="absolute right-0 ml-auto items-center gap-1">
		<!-- Share button -->
		<button
			class="btn btn-circle btn-ghost btn-sm"
			onclick={() => (document.getElementById('my_modal_3') as HTMLDialogElement).showModal()}
			aria-label="paylaş"
			><svg
				class="h-5 w-5 fill-current"
				version="1.1"
				id="Share Icon"
				xmlns="http://www.w3.org/2000/svg"
				xmlns:xlink="http://www.w3.org/1999/xlink"
				x="0px"
				y="0px"
				viewBox="0 0 800 800"
				style="enable-background:new 0 0 800 800;"
				xml:space="preserve"
			>
				<g id="Communication__x2F__Share_x5F_iOS_x5F_Export">
					<g id="Vector">
						<path
							d="M560.1,733.3H239.9c-41.2,0-63.9,0-85.3-10.9c-18.9-9.6-34-24.8-43.7-43.7C100,657.3,100,634.6,100,593.3v-160
				   c0-34.3,0-53.2,7.6-71.6c10.2-24.7,29.4-43.9,54.1-54.1c18.4-7.6,37.3-7.6,71.6-7.6c18.4,0,33.3,14.9,33.3,33.3
				   c0,18.4-14.9,33.3-33.3,33.3c-24.1,0-40,0-46.1,2.5c-8.1,3.4-14.7,9.9-18,18c-2.5,6.1-2.5,22-2.5,46.1v160c0,28.9,0,48,3.6,55.1
				   c3.2,6.3,8.3,11.4,14.6,14.6c7.1,3.6,26.2,3.6,55,3.6h320.2c28.8,0,47.9,0,55-3.6c6.2-3.2,11.4-8.3,14.6-14.6
				   c3.6-7.1,3.6-26.2,3.6-55V433.3c0-24.1,0-39.9-2.5-46.1c-3.4-8.1-9.9-14.7-18-18c-6.1-2.5-22-2.5-46.1-2.5
				   c-18.4,0-33.3-14.9-33.3-33.3c0-18.4,14.9-33.3,33.3-33.3c34.3,0,53.2,0,71.6,7.6c24.7,10.2,43.9,29.4,54.1,54.1
				   c7.6,18.4,7.6,37.3,7.6,71.6v160.1c0,41.2,0,63.9-10.9,85.3c-9.7,18.9-24.8,34.1-43.7,43.7C624,733.3,601.3,733.3,560.1,733.3z
					M400,466.7c-18.4,0-33.3-14.9-33.3-33.3V180.5l-43.1,43.1c-13,13-34.1,13-47.1,0c-13-13-13-34.1,0-47.1l100-100
				   c3.5-3.5,7.5-6,11.8-7.6c2.9-1.1,6.1-1.8,9.3-2c0,0,0,0,0.1,0c1.6-0.1,3.1-0.1,4.7,0c0,0,0,0,0.1,0c3.3,0.2,6.4,0.9,9.3,2
				   c4.3,1.6,8.3,4.2,11.8,7.6l100,100c13,13,13,34.1,0,47.1c-13,13-34.1,13-47.1,0l-43.1-43.1v252.9
				   C433.3,451.7,418.4,466.7,400,466.7z"
						/>
					</g>
				</g>
			</svg></button
		>

		<!-- Share modal -->
		<dialog id="my_modal_3" class="modal">
			<div class="modal-box w-auto max-w-full">
				<!-- Close button on top right -->
				<form method="dialog">
					<button class="btn absolute top-2 right-2 btn-circle btn-ghost btn-sm">✕</button>
				</form>

				<!-- Title and divider -->
				<h3 class="mb-1 font-bold">bu vine'ı paylaş:</h3>
				<p class="text-xs opacity-50">arkadaşlarına tek tıkla gönder</p>
				<div class="divider opacity-50"></div>
				<p class="mb-4 text-sm">sosyal medya üzerinden</p>
				<div class="flex flex-col gap-4">
					<!-- Social media buttons -->
					<div class="flex flex-row gap-4">
						<!-- WhatsApp button -->
						<div class="flex flex-col items-center justify-center gap-1">
							<a
								class="btn btn-circle btn-soft btn-lg"
								href={getWPLink()}
								target="_blank"
								aria-label="Whatsapp Paylaşım Linki"
								><svg
									class="h-5 w-5 fill-current"
									id="WhatsApp"
									data-name="WhatsApp"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 800 800"
								>
									<defs>
										<style>
											.cls-1 {
												fill-rule: evenodd;
												stroke-width: 0px;
											}
										</style>
									</defs>
									<path
										class="cls-1"
										d="m116.67,400c0-156.48,126.85-283.33,283.33-283.33s283.33,126.85,283.33,283.33-126.85,283.33-283.33,283.33c-55.74,0-107.62-16.06-151.4-43.8-8.15-5.16-18.13-6.54-27.37-3.78l-95.97,28.64,36.13-84.55c4.27-9.99,3.4-21.44-2.33-30.67-26.87-43.3-42.4-94.37-42.4-149.17ZM400,50c-193.3,0-350,156.7-350,350,0,61.27,15.77,118.94,43.49,169.09l-57.47,134.48c-5.08,11.89-2.83,25.64,5.78,35.29,8.61,9.65,22.02,13.45,34.41,9.75l149.98-44.76c51.23,29.37,110.61,46.15,173.82,46.15,193.3,0,350-156.7,350-350S593.3,50,400,50Zm76.42,422.75l-43.81,30.86c-20.52-11.69-43.2-28-65.95-50.75s-41.19-48.07-54.12-70.47l27.84-23.63c11.95-10.14,15.22-27.24,7.86-41.07l-35.47-66.67c-4.78-8.98-13.39-15.28-23.39-17.12-10-1.84-20.29.98-27.96,7.67l-10.52,9.18c-25.29,22.07-40.25,58.34-27.85,95.07,12.85,38.07,40.28,98,96.47,154.19,60.45,60.45,121.86,84.26,157.77,93.51,28.93,7.45,56.31-2.54,75.61-18.26l19.72-16.07c8.43-6.87,12.98-17.43,12.19-28.28-.8-10.85-6.84-20.63-16.18-26.2l-55.94-33.33c-11.3-6.73-25.5-6.19-36.26,1.38Z"
									/>
								</svg></a
							>
							<span class="text-xs opacity-70">WhatsApp</span>
						</div>
						<!-- Twitter button -->
						<div class="mr-1 flex flex-col items-center justify-center gap-1">
							<a
								class="btn btn-circle btn-soft btn-lg"
								href={getTWLink()}
								aria-label="X Paylaşım Linki"
								target="_blank"
								><svg
									class="h-4 w-4 fill-current"
									id="X"
									data-name="X"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 1200 1227"
								>
									<defs>
										<style>
											.cls-1 {
												stroke-width: 0px;
											}
										</style>
									</defs>
									<path
										class="cls-1"
										d="m714.16,519.28L1160.89,0h-105.86l-387.89,450.89L357.33,0H0l468.49,681.82L0,1226.37h105.87l409.63-476.15,327.18,476.15h357.33l-485.86-707.09h.03Zm-145,168.54l-47.47-67.89L144.01,79.69h162.6l304.8,435.99,47.47,67.89,396.2,566.72h-162.6l-323.31-462.45v-.03Z"
									/>
								</svg></a
							>
							<span class="text-xs opacity-70">X</span>
						</div>
						<!-- Native Share button -->
						<div class="flex flex-col items-center justify-center gap-1">
							<button
								class="btn btn-circle btn-soft btn-lg"
								aria-label="Native Paylaşım Linki"
								onclick={nativeShare}
								><svg
									class="h-5 w-5 fill-current"
									id="Native Share"
									data-name="Native Share"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 800 800"
								>
									<defs>
										<style>
											.cls-1 {
												fill-rule: evenodd;
												stroke-width: 0px;
											}
										</style>
									</defs>
									<path
										class="cls-1"
										d="m571.65,176.65c-38.87-50.98-121.34-23.94-121.34,39.79v63.99c-125.74-1.49-211.76,41.73-269.05,102.09-61.25,64.53-86.44,145.2-97,200.36-5.28,27.58,12.81,47.59,31.82,54.5,18.16,6.6,42.43,3.77,58.63-14.74,45.97-52.54,135.27-125.87,275.6-121.08v82.02c0,63.72,82.47,90.76,121.34,39.78l124.79-163.67c26.96-35.36,26.96-83.99,0-119.36l-124.79-163.67Zm-405.58,360.33c60.17-52.51,146.55-101.79,284.24-101.79h33.71c18.62,0,33.71,14.84,33.71,33.16v115.22s124.78-163.67,124.78-163.67c8.99-11.79,8.99-28,0-39.79l-124.79-163.67v97.14c0,18.31-15.09,33.15-33.71,33.15h-33.71c-151.67,0-219.78,81.04-219.78,81.04-31.36,33.03-51.54,72.3-64.47,109.21Z"
									/>
								</svg></button
							>
							<span class="text-xs opacity-70">Diğer</span>
						</div>
					</div>

					<div class="divider my-2 text-xs opacity-50">veya</div>
					<!-- Share link and copy button -->
					<div class="alert flex flex-row items-center justify-center gap-1 alert-soft p-0">
						<svg
							class="h-8 w-8 fill-current pl-2"
							id="Link"
							data-name="Link"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 800 800"
						>
							<defs>
								<style>
									.cls-1 {
										stroke-width: 0px;
									}
								</style>
							</defs>
							<path
								class="cls-1"
								d="m305.72,690.95c-52.53,0-101.92-20.46-139.06-57.6s-57.6-86.53-57.6-139.06,20.46-101.92,57.6-139.06l47.14-47.14c11.72-11.72,30.71-11.72,42.43,0,11.72,11.72,11.72,30.71,0,42.43l-47.14,47.14c-25.81,25.81-40.03,60.13-40.03,96.64s14.22,70.82,40.03,96.64c25.81,25.81,60.13,40.03,96.64,40.03s70.83-14.22,96.64-40.03l47.14-47.14c11.71-11.71,30.71-11.71,42.43,0,11.71,11.72,11.71,30.71,0,42.43l-47.14,47.14c-37.15,37.15-86.53,57.6-139.06,57.6Zm0-166.67c-7.68,0-15.36-2.93-21.21-8.79-11.72-11.71-11.72-30.71,0-42.43l188.56-188.56c11.72-11.71,30.71-11.71,42.43,0,11.72,11.72,11.72,30.71,0,42.43l-188.56,188.56c-5.86,5.86-13.54,8.79-21.21,8.79Zm259.27-23.57c-7.68,0-15.36-2.93-21.21-8.79-11.71-11.72-11.71-30.71,0-42.43l47.14-47.14c25.81-25.81,40.03-60.13,40.03-96.64s-14.21-70.82-40.03-96.64c-25.81-25.81-60.13-40.03-96.64-40.03-36.51,0-70.83,14.22-96.64,40.03l-47.14,47.14c-11.72,11.72-30.71,11.72-42.43,0-11.72-11.72-11.72-30.71,0-42.43l47.14-47.14c37.15-37.14,86.53-57.6,139.06-57.6,52.53,0,101.92,20.46,139.06,57.6,37.14,37.14,57.6,86.53,57.6,139.06s-20.46,101.92-57.6,139.06l-47.14,47.14c-5.86,5.86-13.54,8.79-21.21,8.79Z"
							/>
						</svg>
						<div class="divider mx-0 my-2 divider-horizontal"></div>
						<span class="truncate pr-2 text-xs sm:text-sm">{shareLink}</span>
						<button
							onclick={copyToClipboard}
							class="btn min-w-31 transition-all duration-200 btn-sm sm:btn-md
			{copied ? 'pointer-events-none btn-success' : ''}"
						>
							{#if copied}
								kopyalandı!
							{:else}
								kopyala
							{/if}
						</button>
					</div>
				</div>
			</div>
			<form method="dialog" class="modal-backdrop">
				<button>close</button>
			</form>
		</dialog>

		<!-- Theme switch -->
		<ThemeToggle />
	</div>
</header>
