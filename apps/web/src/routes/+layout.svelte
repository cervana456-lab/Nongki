<script lang="ts">
	import Header from '$lib/components/layouts/Header.svelte';
	import './layout.css';

	let { children } = $props();

	import QueryProvider from '$lib/providers/QueryProvider.svelte';
	import Footer from '$lib/components/layouts/Footer.svelte';
</script>

<QueryProvider>
	<Header />

	<main>
		{@render children()}
	</main>
	<Footer />
</QueryProvider>
