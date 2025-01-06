import { error } from '@sveltejs/kit';
import { isAxiosError } from 'axios';
import type { GetRadioSongsResponse } from '$lib/models/SongData.js';
import { fetcher } from '$lib/utils/api.js';
import { loadMetadata } from '$lib/stores/metadata-store.js';
import type { ServerStats } from '$lib/models/ServerStats.js';
import type { ExtendedScoreInfo } from '$lib/models/ScoreData.js';
import { client } from '$lib/api';

export async function load({ locals, cookies }) {
	try {
		const {
			data,
			error,
		  } = await client.GET("/stats");
		const serverStats: Promise<ServerStats> = loadMetadata(fetch, '/api/server/getStats');
		if (locals.user) {
			const authToken = cookies.get('Authorization');
			const radioSongs: Promise<GetRadioSongsResponse> = fetcher(
				'/api/server/getRadioSongs',
				authToken
			);
			const rivalScores: Promise<ExtendedScoreInfo[]> = fetcher(
				'/api/scores/getRivalActivity',
				authToken
			);
			const recentScores = fetcher<ExtendedScoreInfo[]>('/api/scores/getRecentActivity');

			return {
				radioSongs: await Promise.resolve(radioSongs),
				rivalScores: await Promise.resolve(rivalScores),
				recentScores: await Promise.resolve(recentScores),
				serverStats: data,
			};
		}
		return {
			radioSongs: undefined,
			rivalScores: undefined,
			recentScores: undefined,
			serverStats: data,
		};
	} catch (e) {
		if (isAxiosError(e) && e.response)
			throw error(e.response?.status, { message: e.response.data.error });
		else throw e;
	}
}
