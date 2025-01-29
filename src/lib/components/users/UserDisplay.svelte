<script lang="ts">
	import type { components } from '$lib/api/wavebreaker';
	import UserRoleBadge from './UserRoleBadge.svelte';

	export let targetUser: components['schemas']['PlayerPublic'];
</script>

<div
	class="flex gap-y-2 items-center flex-col
    md:flex-row md:space-x-5"
>
	<div class="avatar">
		<div class="w-[11.5rem] h-[11.5rem] rounded-3xl shadow">
			<img class="w-[11.5rem] h-[11.5rem]" src={targetUser.avatarUrl} alt="Avatar of {targetUser.username}" />
		</div>
	</div>
	<div class="flex flex-col items-center md:items-start space-y-2">
		<h1 class="max-w-sm lg:max-w-4xl text-3xl md:text-5xl font-bold break-all">
			{targetUser.username}
		</h1>
		<UserRoleBadge {targetUser} />
	</div>
</div>
