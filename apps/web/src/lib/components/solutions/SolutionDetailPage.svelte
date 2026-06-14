<script lang="ts">
	import Seo from '$lib/components/seo/Seo.svelte';
	import type { SolutionPageData } from '$lib/constants/solutions';
	import SolutionCtaSection from './SolutionCtaSection.svelte';
	import SolutionFeatureStack from './SolutionFeatureStack.svelte';
	import SolutionHero from './SolutionHero.svelte';
	import SolutionWorkflowSection from './SolutionWorkflowSection.svelte';

	let { solution }: { solution: SolutionPageData } = $props();

	let path = $derived(`/solutions/${solution.slug}`);
	let jsonLd = $derived({
		'@context': 'https://schema.org',
		'@type': 'Service',
		name: solution.title,
		description: solution.description,
		provider: {
			'@type': 'Organization',
			name: 'Nongki',
			url: 'https://nongki.app'
		},
		url: `https://nongki.app${path}`
	});
</script>

<Seo title={solution.title} description={solution.description} {path} {jsonLd} />

<SolutionHero {solution} />
<SolutionWorkflowSection {solution} />
<SolutionFeatureStack {solution} />
<SolutionCtaSection {solution} />
