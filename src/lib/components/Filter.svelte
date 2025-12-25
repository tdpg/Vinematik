<!-- Filter.svelte -->
<script lang="ts">
	// Ana sayfadan (Parent) gelecek veriler
	export let creators: { id: string; name: string }[] = [];

	// Ana sayfayla "canlı" olarak senkronize olacak liste
	export let selectedIds: string[] = [];

	// --- SEÇİM MANTIĞI (Bileşenin içinde kalabilir) ---

	// Toggle creator in an out of the selectedIds array
	const toggleCreator = (id: string) => {
		if (selectedIds.includes(id)) {
			// If already existing, remove
			selectedIds = selectedIds.filter((item) => item !== id);
		} else {
			// If non-existent, add
			selectedIds = [...selectedIds, id];
		}
	};

	// Select or deselect all creators
	const toggleAllSelection = () => {
		if (selectedIds.length > 0) {
			// If some stuff are selected, deselect all
			selectedIds = [];
		} else {
			// If nothing is selected, select all
			selectedIds = creators.map((c) => c.id);
		}
	};
</script>

<div class="dropdown dropdown-center dropdown-top sm:dropdown-end">
	<!-- Dropdown Button -->
	<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
	<div role="button" tabindex="0" class="btn m-1 justify-between btn-soft">
		<span>filtrele ({selectedIds.length})</span>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-5 w-5 rotate-90"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		>
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
		</svg>
	</div>

	<!-- Dropdown content -->
	<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
	<div
		tabindex="0"
		class="dropdown-content menu z-100 w-max overflow-hidden rounded-box border border-base-300 bg-base-100 p-1 shadow"
	>
		<!-- List (Scrollable) -->
		<ul class="menu block max-h-30 overflow-y-auto p-2">
			{#each creators as creator}
				<li class="block">
					<label
						class="label w-full cursor-pointer justify-start gap-3 rounded-lg p-2 hover:bg-base-200"
					>
						<input
							type="checkbox"
							class="checkbox checkbox-sm checkbox-primary"
							checked={selectedIds.includes(creator.id)}
							on:change={() => toggleCreator(creator.id)}
						/>
						<span class="label-text truncate">{creator.name}</span>
					</label>
				</li>
			{/each}
		</ul>

		<!-- Footer -->
		<div class="border-t border-base-300 bg-base-100 p-2">
			<button
				class="btn w-full font-semibold btn-ghost btn-sm {selectedIds.length > 0
					? 'text-error'
					: 'text-success'}"
				on:click={toggleAllSelection}
			>
				{selectedIds.length > 0 ? 'tüm seçimleri kaldır' : 'hepsini seç'}
			</button>
		</div>
	</div>
</div>
