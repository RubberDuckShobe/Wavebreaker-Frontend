<script lang="ts">
	import type { components } from '$lib/api/wavebreaker';
	import type { Score } from '$lib/models/ScoreData';
	import type { Song } from '$lib/models/SongData';
	import type { UserInfo } from '$lib/models/UserData';
	import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
	import { DateTime } from 'luxon';
	import Fa from 'svelte-fa';

	export let placement: number = undefined;
	export let targetEntity: components['schemas']['PlayerPublic'] | components['schemas']['Song'];
	export let extraSongInfo: components['schemas']['ExtraSongInfo'] | null = undefined;
	export let targetScore: components['schemas']['Score'];
	export let entityImage: string = undefined;
	export let entityImageSmall: string = undefined;
	export let modalFunction: (scoreData: components['schemas']['Score']) => void = undefined;

	if (!entityImage) {
		if ('avatarUrl' in targetEntity) {
			entityImage = targetEntity.avatarUrl;
		} else if (extraSongInfo != null && 'coverUrl' in extraSongInfo) {
			entityImage = extraSongInfo.coverUrl;
		}
	}

	if (!entityImageSmall) {
		if ('avatarUrl' in targetEntity) {
			entityImageSmall = targetEntity.avatarUrl;
		} else if (extraSongInfo != null && 'coverUrlSmall' in extraSongInfo) {
			entityImageSmall = extraSongInfo.coverUrlSmall;
		}
	}

	let formatter = Intl.NumberFormat();
	$: timeSet = DateTime.fromISO(targetScore.submittedAt);
	let trackShapeNumbers = targetScore.trackShape.map(function (item) {
		return Math.abs(item - 103);
	});
	const trackShapeData = {
		labels: new Array(trackShapeNumbers.length - 1).fill(''),
		datasets: [
			{
				label: 'Height',
				data: trackShapeNumbers,
				borderColor: '#009EFF'
			}
		]
	};
</script>

<div
	class="bg-[position:0px] bg-no-repeat bg-cover rounded-xl"
	style={entityImage && 'background-image: url(' + entityImage + ');'}
>
	<!--TODO: Find a better solution to fix the weird corner bleeding-->
	<div
		class="flex flex-col md:flex-row h-full p-3 shadow rounded-xl gap-x-3 gap-y-2 items-center {entityImage &&
			'bg-gradient-to-r from-neutral/80 to-75% to-neutral'}"
		class:bg-neutral={!entityImage}
		style="width: calc(100% + 1px);"
	>
		<div class="flex md:hidden self-start w-full">
			{#if placement}
				#{placement} —
			{/if}
			{formatter.format(targetScore.score)}
			<div class="ml-auto text-base-content/60">{timeSet.setLocale('en').toRelative()}</div>
		</div>
		<div class="flex flex-row items-center gap-x-3 w-full md:max-w-xl">
			{#if placement}
				<p class="hidden md:block text-3xl font-bold text-center w-8 min-w-[2rem]">{placement}</p>
			{/if}
			{#if entityImageSmall}
				<img loading="lazy" class="w-12 h-12 rounded-xl" src={entityImageSmall} alt="Score entry" />
			{/if}
			{#if 'title' in targetEntity}
				<a
					href={`/songs/${targetEntity.id}`}
					class="hover:underline overflow-hidden"
					title="Song title and artist"
				>
					<div class="font-semibold">
						{extraSongInfo?.musicbrainzTitle ?? targetEntity.title}
					</div>
					<p class="text-sm">{extraSongInfo?.musicbrainzArtist ?? targetEntity.artist}</p>
				</a>
			{:else}
				<a href={`/users/${targetEntity.id}`} class="hover:underline overflow-hidden font-semibold">
					{targetEntity.username}
				</a>
			{/if}
			{#if 'modifiers' in targetEntity && targetEntity}
				<div class="hidden md:flex flex-row flex-wrap gap-2">
					{#each targetEntity.modifiers as tag}
						<div class="badge badge-ghost">{tag}</div>
					{/each}
				</div>
			{/if}
			{#if modalFunction}
				<div class="block md:hidden ml-auto">
					<button
						aria-label="More score info"
						class="btn btn-square btn-sm btn-ghost"
						on:click={() => modalFunction(targetScore)}
						><Fa icon={faInfoCircle} />
					</button>
				</div>
			{/if}
		</div>
		<div class="hidden md:flex flex-row items-center justify-self-end gap-x-2 ml-auto text-right">
			<div class="flex flex-col items-end">
				<p title="Score">
					{formatter.format(targetScore.score)}
				</p>
				<p title="Time played" class="text-base-content/60 text-sm w-max">
					{timeSet.setLocale('en').toRelative()}
				</p>
			</div>
			{#if modalFunction}
				<button
					aria-label="More score info"
					class="btn btn-square btn-sm btn-ghost"
					on:click={() => modalFunction(targetScore)}
					><Fa icon={faInfoCircle} />
				</button>
			{/if}
		</div>
		{#if 'modifiers' in targetEntity && targetEntity.modifiers}
			<div class="md:hidden flex flex-row flex-wrap gap-2 self-start">
				{#each targetEntity.modifiers as tag}
					<div class="badge badge-ghost">{tag}</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
