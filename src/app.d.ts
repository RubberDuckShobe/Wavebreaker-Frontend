// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { UserInfo } from '$lib/models/UserData.ts';
import { components } from '$lib/api/wavebreaker';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: components["schemas"]["PlayerPublic"] | null; // Your type here
		}
		interface PageData {
			user: components["schemas"]["PlayerPublic"] | null;
		}
		// interface Platform {}
	}
}

export {};
