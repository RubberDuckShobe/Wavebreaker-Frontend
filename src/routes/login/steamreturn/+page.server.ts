import { dev } from '$app/environment';
import { fetcher } from '$lib/utils/api';
import type { UserInfo, UserTokenResponse } from '$lib/models/UserData';
import { error, redirect, type ServerLoadEvent } from '@sveltejs/kit';
import { isAxiosError } from 'axios';
import client from '$lib/api';
import type { components } from '$lib/api/wavebreaker';

//Getting this to work took me at least 4 hours. This is a cry for help.
//Nevermind. Make that at least 6.
//still not working.
//nvm finally.
export const load = async ({ url, cookies, locals, fetch }: ServerLoadEvent) => {
	try {
		const tokenResponse = await fetcher<components["schemas"]["AuthBodySchema"]>(
			'/api/auth/return?' + url.searchParams.toString()
		);

		cookies.set('authorization', `${tokenResponse.token_type} ${tokenResponse.access_token}`, {
			path: '/',
			expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 28), // 4 weeks
			secure: !dev
		});

		const user = await client.GET("/players/self", { fetch, headers: { "authorization": `${tokenResponse.token_type} ${tokenResponse.access_token}` } });
		if (user.error) {
			throw error(500, { message: user.error.error });
		}
		locals.user = user.data;
		console.log('Logged in as user ' + user.data.id);

		throw redirect(307, '/');
	} catch (e) {
		if (isAxiosError(e) && e.response)
			throw error(e.response?.status, { message: e.response.data.error });
		else throw e;
	}
};
