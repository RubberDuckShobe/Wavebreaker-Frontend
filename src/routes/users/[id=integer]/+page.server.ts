import { error, type Actions, fail } from '@sveltejs/kit';
import type {
	AddOrRemoveRivalResponse,
	ExtendedUserInfo,
	GetOwnRivalsResponse,
	IsRivalResponse
} from '$lib/models/UserData';
import type { GetScoresResponse } from '$lib/models/ScoreData';
import { loadMetadata } from '$lib/stores/metadata-store';
import { fetcher, poster } from '$lib/utils/api.js';
import { isAxiosError } from 'axios';

export async function load({ params, cookies, locals }) {
	const id: number = +params.id;
	const userResult: ExtendedUserInfo = await loadMetadata(
		fetch,
		`/api/users/getUser?id=${id}&getExtendedInfo=true`
	);
	const authCookie = cookies.get('Authorization');

	if (!userResult) {
		throw error(404, 'User not found');
	}

	const latestScoresPromise: Promise<GetScoresResponse> = loadMetadata(
		fetch,
		`/api/scores/getScores?userId=${id}`
	);
	const bestScoresPromise: Promise<GetScoresResponse> = loadMetadata(
		fetch,
		`/api/scores/getScores?userId=${id}&scoreSort=desc`
	);

	let rivalsAndChallengersPromise: Promise<GetOwnRivalsResponse>;
	let isRivalPromise: Promise<IsRivalResponse>;

	if (locals.user && locals.user.id == parseInt(params.id)) {
		rivalsAndChallengersPromise = fetcher(`/api/users/getOwnRivals`, authCookie);
	} else if (locals.user) {
		isRivalPromise = fetcher<IsRivalResponse>(`/api/users/isRival?id=${params.id}`, authCookie);
	}

	return {
		userResult,
		latestScoresResult: await Promise.resolve(latestScoresPromise),
		bestScoresResult: await Promise.resolve(bestScoresPromise),
		rivalsAndChallengers: await Promise.resolve(rivalsAndChallengersPromise),
		isRivalResponse: await Promise.resolve(isRivalPromise)
	};
}

export const actions = {
	addRival: async ({ cookies, params }) => {
		const id: number = +params.id;
		const authToken = cookies.get('Authorization');
		let addRivalResult: AddOrRemoveRivalResponse;

		try {
			addRivalResult = await poster('/api/users/addRival', { id }, authToken);
		} catch (e) {
			if (isAxiosError(e) && e.response)
				return fail(e.response?.status, { success: false, message: e.response.data.error });
		}
		return { success: addRivalResult.success };
	},
	removeRival: async ({ cookies, params }) => {
		const id: number = +params.id;
		const authToken = cookies.get('Authorization');
		let removeRivalResult: AddOrRemoveRivalResponse;

		try {
			removeRivalResult = await poster('/api/users/removeRival', { id }, authToken);
		} catch (e) {
			if (isAxiosError(e) && e.response)
				return fail(e.response?.status, { success: false, message: e.response.data.error });
		}
		return { success: removeRivalResult.success };
	}
} satisfies Actions;
