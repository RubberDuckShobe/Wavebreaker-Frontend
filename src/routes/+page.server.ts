import { error } from '@sveltejs/kit';
import { isAxiosError } from 'axios';
import client from '$lib/api';

export async function load({ locals, cookies, fetch }) {
	try {
		const serverStats = await client.GET("/stats", { fetch });

		if (locals.user) {
			const radioSongs = await client.GET("/songs/radio", { fetch });
			const rivalScores = await client.GET("/scores/rivals", { fetch });
			const recentScores = await client.GET("/scores", {
				fetch, params: {
					query:
						{ withPlayer: true, withSong: true, pageSize: 10, timeSort: "desc" }
				}
			});

			return {
				radioSongs,
				rivalScores,
				recentScores,
				serverStats,
			};
		}
		return {
			radioSongs: undefined,
			rivalScores: undefined,
			recentScores: undefined,
			serverStats,
		};
	} catch (e) {
		if (isAxiosError(e) && e.response)
			throw error(e.response?.status, { message: e.response.data.error });
		else throw e;
	}
}
