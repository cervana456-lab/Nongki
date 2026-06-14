<script lang="ts">
	import Seo from '$lib/components/seo/Seo.svelte';
	import type { ProductPageData } from '$lib/constants/product';
	import ProductCapabilityGrid from './ProductCapabilityGrid.svelte';
	import ProductCtaSection from './ProductCtaSection.svelte';
	import ProductHero from './ProductHero.svelte';
	import ProductWorkflowSection from './ProductWorkflowSection.svelte';

	let { product }: { product: ProductPageData } = $props();

	let path = $derived(`/product/${product.slug}`);
	let jsonLd = $derived({
		'@context': 'https://schema.org',
		'@type': 'SoftwareApplication',
		name: product.title,
		applicationCategory: 'BusinessApplication',
		operatingSystem: 'Web',
		description: product.description,
		url: `https://nongki.app${path}`
	});
</script>

<Seo title={product.title} description={product.description} {path} {jsonLd} />

<ProductHero {product} />
<ProductWorkflowSection {product} />
<ProductCapabilityGrid {product} />
<ProductCtaSection {product} />
