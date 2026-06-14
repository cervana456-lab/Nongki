<script lang="ts">
	import WorkflowPlaceholderPage from '$lib/components/workflow/WorkflowPlaceholderPage.svelte';

	const title = 'Customer Chat';
	const description =
		'Alur utama saat pelanggan mulai chat, AI membantu menjawab, dan data customer terbentuk.';
	const steps = [
		{ title: 'Chat masuk', description: 'Customer bertanya lewat WhatsApp bisnis.' },
		{
			title: 'AI reply dan handoff',
			description: 'AI menjawab dari knowledge atau menyerahkan ke admin.'
		},
		{
			title: 'Customer 360 update',
			description: 'Minat, histori, dan status lead diperbarui otomatis.'
		}
	];
</script>

<WorkflowPlaceholderPage {title} {description} {steps} />
