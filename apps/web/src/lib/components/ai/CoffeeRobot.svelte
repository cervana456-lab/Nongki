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
	<defs>
		<!-- Gradients untuk efek 3D -->
		<linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
			<stop offset="0%" stop-color="var(--color-primary, #6B4F3A)" stop-opacity="0.9" />
			<stop offset="50%" stop-color="var(--color-primary, #6B4F3A)" />
			<stop offset="100%" stop-color="var(--color-primary-dark, #4A3428)" />
		</linearGradient>
		
		<linearGradient id="screenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
			<stop offset="0%" stop-color="var(--color-primary, #6B4F3A)" stop-opacity="0.08" />
			<stop offset="100%" stop-color="var(--color-primary, #6B4F3A)" stop-opacity="0.25" />
		</linearGradient>
		
		<linearGradient id="antennaGrad" x1="0%" y1="0%" x2="100%" y2="0%">
			<stop offset="0%" stop-color="var(--color-secondary, #D4A574)" />
			<stop offset="50%" stop-color="var(--color-secondary-light, #E8C9A0)" />
			<stop offset="100%" stop-color="var(--color-secondary, #D4A574)" />
		</linearGradient>
		
		<linearGradient id="notifGrad" x1="0%" y1="0%" x2="100%" y2="100%">
			<stop offset="0%" stop-color="var(--color-secondary, #D4A574)" />
			<stop offset="100%" stop-color="var(--color-accent, #E07A5F)" />
		</linearGradient>
		
		<filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
			<feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="var(--color-primary, #6B4F3A)" flood-opacity="0.2" />
		</filter>
		
		<filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
			<feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
			<feMerge>
				<feMergeNode in="coloredBlur"/>
				<feMergeNode in="SourceGraphic"/>
			</feMerge>
		</filter>
	</defs>

	<!-- Base shadow -->
	<ellipse cx="48" cy="90" rx="22" ry="4" fill="var(--color-primary, #6B4F3A)" opacity="0.15" />

	<!-- Antena kiri (3D style) -->
	<g filter="url(#shadow)">
		<path
			d="M35 19c-4-7 6-8 2-15"
			stroke="url(#antennaGrad)"
			stroke-width="5"
			stroke-linecap="round"
			class="text-secondary"
		/>
		<circle cx="37" cy="4" r="3" fill="var(--color-secondary, #D4A574)" opacity="0.6" />
		<circle cx="37" cy="4" r="1.5" fill="var(--color-background, #FFF8F0)" />
	</g>

	<!-- Antena kanan (3D style) -->
	<g filter="url(#shadow)">
		<path
			d="M52 18c-4-7 6-8 2-15"
			stroke="url(#antennaGrad)"
			stroke-width="5"
			stroke-linecap="round"
			class="text-secondary"
		/>
		<circle cx="54" cy="3" r="3" fill="var(--color-secondary, #D4A574)" opacity="0.6" />
		<circle cx="54" cy="3" r="1.5" fill="var(--color-background, #FFF8F0)" />
	</g>

	<!-- Badan robot (3D rounded dengan gradient) -->
	<g filter="url(#shadow)">
		<!-- Base body -->
		<path
			d="M19 34c0-6 5-11 11-11h36c6 0 11 5 11 11v26c0 13-10 23-23 23H42c-13 0-23-10-23-23V34Z"
			fill="url(#bodyGrad)"
			class="fill-background stroke-primary"
			stroke-width="5"
		/>
		<!-- Highlight untuk efek glossy -->
		<path
			d="M24 36c0-4 4-8 8-8h32c4 0 8 4 8 8v20c0 10-8 18-18 18H42c-10 0-18-8-18-18V36Z"
			fill="var(--color-background, #FFF8F0)"
			opacity="0.15"
		/>
	</g>

	<!-- Telinga kanan (3D style) -->
	<g filter="url(#shadow)">
		<path
			d="M77 39h4c8 0 12 5 12 12s-5 12-14 12h-3"
			stroke="var(--color-primary, #6B4F3A)"
			stroke-width="5"
			stroke-linecap="round"
			class="stroke-primary"
		/>
		<!-- Inner highlight -->
		<path
			d="M77 42h3c6 0 9 3 9 9s-4 9-11 9h-2"
			stroke="var(--color-background, #FFF8F0)"
			stroke-width="2"
			stroke-linecap="round"
			opacity="0.3"
		/>
	</g>

	<!-- Layar wajah (dengan efek glassmorphism) -->
	<g filter="url(#shadow)">
		<rect
			x="27"
			y="34"
			width="42"
			height="31"
			rx="13"
			fill="url(#screenGrad)"
			class="fill-primary/15 stroke-primary"
			stroke-width="4"
		/>
		<!-- Screen inner glow -->
		<rect
			x="29"
			y="36"
			width="38"
			height="27"
			rx="11"
			fill="none"
			stroke="var(--color-background, #FFF8F0)"
			stroke-width="1"
			opacity="0.2"
		/>
	</g>

	<!-- Mata kiri (3D eye) -->
	<g>
		<circle cx="39" cy="48" r="5" fill="var(--color-primary, #6B4F3A)" opacity="0.3" />
		<circle cx="39" cy="47" r="4" class="fill-primary" fill="var(--color-primary, #6B4F3A)" />
		<circle cx="40" cy="46" r="1.5" fill="var(--color-background, #FFF8F0)" opacity="0.8" />
	</g>

	<!-- Mata kanan (3D eye) -->
	<g>
		<circle cx="58" cy="48" r="5" fill="var(--color-primary, #6B4F3A)" opacity="0.3" />
		<circle cx="58" cy="47" r="4" class="fill-primary" fill="var(--color-primary, #6B4F3A)" />
		<circle cx="59" cy="46" r="1.5" fill="var(--color-background, #FFF8F0)" opacity="0.8" />
	</g>

	<!-- Senyum (3D style) -->
	<g filter="url(#shadow)">
		<path 
			d="M40 57c5 5 11 5 16 0" 
			class="stroke-accent" 
			stroke="var(--color-accent, #E07A5F)"
			stroke-width="4" 
			stroke-linecap="round" 
		/>
		<!-- Smile highlight -->
		<path 
			d="M41 58c4.5 4 9.5 4 14 0" 
			stroke="var(--color-background, #FFF8F0)" 
			stroke-width="1.5" 
			stroke-linecap="round" 
			opacity="0.4"
		/>
	</g>

	<!-- Biji kopi detail (menambah tema coffee) -->
	<g opacity="0.6">
		<ellipse cx="32" cy="72" rx="3" ry="4" fill="var(--color-primary, #6B4F3A)" transform="rotate(-20 32 72)" />
		<path d="M32 69v6" stroke="var(--color-background, #FFF8F0)" stroke-width="0.8" opacity="0.5" transform="rotate(-20 32 72)" />
	</g>
	<g opacity="0.5">
		<ellipse cx="65" cy="74" rx="2.5" ry="3.5" fill="var(--color-primary, #6B4F3A)" transform="rotate(15 65 74)" />
	</g>

	<!-- Uap kopi (animasi-ready dengan opacity) -->
	<g opacity="0.4" class="text-secondary">
		<path d="M45 30c-2-3 2-5 0-8" stroke="var(--color-secondary, #D4A574)" stroke-width="2" stroke-linecap="round" fill="none" />
		<path d="M50 28c-1.5-2.5 1.5-4 0-6.5" stroke="var(--color-secondary, #D4A574)" stroke-width="2" stroke-linecap="round" fill="none" />
	</g>

	<!-- Kaki (3D style) -->
	<g filter="url(#shadow)">
		<path 
			d="M34 84h28" 
			class="stroke-primary" 
			stroke="var(--color-primary, #6B4F3A)"
			stroke-width="5" 
			stroke-linecap="round" 
		/>
		<!-- Foot highlight -->
		<path 
			d="M36 83h24" 
			stroke="var(--color-background, #FFF8F0)" 
			stroke-width="2" 
			stroke-linecap="round" 
			opacity="0.3"
		/>
	</g>

	<!-- Notifikasi badge (3D glossy) -->
	<g filter="url(#glow)">
		<circle cx="73" cy="26" r="7" fill="url(#notifGrad)" class="fill-secondary stroke-background" stroke="var(--color-background, #FFF8F0)" stroke-width="3" />
		<!-- Badge highlight -->
		<circle cx="71" cy="24" r="2" fill="var(--color-background, #FFF8F0)" opacity="0.6" />
	</g>
</svg>