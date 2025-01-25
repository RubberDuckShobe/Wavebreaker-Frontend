<script lang="ts">
	import ServerStats from '../lib/components/home/ServerStats.svelte';

	import { page } from '$app/stores';
	import { env } from '$env/dynamic/public';
	import logo from '$lib/assets/wavebreaker_icon.svg';
	import SongDisplaySmall from '$lib/components/songs/SongDisplaySmall.svelte';
	import Fa from 'svelte-fa';
	import type { PageData } from './$types';
	import { faCircleInfo, faDownload, faExternalLink } from '@fortawesome/free-solid-svg-icons';
	import ActivityEntry from '$lib/components/scores/ActivityEntry.svelte';

	export let data: PageData;
</script>

<svelte:head>
	<title>Wavebreaker | Home</title>
	<meta
		name="description"
		content="An open-source reimplementation of Audiosurf's server. View your scores, songs and rivals!"
	/>

	<meta content="Wavebreaker" property="og:site_name" />
	<meta content="Home" property="og:title" />
	<meta
		content="An open-source reimplementation of Audiosurf's server. View your scores, songs and rivals!"
		property="og:description"
	/>

	<meta content={env.PUBLIC_FRONTEND_URL} property="og:url" />
	<meta content="#009EFF" name="theme-color" />
</svelte:head>

{#if $page.data.user != undefined}
	<h1 class="text-2xl lg:text-5xl">Welcome back, <b>{$page.data.user?.username}</b>.</h1>
	<div class="flex flex-row flex-wrap my-4 gap-3">
		<div class="bg-neutral rounded-xl p-4 shadow grow">
			<div class="flex flex-row items-center gap-x-2">
				<h2 class="text-xl font-bold">Wavebreaker Radio songs</h2>
				<div
					class="tooltip tooltip-warning before:w-[8rem] before:content-[attr(data-tip)]"
					data-tip="We do NOT own the rights to these songs!
							  If you like them, buy them."
				>
					<Fa icon={faCircleInfo} />
				</div>
			</div>
			{#if data.radioSongs}
				{#each data.radioSongs.data as radioSong}
					<div class="flex flex-row items-center self-center p-2">
						<SongDisplaySmall targetSong={radioSong.song} extraInfo={radioSong.extra_info} />
						<a
							aria-label="Purchase song"
							class="btn btn-ghost btn-sm btn-square ml-auto"
							href={radioSong.external_url}
							><Fa icon={faExternalLink} />
						</a>
					</div>
				{/each}
			{:else}
				<p class="text-center text-base-content/60 my-5"><i>No songs available.</i></p>
			{/if}
		</div>
		{#if data.recentScores}
			<div class="bg-neutral rounded-xl p-4 shadow grow max-w-[36rem]">
				<h2 class="text-xl font-bold">Recent activity</h2>
				<div class="flex flex-col p-2 gap-y-3">
					{#if data.recentScores.error}
						<p class="text-error"><i>Error: {data.recentScores.error}</i></p>
					{:else if data.recentScores.data}
						{#each data.recentScores.data.results as score}
							<ActivityEntry {score} />
						{/each}
					{/if}
				</div>
			</div>
		{/if}
		{#if data.rivalScores}
			<div class="bg-neutral rounded-xl p-4 shadow grow">
				<h2 class="text-xl font-bold">Rivals' activity</h2>
				<div class="flex flex-col p-2 gap-y-3">
					{#if data.rivalScores.error}
						<p class="text-error"><i>Error: {data.rivalScores.error}</i></p>
					{:else if data.rivalScores.data}
						{#each data.rivalScores.data.results as score}
							<ActivityEntry {score} />
						{/each}
					{/if}
				</div>
			</div>
		{/if}
		<ServerStats
			userCount={data.serverStats.data.userCount}
			songCount={data.serverStats.data.songCount}
			scoreCount={data.serverStats.data.scoreCount}
		/>
	</div>
{:else}
	<div class="prose mb-7 max-w-full">
		<h1>Welcome to Wavebreaker</h1>
		<p>
			Wavebreaker is an open-source reimplementation of Audiosurf's online services that is being
			actively developed. It aims to provide the same functionality as the original server, while
			being more modern and adding a few things on top, such as:
		</p>
		<ul>
			<li><b>Forced HTTPS</b>, so traffic between game and server is more secure</li>
			<li>
				<b>Additional metadata</b> (like cover art, artist/title with proper capitalization) on the website
			</li>
			<li>
				<b>Custom Audiosurf Radio songs!</b>
			</li>
		</ul>
		<p>Sound good?</p>
		<a href="/installguide" class="btn btn-primary btn-sm normal-case"
			><Fa icon={faDownload} />Jump in!</a
		>
	</div>

	<ServerStats
		userCount={data.serverStats.data.userCount}
		songCount={data.serverStats.data.songCount}
		scoreCount={data.serverStats.data.scoreCount}
	/>
{/if}
