import { error, fail } from '@sveltejs/kit';
import { poster } from '$lib/utils/api';
import { isAxiosError } from 'axios';
import type { Song } from '$lib/models/SongData.js';
import type { Actions } from './$types';
import { loadMetadata } from '$lib/stores/metadata-store';

export async function load({ params }) {
	const id: number = +params.id;
	const songResult: Promise<Song> = await loadMetadata(fetch, `/api/songs/getSong?id=${id}`);

	if (!songResult) throw error(404, { message: 'Song not found' });

	return {
		songResult: await songResult
	};
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
	},

	applyMBID: async ({ request, cookies, params }) => {
		const data = await request.formData();
		const mbid = data.get('mbid');
		const id: number = +params.id;
		const authToken = cookies.get('Authorization');

		try {
			await poster('/api/songs/applyMBID', { id, mbid }, authToken);
		} catch (e) {
			if (isAxiosError(e) && e.response)
				return fail(e.response?.status, { message: e.response.data.error });
		}

		return { success: true };
	},

	markMistag: async ({ cookies, params }) => {
		const id: number = +params.id;
		const authToken = cookies.get('Authorization');

		try {
			await poster('/api/songs/markMistag', { id }, authToken);
		} catch (e) {
			if (isAxiosError(e) && e.response)
				return fail(e.response?.status, { message: e.response.data.error });
		}

		return { success: true };
	},

	deleteShout: async ({ request, cookies }) => {
		const data = await request.formData();
		const shoutId = data.get('shoutId');
		const authToken = cookies.get('Authorization');

		try {
			await poster('/api/shouts/deleteShout', { id: Number(shoutId) }, authToken);
		} catch (e) {
			if (isAxiosError(e) && e.response)
				return fail(e.response?.status, { message: e.response.data.error });
			else return fail(500, { message: 'Unknown error' });
		}

		return { success: true };
	}
} satisfies Actions;
