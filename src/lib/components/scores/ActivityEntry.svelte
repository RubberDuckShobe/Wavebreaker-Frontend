<script lang="ts">
	import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import type { components } from '$lib/api/wavebreaker';

	export let score: components["schemas"]["Score"];
	export let player: components["schemas"]["PlayerPublic"];
	export let song: components["schemas"]["Song"];
	export let extraSongInfo: null | components["schemas"]["ExtraSongInfo"];
	let formatter = Intl.NumberFormat();
</script>

<div class="grid grid-cols-3 items-center">
	<a href="/users/{score.playerId}" class="flex flex-row gap-x-2 hover:underline">
		<img
			class="avatar w-12 h-12 rounded-xl"
			alt="Avatar of {player.username}"
			src={player.avatarUrl}
		/>
		<div class="flex flex-col whitespace-nowrap overflow-hidden overflow-ellipsis justify-items-center">
			<div class="font-semibold whitespace-nowrap overflow-hidden overflow-ellipsis">{player.username}</div>
			<span class="hidden md:block">{formatter.format(score.score)}</span>
		</div>
	</a>
	<div class="flex flex-col items-center">
		<Fa icon={faArrowRight} />
		<span class="md:hidden">{formatter.format(score.score)}</span>
	</div>
	<a href="/songs/{score.songId}" class="flex flex-row gap-x-2 hover:underline">
		{#if extraSongInfo?.coverUrlSmall}
			<img class="avatar w-12 h-12 rounded-xl" alt="Song cover" src={extraSongInfo.coverUrlSmall} />
		{/if}
		<div
			class="flex flex-col whitespace-nowrap overflow-hidden overflow-ellipsis"
		>
			<span class="font-semibold overflow-hidden overflow-ellipsis">
				{extraSongInfo?.musicbrainzTitle ?? song.title}
			</span>
			<span class="overflow-hidden overflow-ellipsis">
				{extraSongInfo?.musicbrainzArtist ?? song.artist}
			</span>
		</div>
	</a>
</div>
