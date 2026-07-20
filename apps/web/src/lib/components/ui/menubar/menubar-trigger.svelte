<script lang="ts">
	import { Menubar as MenubarPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: MenubarPrimitive.TriggerProps = $props();
</script>

<MenubarPrimitive.Trigger
	bind:ref
	data-slot="menubar-trigger"
	class={cn(
		'flex items-center rounded-xl px-3 py-1.5 text-xs font-bold outline-hidden select-none hover:bg-muted aria-expanded:bg-muted aria-expanded:text-foreground',
		className
	)}
	{...restProps}
/>
