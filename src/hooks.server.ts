import type { Handle, HandleFetch } from '@sveltejs/kit';
import client from '$lib/api';
import { env } from '$env/dynamic/public';

export const handle: Handle = async ({ event, resolve }) => {
	const jwt = event.cookies.get("authorization");

	if (jwt) {
		try {
			const user = await client.GET("/players/self", { fetch: event.fetch, headers: { "authorization": jwt } });
			if (user.error) {
				console.error(user.error.error);
			}
			else {
				event.locals.user = user.data;
			}
		} catch (e) {
			console.error(e);
		}
	}

	const response = await resolve(event);
	return response;
};