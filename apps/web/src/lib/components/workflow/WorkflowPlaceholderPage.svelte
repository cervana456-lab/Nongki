<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { siteConfig } from '$lib/constants/header';

	type WorkflowStep = {
		title: string;
		description: string;
	};

	let {
		title,
		description,
		steps
	}: {
		title: string;
		description: string;
		steps: WorkflowStep[];
	} = $props();
</script>

<svelte:head>
	<title>{title} | {siteConfig.name}</title>
	<meta name="description" content={`${title} workflow untuk ${siteConfig.description}.`} />
</svelte:head>

<section class="bg-background px-4 py-16 md:py-24">
	<div class="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
		<div class="space-y-5">
			<p class="text-sm font-black tracking-[0.18em] text-primary uppercase">Workflow</p>
			<h1 class="font-heading text-4xl leading-tight font-bold text-balance md:text-6xl">
				{title}
			</h1>
			<p class="max-w-2xl text-lg leading-relaxed text-muted-foreground">
				{description}
			</p>
			<div class="flex flex-col gap-3 sm:flex-row">
				<Button href="/auth/register" size="lg">Mulai Gratis</Button>
				<Button href="/product" variant="outline" size="lg">Lihat Produk</Button>
			</div>
		</div>

		<Card.Root class="shadow-3d-sm rounded-3xl border-2">
			<Card.Header>
				<Card.Title class="font-heading text-2xl">Alur ringkas</Card.Title>
				<Card.Description>
					Detail teknis akan dilengkapi bertahap. Untuk sekarang, alur utamanya tetap jelas.
				</Card.Description>
			</Card.Header>
			<Card.Content class="grid gap-3">
				{#each steps.slice(0, 3) as step, index (step.title)}
					<div class="rounded-2xl border-2 bg-muted/40 p-4">
						<p class="text-xs font-black tracking-[0.14em] text-primary uppercase">
							Step {index + 1}
						</p>
						<h2 class="mt-2 font-heading text-lg font-bold">{step.title}</h2>
						<p class="mt-1 text-sm leading-relaxed text-muted-foreground">
							{step.description}
						</p>
					</div>
				{/each}
			</Card.Content>
		</Card.Root>
	</div>
</section>

<section class="bg-muted/40 px-4 py-16 md:py-24">
	<div class="mx-auto max-w-6xl">
		<div class="max-w-3xl space-y-4">
			<p class="text-sm font-black tracking-[0.18em] text-primary uppercase">Step-by-step</p>
			<h2 class="font-heading text-3xl leading-tight font-bold md:text-5xl">
				Workflow bisnis tetap bisa diikuti dari awal sampai action.
			</h2>
		</div>

		<div class="mt-10 grid gap-4 md:grid-cols-3">
			{#each steps as step, index (step.title)}
				<Card.Root class="shadow-3d-sm h-full rounded-3xl border-2">
					<Card.Content class="p-5">
						<div
							class="grid size-10 place-items-center rounded-2xl bg-primary text-sm font-bold text-primary-foreground"
						>
							{index + 1}
						</div>
						<h3 class="mt-5 font-heading text-xl font-bold">{step.title}</h3>
						<p class="mt-2 text-sm leading-relaxed text-muted-foreground">
							{step.description}
						</p>
					</Card.Content>
				</Card.Root>
			{/each}
		</div>
	</div>
</section>

<section class="bg-primary px-4 py-16 text-primary-foreground md:py-20">
	<div class="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
		<div class="max-w-2xl space-y-3">
			<h2 class="font-heading text-3xl font-bold md:text-4xl">
				Lanjutkan dari workflow ke produk Nongki.
			</h2>
			<p class="text-primary-foreground/80">
				Pilih modul yang relevan, lalu hubungkan chat WhatsApp dengan Customer 360, insight, dan
				approval owner.
			</p>
		</div>
		<div class="flex flex-col gap-3 sm:flex-row">
			<Button href="/product" variant="secondary" size="lg">Lihat Produk</Button>
			<Button href="/docs" variant="outline" size="lg" class="bg-background text-foreground">
				Baca Docs
			</Button>
		</div>
	</div>
</section>
