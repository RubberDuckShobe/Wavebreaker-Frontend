<script lang="ts">
	import { faHome, faUser, faMusic, faMedal } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	import { page } from '$app/state';
</script>

<div class="btm-nav z-50 drop-shadow-xl lg:hidden">
	<a href="/" class="text-primary" class:active={page.url.pathname == '/'}>
		<Fa icon={faHome} />
	</a>
	<a
		href="/users/search"
		class="text-primary"
		class:active={page.url.pathname.startsWith('/users')}
	>
		<Fa icon={faUser} />
	</a>
	<a
		href="/songs/search"
		class="text-primary"
		class:active={page.url.pathname.startsWith('/songs')}
	>
		<Fa icon={faMusic} />
	</a>
	<a
		href="/rankings/users"
		class="text-primary"
		class:active={page.url.pathname.startsWith('/rankings')}
	>
		<Fa icon={faMedal} />
	</a>
</div>
