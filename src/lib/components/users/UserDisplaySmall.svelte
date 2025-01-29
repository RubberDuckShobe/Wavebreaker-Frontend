<script lang="ts">
	import type { components } from '$lib/api/wavebreaker';

	export let targetUser: components['schemas']['PlayerPublic'];
</script>

<a
	href="/users/{targetUser.id}"
	class="flex gap-y-2 gap-x-2 items-center flex-row bg-neutral rounded-xl shadow p-2"
>
	<div class="avatar">
		<div class="rounded-xl w-12 h-12">
			<img loading="lazy" src={targetUser.avatarUrl} alt="Avatar of {targetUser.username}" />
		</div>
	</div>
	<h1
		class="break-all font-semibold
            {targetUser.accountType == 2 &&
			'text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-primary'}
            {targetUser.accountType == 1 && 'text-error'}"
	>
		{targetUser.username}
	</h1>
</a>
