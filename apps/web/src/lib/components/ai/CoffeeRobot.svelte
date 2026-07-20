<script lang="ts">
	let { class: className = '' }: { class?: string } = $props();
</script>

<svg
	viewBox="0 0 96 96"
	class={className}
	role="img"
	aria-label="Robot kopi Ningki"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<path
		d="M35 19c-4-7 6-8 2-15M52 18c-4-7 6-8 2-15"
		stroke="currentColor"
		stroke-width="5"
		stroke-linecap="round"
		class="text-secondary"
	/>
	<path
		d="M19 34c0-6 5-11 11-11h36c6 0 11 5 11 11v26c0 13-10 23-23 23H42c-13 0-23-10-23-23V34Z"
		class="fill-background stroke-primary"
		stroke-width="5"
	/>
	<path
		d="M77 39h4c8 0 12 5 12 12s-5 12-14 12h-3"
		class="stroke-primary"
		stroke-width="5"
		stroke-linecap="round"
	/>
	<rect
		x="27"
		y="34"
		width="42"
		height="31"
		rx="13"
		class="fill-primary/15 stroke-primary"
		stroke-width="4"
	/>
	<circle cx="39" cy="48" r="4" class="fill-primary" />
	<circle cx="58" cy="48" r="4" class="fill-primary" />
	<path d="M40 57c5 5 11 5 16 0" class="stroke-accent" stroke-width="4" stroke-linecap="round" />
	<path d="M34 84h28" class="stroke-primary" stroke-width="5" stroke-linecap="round" />
	<circle cx="73" cy="26" r="7" class="fill-secondary stroke-background" stroke-width="3" />
</svg>
