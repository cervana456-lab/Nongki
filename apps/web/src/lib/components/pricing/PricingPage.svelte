<script lang="ts">
	import PricingCtaSection from './PricingCtaSection.svelte';
	import PricingFaqSection from './PricingFaqSection.svelte';
	import PricingHero from './PricingHero.svelte';
	import PricingPlansSection from './PricingPlansSection.svelte';
</script>

<svelte:head>
	<title>Pricing | Nongki</title>
	<meta
		name="description"
		content="Mulai gratis dengan Nongki, gunakan kredit AI pay-as-you-go, dan upgrade ke Pro saat bisnis butuh multi-outlet."
	/>
</svelte:head>

<PricingHero />
<PricingPlansSection />
<PricingFaqSection />
<PricingCtaSection />
