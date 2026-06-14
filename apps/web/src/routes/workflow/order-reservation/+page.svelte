<script lang="ts">
	import WorkflowPlaceholderPage from '$lib/components/workflow/WorkflowPlaceholderPage.svelte';

	const title = 'Order Reservation';
	const description =
		'Alur saat chat pelanggan berubah menjadi draft order atau reservasi yang siap direview.';
	const steps = [
		{
			title: 'Intent order terbaca',
			description: 'AI menangkap kebutuhan order atau reservasi dari chat.'
		},
		{ title: 'Draft dibuat', description: 'Detail item, jadwal, dan catatan disusun untuk admin.' },
		{
			title: 'Admin approve',
			description: 'Tim tetap memutuskan sebelum order atau reservasi diproses.'
		}
	];
</script>

<WorkflowPlaceholderPage {title} {description} {steps} />
