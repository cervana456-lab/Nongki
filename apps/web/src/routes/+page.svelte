<script lang="ts">
	import Seo from '$lib/components/seo/Seo.svelte';
	import HeroSection from '$lib/components/home/HeroSection.svelte';
	import ProblemOverviewSection from '$lib/components/home/ProblemOverviewSection.svelte';
	import StickyStorySection from '$lib/components/home/StickyStorySection.svelte';
	import FeaturePreviewSection from '$lib/components/home/FeaturePreviewSection.svelte';
	import PricingPreviewSection from '$lib/components/home/PricingPreviewSection.svelte';
	import OwnerDigestPreviewSection from '$lib/components/home/OwnerDigestPreviewSection.svelte';

	const description =
		'Nongki membantu coffee shop, kafe, dan resto mengubah chat WhatsApp menjadi Customer 360, insight bisnis, order, QRIS, owner digest, dan action otomatis.';

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'SoftwareApplication',
		name: 'Nongki',
		applicationCategory: 'BusinessApplication',
		operatingSystem: 'Web',
		description,
		url: 'https://nongki.app',
		offers: {
			'@type': 'Offer',
			price: '0',
			priceCurrency: 'IDR'
		}
	};
</script>

<Seo
	title="Nongki - AI WhatsApp CRM untuk UMKM F&B"
	{description}
	path="/"
	keywords="Nongki, Ningki, AI WhatsApp CRM, UMKM F&B, Customer 360, QRIS Payment"
	{jsonLd}
/>

<HeroSection />
<ProblemOverviewSection />
<StickyStorySection />
<FeaturePreviewSection />
<OwnerDigestPreviewSection />
<PricingPreviewSection />
