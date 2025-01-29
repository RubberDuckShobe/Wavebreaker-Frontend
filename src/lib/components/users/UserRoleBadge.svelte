<script lang="ts">
	import UserBadge from './UserBadge.svelte';
	import teamBadgeIcon from '$lib/assets/wavebreaker_icon_white.svg';
	import type { components } from '$lib/api/wavebreaker';

	export let targetUser: components['schemas']['PlayerPublic'];
</script>

{#if targetUser.accountType == 2}
	<UserBadge
		classExt="bg-gradient-to-r from-teal-400 to-primary"
		imgSrc={teamBadgeIcon}
		label={'Wavebreaker Team'}
	/>
{:else if targetUser.accountType == 1}
	<UserBadge classExt="bg-error" label={'Moderator'} />
{/if}
