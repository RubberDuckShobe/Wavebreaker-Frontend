<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import UserDisplay from '$lib/components/users/UserDisplay.svelte';
	import UserDisplaySmall from '$lib/components/users/UserDisplaySmall.svelte';
	import { DateTime } from 'luxon';
	import { characterList } from '$lib/utils/characterUtils';
	import { faUserPlus, faUserMinus } from '@fortawesome/free-solid-svg-icons';
	import ScoreBox from '$lib/components/scores/ScoreBox.svelte';
	import Fa from 'svelte-fa';
	import { enhance } from '$app/forms';
	import type { Score } from '$lib/models/ScoreData';
	import ScoreDetailModal from '$lib/components/scores/ScoreDetailModal.svelte';
	import { env } from '$env/dynamic/public';
	import type { components } from '$lib/api/wavebreaker';

	export let data: PageData;
	export let form: ActionData;

	if (form?.success) data.isRival = !data.isRival;

	let formatter = Intl.NumberFormat();
	$: joinDate = DateTime.fromISO(data.userData.joinedAt);

	let modalOpen = false;
	let modalScore: components['schemas']['Score'] = undefined;
	function modalFunction(scoreData: components['schemas']['Score']) {
		modalScore = scoreData;
		modalOpen = true;
	}
</script>

<svelte:head>
	<title>Wavebreaker | {data.userData.username}</title>
	<meta
		name="description"
		content="User page of {data.userData
			.username} on Wavebreaker, an Audiosurf 1 server reimplementation."
	/>

	<meta content="Wavebreaker" property="og:site_name" />
	<meta content={data.userData.username} property="og:title" />
	<meta
		content="Profile of {data.userData
			.username} on Wavebreaker, an open-source Audiosurf server reimplementation."
		property="og:description"
	/>
	<meta content={data.userData.avatarUrl} property="og:image" />

	<meta content={env.PUBLIC_FRONTEND_URL + '/users/' + data.userData.id} property="og:url" />
	<meta content="#009EFF" name="theme-color" />
</svelte:head>

<div class="flex gap-4 justify-center items-stretch w-full flex-col">
	<UserDisplay targetUser={data.userData} />

	{#if data.userData.id != data.user.id}
		{#if !data.isRival && data.user.id != data.userData.id}
			<form method="POST" action="?/addRival" use:enhance>
				<button class="btn btn-success w-full md:w-44"><Fa icon={faUserPlus} />Add rival</button>
			</form>
		{:else}
			<form method="POST" action="?/removeRival" use:enhance>
				<button class="btn btn-error w-full md:w-44"><Fa icon={faUserMinus} />Remove rival</button>
			</form>
		{/if}
	{/if}

	{#key data.userData.id}
		<div class="stats stats-vertical rounded-3xl bg-neutral lg:stats-horizontal grow shadow">
			<div class="stat">
				<div class="stat-title">Rank</div>
				<div class="stat-value text-3xl lg:text-4xl">
					#{formatter.format(data.userData.stats?.rank)}
				</div>
				<div class="stat-desc">
					{formatter.format(data.userData.stats?.skillPoints)} Skill Points
				</div>
			</div>

			<div class="stat">
				<div class="stat-title">Joined</div>
				<div class="stat-value text-3xl lg:text-4xl">{joinDate.setLocale('en').toRelative()}</div>
				<div class="stat-desc">{joinDate.toLocaleString(DateTime.DATETIME_SHORT)}</div>
			</div>

			<div class="stat">
				<div class="stat-title">Total plays</div>
				<div class="stat-value text-3xl lg:text-4xl">{data.userData.stats?.totalPlays}</div>
				{#if data.userData.stats?.favoriteCharacter}
					<div class="stat-desc">
						Favorite character: {characterList[data.userData.stats?.favoriteCharacter.character]}
					</div>
				{/if}
			</div>

			<!-- TODO: Redesign this
			{#if data.userResult.favoriteSong}
				<div class="stat">
					<div class="stat-title">Favorite song</div>
					<div class="stat-value text-3xl lg:text-4xl">
						<a class="hover:underline" href="/songs/{data.userResult.id}"
							>{data.userResult.favoriteSong.artist} - {data.userResult.favoriteSong.title}</a
						>
					</div>
				</div>
			{/if}
		-->
		</div>
	{/key}

	{#if data.rivalsAndChallengers}
		{#if data.rivalsAndChallengers.error}
			<h2 class="text-error">{data.rivalsAndChallengers.error.error}</h2>
		{:else if data.rivalsAndChallengers.data.rivalries.length > 0}
			<h2 class="text-3xl font-bold">Rivals</h2>
			<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 px-3">
				{#each data.rivalsAndChallengers.data.rivalries as rivalry}
					<UserDisplaySmall targetUser={rivalry.rival} />
				{/each}
			</div>
		{/if}
		{#if data.rivalsAndChallengers.data.challengers.length > 0}
			<h2 class="text-3xl font-bold">Challengers</h2>
			<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 px-3">
				{#each data.rivalsAndChallengers.data.challengers as challengerRivalry}
					<UserDisplaySmall targetUser={challengerRivalry.rival} />
				{/each}
			</div>
		{/if}
	{/if}

	{#if data.latestScores.error}
		<p class="text-error"><i>{data.latestScores.error.error}</i></p>
	{:else if data.latestScores.data?.total > 0}
		<div class="mt-3">
			<h2 class="text-3xl font-bold mb-2">
				Latest scores <a
					href="/users/{data.userData.id}/allScores"
					class="link link-primary link-hover text-base align-middle font-normal"><i>view all</i></a
				>
			</h2>
			<div class="flex flex-col gap-y-2 p-3">
				{#each data.latestScores.data?.results as score}
					<ScoreBox
						targetEntity={score.song}
						targetScore={score}
						entityImage={score.extraInfo?.coverUrl}
						entityImageSmall={score.extraInfo?.coverUrlSmall}
						extraSongInfo={score.extraInfo}
						{modalFunction}
					/>
				{/each}
			</div>
		</div>
		<div class="mt-3">
			<h2 class="text-3xl font-bold mb-2">Best scores</h2>
			<div class="flex flex-col gap-y-2 p-3">
				{#each data.bestScores.data?.results as score, i}
					<ScoreBox
						placement={i + 1}
						targetEntity={score.song}
						targetScore={score}
						entityImage={score.extraInfo?.coverUrl}
						entityImageSmall={score.extraInfo?.coverUrlSmall}
						extraSongInfo={score.extraInfo}
						{modalFunction}
					/>
				{/each}
			</div>
		</div>
	{:else}
		<div class="mt-3">
			<div class="text-3xl font-bold mb-2 text-center">No scores yet!</div>
		</div>
	{/if}
</div>

{#key modalScore}
	{#if modalScore}
		<ScoreDetailModal bind:showModal={modalOpen} targetScore={modalScore} />
	{/if}
{/key}
