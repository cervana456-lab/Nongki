<script lang="ts">
	import type { SolutionPageData } from '$lib/constants/solutions';
	import SolutionCtaSection from './SolutionCtaSection.svelte';
	import SolutionFeatureStack from './SolutionFeatureStack.svelte';
	import SolutionHero from './SolutionHero.svelte';
	import SolutionWorkflowSection from './SolutionWorkflowSection.svelte';

	let { solution }: { solution: SolutionPageData } = $props();
</script>

<SolutionHero {solution} />
<SolutionWorkflowSection {solution} />
<SolutionFeatureStack {solution} />
<SolutionCtaSection {solution} />
