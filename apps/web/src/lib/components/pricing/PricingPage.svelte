<script lang="ts">
	import Seo from '$lib/components/seo/Seo.svelte';
	import PricingCtaSection from './PricingCtaSection.svelte';
	import PricingFaqSection from './PricingFaqSection.svelte';
	import PricingHero from './PricingHero.svelte';
	import PricingPlansSection from './PricingPlansSection.svelte';

	const title = 'Harga Nongki';
	const description =
		'Mulai gratis dengan Nongki, gunakan kredit AI pay-as-you-go, dan upgrade ke Pro saat bisnis butuh multi-outlet.';

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'OfferCatalog',
		name: 'Paket harga Nongki',
		url: 'https://nongki.app/pricing',
		itemListElement: [
			{
				'@type': 'Offer',
				name: 'Starter',
				price: '0',
				priceCurrency: 'IDR'
			},
			{
				'@type': 'Offer',
				name: 'Kredit AI',
				priceCurrency: 'IDR'
			},
			{
				'@type': 'Offer',
				name: 'Pro',
				priceCurrency: 'IDR'
			}
		]
	};
</script>

<Seo {title} {description} path="/pricing" {jsonLd} />

<PricingHero />
<PricingPlansSection />
<PricingFaqSection />
<PricingCtaSection />
