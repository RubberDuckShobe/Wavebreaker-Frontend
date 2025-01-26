<script lang="ts">
	import type { components } from '$lib/api/wavebreaker';

	export let targetSong: components["schemas"]["Song"];
	export let extraInfo: null | components["schemas"]["ExtraSongInfo"];
</script>

<a
	href="/songs/{targetSong.id}"
	class="flex gap-y-2 gap-x-2 items-center flex-row hover:underline"
>
	{#if extraInfo?.coverUrlSmall}
		<img
			loading="lazy"
			src={extraInfo.coverUrlSmall}
			alt="Cover of {extraInfo.musicbrainzArtist ??
				targetSong.artist} - {extraInfo.musicbrainzTitle ?? targetSong.title}"
			class="w-12 h-12 rounded-xl"
		/>
	{/if}
	<div class="flex flex-row items-center gap-x-2">
		<div>
			<p class="font-semibold">{extraInfo?.musicbrainzTitle ?? targetSong.title}</p>
			<p class="text-sm">{extraInfo?.musicbrainzArtist ?? targetSong.artist}</p>
		</div>
		{#if targetSong.modifiers}
			<div class="flex flex-row flex-wrap gap-1">
				{#each targetSong.modifiers as tag}
					<div class="badge badge-ghost">{tag}</div>
				{/each}
			</div>
		{/if}
	</div>
</a>
