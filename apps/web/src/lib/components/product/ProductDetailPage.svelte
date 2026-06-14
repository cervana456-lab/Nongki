<script lang="ts">
	import type { ProductPageData } from '$lib/constants/product';
	import ProductCapabilityGrid from './ProductCapabilityGrid.svelte';
	import ProductCtaSection from './ProductCtaSection.svelte';
	import ProductHero from './ProductHero.svelte';
	import ProductWorkflowSection from './ProductWorkflowSection.svelte';

	let { product }: { product: ProductPageData } = $props();
</script>

<ProductHero {product} />
<ProductWorkflowSection {product} />
<ProductCapabilityGrid {product} />
<ProductCtaSection {product} />
