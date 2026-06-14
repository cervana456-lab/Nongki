<script lang="ts">
	import WorkflowPlaceholderPage from '$lib/components/workflow/WorkflowPlaceholderPage.svelte';

	const title = 'Upload Knowledge';
	const description =
		'Alur memasukkan menu, FAQ, promo, dan policy agar AI reply punya sumber jawaban yang jelas.';
	const steps = [
		{
			title: 'Upload dokumen',
			description: 'Owner menambahkan menu, FAQ, promo, atau SOP bisnis.'
		},
		{
			title: 'Knowledge diproses',
			description: 'Informasi disiapkan agar bisa dipakai dalam chat.'
		},
		{
			title: 'Gap dicatat',
			description: 'Pertanyaan yang belum terjawab menjadi bahan perbaikan knowledge.'
		}
	];
</script>

<WorkflowPlaceholderPage {title} {description} {steps} />
