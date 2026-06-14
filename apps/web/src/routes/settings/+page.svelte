<script lang="ts">
	import Seo from '$lib/components/seo/Seo.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
</script>

<Seo
	title="Settings Nongki"
	description="Pengaturan demo workspace Nongki."
	path="/settings"
	robots="noindex, nofollow"
/>

<section class="bg-background px-4 py-16 md:py-24">
	<div class="mx-auto max-w-4xl">
		<p class="text-sm font-black tracking-[0.18em] text-primary uppercase">Demo Private</p>
		<h1 class="mt-4 font-heading text-4xl leading-tight font-black md:text-6xl">
			Settings workspace demo.
		</h1>
		<p class="mt-5 text-lg leading-relaxed text-muted-foreground">
			Pengaturan bisnis, nomor WhatsApp, knowledge base, dan role tim akan berada di sini saat auth
			production sudah aktif.
		</p>

		<Card.Root class="mt-10 rounded-3xl border-2 bg-card">
			<Card.Header>
				<Card.Title class="font-heading text-2xl font-black">Belum ada konfigurasi aktif</Card.Title
				>
				<Card.Description>
					Halaman ini sengaja tidak diindex dan tidak masuk sitemap publik.
				</Card.Description>
			</Card.Header>
		</Card.Root>

		<div class="mt-8 flex flex-col gap-3 sm:flex-row">
			<Button href="/dashboard">Kembali ke Dashboard</Button>
			<Button href="/product" variant="outline">Lihat Produk</Button>
		</div>
	</div>
</section>
