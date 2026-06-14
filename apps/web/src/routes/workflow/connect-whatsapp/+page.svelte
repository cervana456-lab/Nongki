<script lang="ts">
	import WorkflowPlaceholderPage from '$lib/components/workflow/WorkflowPlaceholderPage.svelte';

	const title = 'Connect WhatsApp';
	const description =
		'Hubungkan nomor WhatsApp bisnis agar chat pelanggan bisa masuk ke workflow Nongki.';
	const steps = [
		{ title: 'Pilih nomor bisnis', description: 'Owner memilih nomor WhatsApp yang akan dipakai.' },
		{ title: 'Validasi koneksi', description: 'Sistem memastikan kanal siap menerima chat.' },
		{ title: 'Mulai tangkap chat', description: 'Percakapan baru bisa diproses menjadi data CRM.' }
	];
</script>

<WorkflowPlaceholderPage {title} {description} {steps} />
