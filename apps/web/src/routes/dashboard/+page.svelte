<script lang="ts">
	import Seo from '$lib/components/seo/Seo.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
</script>

<Seo
	title="Dashboard Nongki"
	description="Dashboard demo Nongki untuk melihat ringkasan chat, customer, order, dan digest."
	path="/dashboard"
	robots="noindex, nofollow"
/>

<section class="bg-background px-4 py-16 md:py-24">
	<div class="mx-auto max-w-6xl">
		<div class="max-w-3xl">
			<p class="text-sm font-black tracking-[0.18em] text-primary uppercase">Demo Private</p>
			<h1 class="mt-4 font-heading text-4xl leading-tight font-black md:text-6xl">
				Dashboard Nongki sedang disiapkan.
			</h1>
			<p class="mt-5 text-lg leading-relaxed text-muted-foreground">
				Halaman ini menjadi placeholder untuk dashboard private: inbox WhatsApp, Customer 360,
				order/reservasi, QRIS, dan owner digest.
			</p>
		</div>

		<div class="mt-10 grid gap-5 md:grid-cols-3">
			{#each ['Inbox CRM', 'Customer 360', 'Owner Digest'] as item (item)}
				<Card.Root class="rounded-3xl border-2 bg-card">
					<Card.Header>
						<Card.Title class="font-heading text-2xl font-black">{item}</Card.Title>
						<Card.Description>
							Modul demo akan tampil setelah integrasi dashboard production siap.
						</Card.Description>
					</Card.Header>
				</Card.Root>
			{/each}
		</div>

		<div class="mt-10 flex flex-col gap-3 sm:flex-row">
			<Button href="/product">Lihat Produk</Button>
			<Button href="/settings" variant="outline">Pengaturan Demo</Button>
		</div>
	</div>
</section>
