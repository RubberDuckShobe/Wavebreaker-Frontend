import { error as svelteError, type Actions, fail } from '@sveltejs/kit';
import client from '$lib/api';

export async function load({ params, locals, fetch }) {
	const id: number = +params.id;
	const userResult = await client.GET("/players/{id}", { params: { path: { id }, query: { withStats: true } }, fetch });

	if (userResult.error) {
		svelteError(userResult.response.status, userResult.error.error);
	}

	const latestScores = await client.GET("/scores", { params: { query: { playerId: id, timeSort: "desc" } }, fetch });
	const bestScores = await client.GET("/scores", { params: { query: { playerId: id, scoreSort: "desc" } }, fetch });

	if (locals.user) {
		let ownRivals = await client.GET("/rivals/self", { fetch });
		if (locals.user.id === id) {
			var rivalsAndChallengers = ownRivals;
		}
		var isRival = ownRivals.data.rivalries.some(rival => rival.rival.id === id);
	}

	return {
		userData: userResult.data,
		latestScores: {
			data: latestScores.data,
			error: latestScores.error
		},
		bestScores: {
			data: bestScores.data,
			error: bestScores.error
		},
		rivalsAndChallengers: {
			data: rivalsAndChallengers?.data,
			error: rivalsAndChallengers?.error
		},
		isRival
	};
}

export const actions = {
	addRival: async ({ params, fetch }) => {
		const id: number = +params.id;

		const addRivalResult = await client.POST("/rivals/add", { body: { rivalId: id }, fetch });
		if (addRivalResult.error) {
			return fail(addRivalResult.response.status, { success: false, message: addRivalResult.error.error });
		}
		return { success: true };
	},
	removeRival: async ({ params, fetch }) => {
		const id: number = +params.id;

		const removeRivalResult = await client.DELETE("/rivals/remove", { body: { rivalId: id }, fetch });
		if (removeRivalResult.error) {
			return fail(removeRivalResult.response.status, { success: false, message: removeRivalResult.error.error });
		}
		return { success: true };
	}
} satisfies Actions;
