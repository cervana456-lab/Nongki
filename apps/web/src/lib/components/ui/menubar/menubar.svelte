<script lang="ts">
	import { Menubar as MenubarPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: MenubarPrimitive.RootProps = $props();
</script>

<MenubarPrimitive.Root
	bind:ref
	data-slot="menubar"
	class={cn(
		'flex h-11 items-center gap-1 rounded-2xl border-2 p-1.5 shadow-[0_3px_0_0_var(--shadow-3d)]',
		className
	)}
	{...restProps}
/>
