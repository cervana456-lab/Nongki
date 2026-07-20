<script lang="ts">
	import { cn, type WithElementRef } from '$lib/utils.js';
	import type { HTMLSelectAttributes } from 'svelte/elements';
	import CaretDownIcon from 'phosphor-svelte/lib/CaretDown';

	type NativeSelectProps = Omit<WithElementRef<HTMLSelectAttributes>, 'size'> & {
		size?: 'sm' | 'default';
	};

	let {
		ref = $bindable(null),
		value = $bindable(),
		class: className,
		size = 'default',
		children,
		...restProps
	}: NativeSelectProps = $props();
</script>

<div
	class={cn(
		'cn-native-select-wrapper group/native-select relative w-fit has-[select:disabled]:opacity-50',
		className
	)}
	data-slot="native-select-wrapper"
	data-size={size}
>
	<select
		bind:value
		bind:this={ref}
		data-slot="native-select"
		data-size={size}
		class="h-11 w-full min-w-0 appearance-none rounded-xl border-2 border-input bg-background py-1 pr-9 pl-4 text-sm font-medium shadow-[0_3px_0_0_var(--shadow-3d)] transition-all duration-150 outline-none select-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 disabled:pointer-events-none disabled:cursor-not-allowed aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 data-[size=sm]:h-9 data-[size=sm]:rounded-lg data-[size=sm]:py-0.5 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40"
		{...restProps}
	>
		{@render children?.()}
	</select>
	<CaretDownIcon
		class="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-muted-foreground select-none"
		aria-hidden
		data-slot="native-select-icon"
	/>
</div>
