<script>
	import { faMusic, faUser } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { page } from '$app/state';
</script>

<div class="flex flex-col gap-y-3">
	<div class="tabs tabs-boxed self-center shadow justify-self-stretch">
		<a
			href="/rankings/users"
			class="tab"
			class:tab-active={page.url.pathname.startsWith('/rankings/users')}
			><Fa class="mr-3" icon={faUser} />User rankings</a
		>
		<a
			href="/rankings/songs"
			class="tab"
			class:tab-active={page.url.pathname.startsWith('/rankings/songs')}
			><Fa class="mr-3" icon={faMusic} />Song rankings</a
		>
	</div>
	<slot />
</div>
