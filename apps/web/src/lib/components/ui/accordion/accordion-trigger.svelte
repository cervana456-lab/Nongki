<script lang="ts">
	import { Accordion as AccordionPrimitive } from 'bits-ui';
	import { cn, type WithoutChild } from '$lib/utils.js';
	import CaretDownIcon from 'phosphor-svelte/lib/CaretDown';
	import CaretUpIcon from 'phosphor-svelte/lib/CaretUp';

	let {
		ref = $bindable(null),
		class: className,
		level = 3,
		children,
		...restProps
	}: WithoutChild<AccordionPrimitive.TriggerProps> & {
		level?: AccordionPrimitive.HeaderProps['level'];
	} = $props();
</script>

<AccordionPrimitive.Header {level} class="flex">
	<AccordionPrimitive.Trigger
		data-slot="accordion-trigger"
		bind:ref
		class={cn(
			'group/accordion-trigger relative flex flex-1 items-start justify-between rounded-xl border border-transparent px-3 py-3 text-left text-xs font-bold transition-all outline-none hover:bg-muted focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50 focus-visible:after:border-ring active:translate-y-px disabled:pointer-events-none disabled:opacity-50 **:data-[slot=accordion-trigger-icon]:ml-auto **:data-[slot=accordion-trigger-icon]:size-4 **:data-[slot=accordion-trigger-icon]:text-muted-foreground',
			className
		)}
		{...restProps}
	>
		{@render children?.()}
		<CaretDownIcon
			data-slot="accordion-trigger-icon"
			class="cn-accordion-trigger-icon pointer-events-none shrink-0 group-aria-expanded/accordion-trigger:hidden"
		/>
		<CaretUpIcon
			data-slot="accordion-trigger-icon"
			class="cn-accordion-trigger-icon pointer-events-none hidden shrink-0 group-aria-expanded/accordion-trigger:inline"
		/>
	</AccordionPrimitive.Trigger>
</AccordionPrimitive.Header>
