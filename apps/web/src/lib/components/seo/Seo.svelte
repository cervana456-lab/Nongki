<script lang="ts">
	import {
		buildCanonical,
		buildPageTitle,
		seoConfig,
		truncateDescription
	} from '$lib/constants/seo';

	type JsonLd = Record<string, unknown> | Record<string, unknown>[];

	type SeoProps = {
		title?: string;
		description?: string;
		canonical?: string;
		path?: string;
		image?: string;
		type?: string;
		robots?: string;
		keywords?: string;
		jsonLd?: JsonLd;
	};

	let {
		title,
		description = seoConfig.defaultDescription,
		canonical,
		path = '/',
		image = seoConfig.defaultOgImage,
		type = 'website',
		robots = 'index, follow',
		keywords,
		jsonLd
	}: SeoProps = $props();

	let pageTitle = $derived(buildPageTitle(title));
	let pageDescription = $derived(truncateDescription(description));
	let pageCanonical = $derived(canonical ?? buildCanonical(path));
	let pageImage = $derived(image.startsWith('http') ? image : `${seoConfig.siteUrl}${image}`);
	let serializedJsonLd = $derived(jsonLd ? JSON.stringify(jsonLd).replace(/</g, '\\u003c') : '');
</script>

<svelte:head>
	<title>{pageTitle}</title>

	<meta name="description" content={pageDescription} />
	<meta name="robots" content={robots} />
	{#if keywords}
		<meta name="keywords" content={keywords} />
	{/if}
	<meta name="author" content={seoConfig.siteName} />

	<link rel="canonical" href={pageCanonical} />

	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={pageDescription} />
	<meta property="og:type" content={type} />
	<meta property="og:url" content={pageCanonical} />
	<meta property="og:site_name" content={seoConfig.siteName} />
	<meta property="og:image" content={pageImage} />
	<meta property="og:locale" content={seoConfig.locale} />

	<meta name="twitter:card" content={seoConfig.twitterCard} />
	<meta name="twitter:title" content={pageTitle} />
	<meta name="twitter:description" content={pageDescription} />
	<meta name="twitter:image" content={pageImage} />

	{#if serializedJsonLd}
		<svelte:element this={'script'} type="application/ld+json">{serializedJsonLd}</svelte:element>
	{/if}
</svelte:head>
