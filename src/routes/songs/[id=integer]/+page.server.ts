import { error, fail } from '@sveltejs/kit';
import { fetcher, poster } from '$lib/api';
import { isAxiosError } from 'axios';
import type { Song } from '$lib/models/SongData.js';
import type { Actions } from './$types';

export async function load({ params }) {
	const id: number = +params.id;
	try {
		const songResult: Song = await fetcher<Song>(`/api/songs/getSong?id=${id}`);

		return {
			songResult
		};
	} catch (e) {
		if (isAxiosError(e) && e.response)
			throw error(e.response?.status, { message: e.response.data.error });
		else throw e;
	}
}

export const actions = {
	reportMetadata: async ({ request, cookies, params }) => {
		const data = await request.formData();
		const additionalInfo = data.get('additionalInfo');
		const id: number = +params.id;
		const authToken = cookies.get('Authorization');

		try {
			await poster('/api/songs/reportMetadata', { id, additionalInfo }, authToken);
		} catch (e) {
			if (isAxiosError(e) && e.response)
				return fail(e.response?.status, { message: e.response.data.error });
		}

		return { success: true };
	}
} satisfies Actions;
