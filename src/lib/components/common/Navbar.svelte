<script>
	import logo from '$lib/assets/wavebreaker_icon.svg';
	import Fa from 'svelte-fa';
	import { faSteam } from '@fortawesome/free-brands-svg-icons';
	import {
		faDownload,
		faHome,
		faMedal,
		faMusic,
		faSignOut,
		faUser
	} from '@fortawesome/free-solid-svg-icons';

	import { page } from '$app/state';
	import { dev } from '$app/environment';

	const date = new Date();
	const month = date.getMonth() + 1;
	const day = date.getDate();
</script>

<div class="navbar bg-base-100 sticky top-0 z-50">
	<div class="navbar-start">
		<a href="/" class="btn btn-ghost normal-case text-2xl gap-x-3">
			<img src={logo} class="w-8 h-8" alt="Wavebreaker logo" />
			{#if month == 4 && day == 1}
				<span class="hidden sm:block">audiosurf2.info</span>
			{:else}
				<span class="hidden sm:block">Wavebreaker</span>
			{/if}
			{#if dev}
				<div class="badge badge-outline badge-warning badge-sm">dev</div>
			{/if}
		</a>
	</div>
	<div class="navbar-center hidden lg:block">
		<a
			href="/"
			class="btn btn-sm btn-ghost normal-case"
			class:text-primary={page.url.pathname == '/'}
		>
			<Fa class="mr-2" icon={faHome} /> Home
		</a>
		<a
			href="/users/search"
			class="btn btn-sm btn-ghost normal-case"
			class:text-primary={page.url.pathname.startsWith('/users')}
		>
			<Fa class="mr-2" icon={faUser} /> Users
		</a>
		<a
			href="/songs/search"
			class="btn btn-sm btn-ghost normal-case"
			class:text-primary={page.url.pathname.startsWith('/songs')}
		>
			<Fa class="mr-2" icon={faMusic} /> Songs
		</a>
		<a
			href="/rankings/users"
			class="btn btn-sm btn-ghost normal-case"
			class:text-primary={page.url.pathname.startsWith('/rankings')}
		>
			<Fa class="mr-2" icon={faMedal} /> Rankings
		</a>
	</div>
	<div class="navbar-end">
		{#if page.data.user}
			<div class="dropdown dropdown-end">
				<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
				<div tabindex="0" class="btn btn-ghost normal-case">
					<div class="avatar">
						<div class="w-8 h-8 rounded-lg">
							<img src={page.data.user.avatarUrl} alt="Avatar of {page.data.user.username}" />
						</div>
					</div>
					<div class="text-base ml-4">{page.data.user.username}</div>
				</div>
				<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
				<ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-52">
					<li class="menu-title">
						<span>{page.data.user.username}</span>
					</li>
					<li>
						<a href="/users/{page.data.user.id}"><Fa icon={faUser} class="mr-1" /> Profile</a>
					</li>
					<li>
						<a href="/installguide"><Fa icon={faDownload} class="mr-1" /> Install</a>
					</li>
					<li>
						<a href="/logout" rel="external" class="text-error"
							><Fa icon={faSignOut} class="mr-1 text-error" /> Log out</a
						>
					</li>
				</ul>
			</div>
		{:else}
			<a href="/login" rel="external" class="btn btn-primary btn-sm normal-case mr-4"
				><Fa icon={faSteam} class="mr-1" /> Sign in</a
			>
		{/if}
	</div>
</div>
