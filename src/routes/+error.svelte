<script lang="ts">
	import { page } from '$app/state';
	import { songQuoteList } from '$lib/utils/songQuoteList';
	const quote = songQuoteList[Math.floor(Math.random() * songQuoteList.length)];
</script>

<svelte:head>
    <title>Wavebreaker | Error</title> 
</svelte:head>

<div>
	<h1 class="text-9xl font-bold">{page.status}</h1>
	<h2 class="text-4xl">{page.error?.message}</h2>
	<p class="py-4 text-base-content/50">
		<a href={quote.link} target="_blank" rel="noopener noreferrer" class="hover:underline"><i>"{quote.content}"</i></a>
	</p>
</div>
