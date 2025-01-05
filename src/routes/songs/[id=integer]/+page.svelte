<script lang="ts">
	import type { PageData } from './$types';
	import { pageQueryStore } from '$lib/stores/query-store';
	import { page } from '$app/stores';
	import queryString from 'query-string';
	import { browser } from '$app/environment';
	import { onDestroy } from 'svelte';

	import ClassicPagination from '$lib/components/common/pagination/classic-pagination.svelte';
	import type { GetScoresResponse, Score } from '$lib/models/ScoreData';
	import Fa from 'svelte-fa';
	import { faPaperPlane, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

	import { requestCancel, updateCancelToken } from '$lib/utils/accio/canceler';
	import { useAccio } from '$lib/utils/accio';
	import { fetcher } from '$lib/utils/api';
	import ScoreBox from '$lib/components/scores/ScoreBox.svelte';
	import Modal from '$lib/components/common/Modal.svelte';
	import ScoreDetailModal from '$lib/components/scores/ScoreDetailModal.svelte';
	import ShoutsSection from '$lib/components/shouts/ShoutsSection.svelte';
	import { env } from '$env/dynamic/public';

	let metadataReportModalOpen = false;
	let metadataReportInfo: string = '';
	let reportInfoMaxLength: number = 150;
	$: reportInfoLength = metadataReportInfo.length;

	export let data: PageData;

	type leaderboardsQuery = {
		page: number;
		leagueId: 0 | 1 | 2;
	};

	$: pageQuery = pageQueryStore<leaderboardsQuery>({
		page: 1,
		leagueId: 2
	});

	const {
		data: leaderboards,
		error: leaderboardsError,
		refresh: refreshLeaderboards
	} = useAccio<GetScoresResponse>(
		queryString.stringifyUrl({
			url: '/api/scores/getScores',
			query: queryString.parse(
				$page.url.searchParams.toString() +
					'&includePlayer=true&pageSize=14&scoreSort=desc&songId=' +
					data.songResult.id +
					(!$page.url.searchParams.has('leagueId') ? '&leagueId=2' : '')
			)
		}),
		{ fetcher: fetcher }
	);

	function changePage(newPage: number) {
		$requestCancel.cancel('Filter Changed');
		updateCancelToken();
		pageQuery.updateSingle('page', newPage);
	}

	function changeLeagueId(newLeagueId: number) {
		$requestCancel.cancel('Filter Changed');
		updateCancelToken();
		pageQuery.updateSingle('leagueId', newLeagueId);
	}

	//TODO: Make it use default page values
	const pageUnsubscribe = page.subscribe((p) => {
		if (browser) {
			refreshLeaderboards({
				newUrl: queryString.stringifyUrl({
					url: '/api/scores/getScores',
					query: queryString.parse(
						p.url.searchParams.toString() +
							'&includePlayer=true&pageSize=14&scoreSort=desc&songId=' +
							data.songResult.id +
							(!$page.url.searchParams.has('leagueId') ? '&leagueId=2' : '')
					)
				})
			});
		}
	});

	onDestroy(pageUnsubscribe);

	let modalOpen = false;
	let modalScore: Score = undefined;
	function modalFunction(scoreData: Score) {
		modalScore = scoreData;
		modalOpen = true;
	}
</script>

<svelte:head>
	<title
		>Wavebreaker | {data.songResult.musicbrainzArtist ?? data.songResult.artist} - {data.songResult
			.musicbrainzTitle ?? data.songResult.title}</title
	>
	<meta
		name="description"
		content="Song page of {data.songResult.musicbrainzTitle ?? data.songResult.title} by {data
			.songResult.musicbrainzArtist ??
			data.songResult.artist} on Wavebreaker, an Audiosurf 1 server reimplementation"
	/>

	<meta content="Wavebreaker" property="og:site_name" />
	<meta
		content="{data.songResult.musicbrainzArtist ?? data.songResult.artist} - {data.songResult
			.musicbrainzTitle ?? data.songResult.title}"
		property="og:title"
	/>
	<meta
		content="View scores set on {data.songResult.musicbrainzTitle ?? data.songResult.title} by {data
			.songResult.musicbrainzArtist ??
			data.songResult.artist} on Wavebreaker, an open-source Audiosurf server reimplementation."
		property="og:description"
	/>
	<meta content={data.songResult.coverUrl} property="og:image" />

	<meta content={env.PUBLIC_FRONTEND_URL + '/songs/' + data.songResult.id} property="og:url" />
	<meta content="#009EFF" name="theme-color" />
</svelte:head>

