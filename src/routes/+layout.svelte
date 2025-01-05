<!-- @migration task: review uses of `navigating` -->
<script lang="ts">
	import '../app.postcss';
	import Footer from '$lib/components/common/Footer.svelte';
	import Navbar from '$lib/components/common/Navbar.svelte';
	import BottomNav from '$lib/components/common/BottomNav.svelte';

	//import { navigating } from '$app/state';
</script>

<div class="flex flex-col min-h-screen justify-between">
	<Navbar />
	<div class="max-w-7xl self-center w-full p-5">
		<slot />
		<!--
		{#if navigating}
			<div class="flex justify-center items-center w-full">
				<h1 class="text-3xl text-center">Please wait...</h1>
			</div>
		{:else}
			<slot />
		{/if}
		-->
	</div>
	<Footer />
</div>
<BottomNav />
