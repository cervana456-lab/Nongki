<script lang="ts">
	import { Calendar as CalendarPrimitive } from 'bits-ui';
	import { cn, type WithoutChildrenOrChild } from '$lib/utils.js';
	import CaretDownIcon from 'phosphor-svelte/lib/CaretDown';

	let {
		ref = $bindable(null),
		class: className,
		value,
		onchange,
		...restProps
	}: WithoutChildrenOrChild<CalendarPrimitive.MonthSelectProps> = $props();
</script>

<span
	class={cn(
		'relative flex rounded-xl border-2 border-input bg-background shadow-[0_2px_0_0_var(--shadow-3d)] has-focus:border-primary has-focus:ring-2 has-focus:ring-primary/20',
		className
	)}
>
	<CalendarPrimitive.MonthSelect
		bind:ref
		class="absolute inset-0 bg-background opacity-0 dark:bg-popover dark:text-popover-foreground"
		{...restProps}
	>
		{#snippet child({ props, monthItems, selectedMonthItem })}
			<select {...props} {value} {onchange}>
				{#each monthItems as monthItem (monthItem.value)}
					<option
						value={monthItem.value}
						selected={value !== undefined
							? monthItem.value === value
							: monthItem.value === selectedMonthItem.value}
					>
						{monthItem.label}
					</option>
				{/each}
			</select>
			<span
				class="flex h-(--cell-size) items-center gap-1 rounded-xl ps-3 pe-2 text-sm font-bold select-none [&>svg]:size-3.5 [&>svg]:text-muted-foreground"
				aria-hidden="true"
			>
				{monthItems.find((item) => item.value === value)?.label || selectedMonthItem.label}
				<CaretDownIcon class={cn('size-4', className)} />
			</span>
		{/snippet}
	</CalendarPrimitive.MonthSelect>
</span>
