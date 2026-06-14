<script lang="ts">
	import type { FeaturePageData } from '$lib/constants/features';
	import FeatureCapabilitySection from './FeatureCapabilitySection.svelte';
	import FeatureCtaSection from './FeatureCtaSection.svelte';
	import FeatureHero from './FeatureHero.svelte';
	import FeatureHowItWorksSection from './FeatureHowItWorksSection.svelte';

	let { feature }: { feature: FeaturePageData } = $props();
</script>

<svelte:head>
	<title>{feature.title} | Nongki</title>
	<meta name="description" content={feature.description} />
</svelte:head>

<FeatureHero {feature} />
<FeatureHowItWorksSection {feature} />
<FeatureCapabilitySection {feature} />
<FeatureCtaSection {feature} />
