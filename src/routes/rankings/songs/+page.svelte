<script lang="ts">
	import ClassicPagination from '$lib/components/common/pagination/classic-pagination.svelte';
	import RankingsLayout from '../rankingsLayout.svelte';
	import type { PageData } from './$types';
	import { pageQueryStore } from '$lib/stores/query-store';
	import { useAccio } from '$lib/utils/accio';
	import queryString from 'query-string';
	import { page } from '$app/stores';
	import { fetcher } from '$lib/utils/api';
	import { requestCancel, updateCancelToken } from '$lib/utils/accio/canceler';
	import { browser } from '$app/environment';
	import { onDestroy } from 'svelte';
	import type { Song } from '$lib/models/SongData';
	import { env } from '$env/dynamic/public';

	type rankingsQuery = {
		page: number;
	};

	$: pageQuery = pageQueryStore<rankingsQuery>({
		page: 1
	});

	type SongWithScoreCount = Song & {
		_count: {
			scores: number;
		};
	};

	type GetSongRankingsResponse = {
		songs: SongWithScoreCount[];
		totalCount: number;
	};

	const {
		data: rankings,
		error: rankingsError,
		refresh: refreshRankings
	} = useAccio<GetSongRankingsResponse>(
		queryString.stringifyUrl({
			url: '/api/rankings/songs',
			query: queryString.parse($page.url.searchParams.toString() + '&pageSize=20')
		}),
		{ fetcher: fetcher }
	);

	function changePage(newPage: number) {
		$requestCancel.cancel('Filter Changed');
		updateCancelToken();
		pageQuery.updateSingle('page', newPage);
	}

	const pageUnsubscribe = page.subscribe((p) => {
		if (browser) {
			refreshRankings({
				newUrl: queryString.stringifyUrl({
					url: '/api/rankings/songs',
					query: queryString.parse(p.url.searchParams.toString() + '&pageSize=20')
				})
			});
		}
	});

	onDestroy(pageUnsubscribe);

	let formatter = Intl.NumberFormat();
</script>

<svelte:head>
	<title>Wavebreaker | Song rankings</title>
	<meta
		name="description"
		content="A list of the most played songs on Wavebreaker, an open-source reimplementation of Audiosurf's server."
	/>

	<meta content="Wavebreaker" property="og:site_name" />
	<meta content="Song rankings" property="og:title" />
	<meta
		content="A list of the most played songs on Wavebreaker, an open-source reimplementation of Audiosurf's server."
		property="og:description"
	/>

	<meta content={env.PUBLIC_FRONTEND_URL} property="og:url" />
	<meta content="#009EFF" name="theme-color" />
</svelte:head>

<RankingsLayout>
	{#if !$rankings && !$rankingsError}
		<div class="loading loading-spinner loading-lg self-center" />
	{/if}
	{#if $rankingsError}
		<p class="text-error">{$rankingsError.message}</p>
	{/if}
	{#if $rankings}
		<div class="self-center shadow">
			<ClassicPagination
				totalItems={$rankings.totalCount}
				pageSize={20}
				currentPage={$pageQuery.page}
				{changePage}
			/>
		</div>
		<div class="flex flex-col">
			{#key $rankings.songs}
				{#each $rankings.songs as ranking, i}
					<div class="flex flex-row items-center space-x-3 p-1 min-h-12">
						<div class="font-semibold min-w-[2rem] text-center">
							#{($pageQuery.page - 1) * 14 + (i + 1)}
						</div>
						<a
							href="/songs/{ranking.id}"
							class="link link-hover flex flex-row items-center space-x-3 whitespace-nowrap overflow-hidden overflow-ellipsis"
						>
							{#if ranking.smallCoverUrl}
								<div class="avatar">
									<div class="w-10 h-10 rounded-lg">
										<img
											loading="lazy"
											src={ranking.smallCoverUrl}
											alt="Cover of {ranking.musicbrainzTitle || ranking.title}"
										/>
									</div>
								</div>
							{/if}
							<div class="flex flex-col">
								<span class="whitespace-nowrap overflow-hidden overflow-ellipsis"
									>{ranking.musicbrainzArtist || ranking.artist} - {ranking.musicbrainzTitle ||
										ranking.title}
								</span>
								<span
									class="whitespace-nowrap overflow-hidden overflow-ellipsis text-base-content/60"
									>{formatter.format(ranking._count.scores)} scores set
								</span>
							</div>
						</a>
					</div>
					{#if i != $rankings.songs.length - 1}<div class="divider mt-0 mb-0" />{/if}
				{/each}
			{/key}
		</div>
	{/if}
</RankingsLayout>
