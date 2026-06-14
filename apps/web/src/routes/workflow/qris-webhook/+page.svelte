<script lang="ts">
	import WorkflowPlaceholderPage from '$lib/components/workflow/WorkflowPlaceholderPage.svelte';

	const title = 'QRIS Webhook';
	const description =
		'Alur pembayaran QRIS saat order sudah siap dan status pembayaran perlu kembali ke sistem.';
	const steps = [
		{
			title: 'QRIS dibuat',
			description: 'Sistem membuat pembayaran dari order atau top-up kredit AI.'
		},
		{ title: 'Webhook diterima', description: 'AstraPay mengirim status pembayaran ke Nongki.' },
		{
			title: 'Status diperbarui',
			description: 'Order, kredit, dan notifikasi owner ikut diperbarui.'
		}
	];
</script>

<WorkflowPlaceholderPage {title} {description} {steps} />
