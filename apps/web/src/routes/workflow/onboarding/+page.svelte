<script lang="ts">
	import WorkflowPlaceholderPage from '$lib/components/workflow/WorkflowPlaceholderPage.svelte';

	const title = 'Onboarding';
	const description =
		'Alur awal untuk menyiapkan profil bisnis, knowledge, dan kanal WhatsApp sebelum dipakai.';
	const steps = [
		{
			title: 'Isi profil bisnis',
			description: 'Owner melengkapi data brand, outlet, dan jam buka.'
		},
		{
			title: 'Upload knowledge',
			description: 'Menu, FAQ, promo, dan policy dimasukkan ke sistem.'
		},
		{
			title: 'Aktifkan workflow',
			description: 'Ningki siap membantu chat dengan batas approval yang jelas.'
		}
	];
</script>

<WorkflowPlaceholderPage {title} {description} {steps} />
