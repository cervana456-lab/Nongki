<script lang="ts">
	import Reveal from '$lib/components/home/Reveal.svelte';
	import Seo from '$lib/components/seo/Seo.svelte';
	import { Button } from '$lib/components/ui/button';
	import { productIndex, productIndexFlow, productPages } from '$lib/constants/product';
	import ProductFlowCanvas from './flow/ProductFlowCanvas.svelte';
	import ProductMockup from './ProductMockup.svelte';

	const title = 'Produk Nongki - AI WhatsApp CRM, Customer 360, QRIS, dan Owner Dashboard';
	const description =
		'Lihat modul produk Nongki untuk mengelola chat WhatsApp, AI Agent, Customer 360, order/reservasi, QRIS Payment, dan dashboard owner untuk UMKM F&B.';

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		name: title,
		description,
		url: 'https://nongki.app/product'
	};
</script>

<Seo {title} {description} path="/product" {jsonLd} />

<section class="bg-background py-16 md:py-28">
	<div
		class="mx-auto grid w-full max-w-7xl gap-10 px-4 lg:grid-cols-[0.95fr_1.05fr] lg:items-center"
	>
		<Reveal>
			<div class="space-y-6">
				<p class="text-sm font-black tracking-[0.18em] text-primary uppercase">
					{productIndex.eyebrow}
				</p>

				<h1 class="font-heading text-4xl leading-tight font-bold text-balance md:text-6xl">
					{productIndex.title}
				</h1>

				<p class="max-w-2xl text-lg leading-relaxed text-muted-foreground">
					{productIndex.description}
				</p>

				<div class="flex flex-col gap-3 sm:flex-row">
					<Button href="/auth/register" size="lg">Mulai Gratis</Button>

					<Button href="#product-grid" variant="outline" size="lg">Lihat Produk</Button>
				</div>
			</div>
		</Reveal>

		<Reveal delay={0.08}>
			<div class="shadow-3d-lg rounded-[2rem] border-2 bg-muted/40 p-4">
				<ProductMockup type="dashboard" />
			</div>
		</Reveal>
	</div>
</section>

<section id="product-grid" class="bg-muted/40 py-16 md:py-28">
	<div class="mx-auto w-full max-w-7xl px-4">
		<Reveal>
			<div class="max-w-3xl space-y-4">
				<h2 class="font-heading text-3xl leading-tight font-bold md:text-5xl">
					Pilih modul sesuai workflow bisnismu.
				</h2>

				<p class="text-lg text-muted-foreground">
					Mulai dari chat, lanjut ke data customer, order, payment, dan insight owner.
				</p>
			</div>
		</Reveal>

		<div class="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
			{#each productIndex.products as slug, index (slug)}
				{@const product = productPages[slug]}
				{@const Icon = product.icon}

				<Reveal delay={index * 0.04}>
					<a
						href={`/product/${product.slug}`}
						class="shadow-3d-sm hover:shadow-3d-lg block h-full rounded-3xl border-2 bg-background p-5 transition-all duration-300 hover:-translate-y-1"
					>
						<div
							class="grid size-12 place-items-center rounded-2xl bg-primary text-primary-foreground"
						>
							<Icon class="size-5" />
						</div>

						<h3 class="mt-5 font-heading text-2xl font-bold">
							{product.eyebrow}
						</h3>

						<p class="mt-3 text-sm leading-relaxed text-muted-foreground">
							{product.description}
						</p>

						<p class="mt-5 text-sm font-black text-primary">Lihat detail -&gt;</p>
					</a>
				</Reveal>
			{/each}
		</div>
	</div>
</section>

<section class="bg-background py-16 md:py-28">
	<div class="mx-auto w-full max-w-7xl px-4">
		<Reveal>
			<div class="mx-auto max-w-3xl space-y-4 text-center">
				<h2 class="font-heading text-3xl leading-tight font-bold md:text-5xl">
					Satu ekosistem untuk chat, data, pembayaran, dan insight.
				</h2>

				<p class="text-lg text-muted-foreground">
					WhatsApp jadi pintu masuk, lalu data mengalir sampai owner punya action.
				</p>
			</div>
		</Reveal>

		<Reveal delay={0.08}>
			<div class="mt-10">
				<ProductFlowCanvas flow={productIndexFlow} animated />
			</div>
		</Reveal>
	</div>
</section>

<section class="bg-primary py-16 text-primary-foreground md:py-28">
	<div class="mx-auto w-full max-w-5xl px-4 text-center">
		<Reveal>
			<div class="space-y-6">
				<h2 class="font-heading text-3xl leading-tight font-bold md:text-5xl">
					Mulai ubah WhatsApp jadi sistem bisnis.
				</h2>

				<p class="mx-auto max-w-2xl text-lg text-primary-foreground/85">
					Pilih modul pertama, hubungkan workflow chat, lalu biarkan data pelanggan tersusun rapi.
				</p>

				<Button href="/auth/register" variant="secondary" size="lg">Mulai Gratis</Button>
			</div>
		</Reveal>
	</div>
</section>
