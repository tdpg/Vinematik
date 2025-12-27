<script lang="ts">
	import ThemeToggle from './ThemeToggle.svelte';
	import Logo from './Logo.svelte';
	import { Share, MessageCircle, Twitter, Share2, Link, X } from '@lucide/svelte';

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
		>
			<Share class="h-5 w-5" />
		</button>

		<!-- Share modal -->
		<dialog id="my_modal_3" class="modal">
			<div class="modal-box w-auto max-w-full">
				<!-- Close button on top right -->
				<form method="dialog">
					<button class="btn absolute top-2 right-2 btn-circle btn-ghost btn-sm">
						<X class="h-5 w-5" />
					</button>
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
							>
								<MessageCircle class="h-5 w-5" />
							</a>
							<span class="text-xs opacity-70">WhatsApp</span>
						</div>
						<!-- Twitter button -->
						<div class="mr-1 flex flex-col items-center justify-center gap-1">
							<a
								class="btn btn-circle btn-soft btn-lg"
								href={getTWLink()}
								aria-label="X Paylaşım Linki"
								target="_blank"
							>
								<Twitter class="h-5 w-5" />
							</a>
							<span class="text-xs opacity-70">X</span>
						</div>
						<!-- Native Share button -->
						<div class="flex flex-col items-center justify-center gap-1">
							<button
								class="btn btn-circle btn-soft btn-lg"
								aria-label="Native Paylaşım Linki"
								onclick={nativeShare}
							>
								<Share2 class="h-5 w-5" />
							</button>
							<span class="text-xs opacity-70">Diğer</span>
						</div>
					</div>

					<div class="divider my-2 text-xs opacity-50">veya</div>
					<!-- Share link and copy button -->
					<div class="alert flex flex-row items-center justify-center gap-1 alert-soft p-0">
						<Link class="h-7 w-7 pl-2" />
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