<div class="flex gap-4 justify-center items-stretch w-full flex-col">
	<div class="flex gap-y-2 items-center flex-col md:flex-row md:space-x-5">
		{#if data.songResult.coverUrl}
			<div class="avatar">
				<div class="w-[20rem] lg:w-[24rem] max-w-[20rem] rounded-3xl shadow">
					<img
						class="w-[20rem] h-[20rem]"
						src={data.songResult.coverUrl}
						alt="Cover of {data.songResult.musicbrainzArtist ?? data.songResult.artist} - {data
							.songResult.musicbrainzTitle ?? data.songResult.title}"
					/>
				</div>
			</div>
		{/if}

		<div class="flex flex-col items-center md:items-start space-y-1 break-words">
			<h1 class="text-3xl md:text-5xl font-bold">
				{data.songResult.musicbrainzTitle ?? data.songResult.title}
			</h1>
			<h2 class="text-xl md:text-2xl font-bold">
				{data.songResult.musicbrainzArtist ?? data.songResult.artist}
			</h2>
			{#if data.songResult.mbid}
				<i class="text-base-content/60">
					{data.songResult.artist} - {data.songResult.title}
				</i>
			{/if}
			<div class="flex flex-row flex-wrap gap-2 mt-3 justify-center">
				{#each data.songResult.tags as tag}
					<div class="badge badge-ghost">{tag}</div>
				{/each}
			</div>
		</div>
	</div>
	{#if page.user}
		<div class="rounded-xl bg-neutral shadow p-4">
			<button class="btn btn-error" on:click={() => (metadataReportModalOpen = true)}
				><Fa icon={faTriangleExclamation} />Report incorrect metadata</button
			>
			{#if $page.data.user.accountType == 3}
				<h2 class="text-xl md:text-2xl font-bold mt-3">Admin</h2>

				<div class="flex flex-row mt-1 gap-x-3 gap-y-2 flex-wrap">
					<form method="POST" action="?/applyMBID">
						<div class="join">
							<input
								name="mbid"
								type="text"
								placeholder="New MBID"
								class="join-item input input-bordered max-w-xs w-full"
							/>
							<button class="join-item btn btn-primary">Retag</button>
						</div>
					</form>
					<form method="POST" action="?/markMistag">
						<button class="btn btn-warning">Mark as mistagged</button>
					</form>
				</div>
			{/if}
		</div>
	{/if}

	<div class="tabs tabs-boxed self-center shadow">
		<button
			on:click={() => changeLeagueId(0)}
			class="tab {$pageQuery.leagueId == 0 && 'bg-success text-success-content'}"
		>
			Casual
		</button>
		<button
			on:click={() => changeLeagueId(1)}
			class="tab {$pageQuery.leagueId == 1 && 'bg-warning text-warning-content'}"
		>
			Pro
		</button>
		<button
			on:click={() => changeLeagueId(2)}
			class="tab {$pageQuery.leagueId == 2 && 'bg-primary text-primary-content'}"
		>
			Elite
		</button>
	</div>
	{#if !$leaderboards && !$leaderboardsError}
		<div class="loading loading-spinner loading-lg self-center" />
	{/if}
	{#if $leaderboardsError}
		<p class="text-error">{$leaderboardsError.message}</p>
	{/if}
	{#if $leaderboards}
		<div class="flex flex-col gap-y-2">
			{#key $leaderboards.scores}
				{#each $leaderboards.scores as score, i}
					<ScoreBox
						placement={($pageQuery.page - 1) * 14 + (i + 1)}
						targetEntity={score.player}
						targetScore={score}
						{modalFunction}
					/>
				{/each}
			{/key}
		</div>
		<div class="self-center shadow">
			<ClassicPagination
				totalItems={$leaderboards.totalCount}
				pageSize={14}
				currentPage={$pageQuery.page}
				{changePage}
			/>
		</div>
	{/if}

	<h2 class="text-3xl font-bold mb-2">Shouts</h2>
	<ShoutsSection songId={data.songResult.id} currentUser={data.user} />
</div>

<Modal bind:showModal={metadataReportModalOpen} responsive={false}>
	<div class="flex flex-col gap-y-3 w-full">
		<h2 class="font-bold text-xl">Report incorrect metadata</h2>
		<p>
			"Missing or incorrect info? On <i>my</i> song page?"<br />It's more likely than you think. So,
			help out by telling us what's wrong!
		</p>
		<p>
			<b>Note: Only submit a report if there's really something wrong!</b> Thank you for your understanding.
		</p>
		<p>If possible, please enter additional info (like the correct MusicBrainz ID) below.</p>
		<form method="POST" action="?/reportMetadata">
			<div class="join min-w-full mt-1">
				<div class="form-control">
					<input
						bind:value={metadataReportInfo}
						name="additionalInfo"
						type="text"
						placeholder="Additional info..."
						class="join-item input input-bordered max-w-xs w-full"
					/>
					<!-- svelte-ignore a11y-label-has-associated-control -->
					<label class="label">
						<span class="label-text-alt" class:text-error={reportInfoLength >= reportInfoMaxLength}
							>{reportInfoMaxLength - reportInfoLength}</span
						>
					</label>
				</div>
				<button
					class="join-item btn {reportInfoLength >= reportInfoMaxLength
						? 'btn-disabled'
						: 'btn-primary'}"
					on:click={() => (metadataReportModalOpen = false)}><Fa icon={faPaperPlane} /></button
				>
			</div>
		</form>
	</div>
</Modal>

{#key modalScore}
	{#if modalScore}
		<ScoreDetailModal bind:showModal={modalOpen} targetScore={modalScore} />
	{/if}
{/key}
