<script>
	/** Total duration of one full pulse cycle (seconds) */
	let { duration = 2.5, icons = [] } = $props();

	const stagger = $derived(duration / icons.length);
</script>

<div class="icon-row">
	{#each icons as icon, i}
		<div
			class="icon-circle"
			style="animation-duration: {duration}s; animation-delay: {i * stagger}s;"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 -960 960 960"
				aria-label={icon.label}
				role="img"
				style="animation-duration: {duration}s; animation-delay: {i * stagger}s;"
			>
				<path d={icon.path} />
			</svg>
		</div>
	{/each}
</div>

<style>
	.icon-row {
		display: flex;
		gap: clamp(8px, 2vw, 16px);
		flex-wrap: nowrap;
		width: 100%;
	}

	@keyframes circle-pulse {
		0%, 100% { background-color: var(--brandDarkBlue); }
		50%       { background-color: var(--brandMedBlue); }
	}

	@keyframes svg-pulse {
		0%, 100% { fill: var(--brandLightGreen); }
		50%       { fill: var(--brandWhite); }
	}

	.icon-circle {
		width: clamp(44px, 10vw, 70px);
		height: clamp(44px, 10vw, 70px);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 1;
		background-color: var(--brandDarkBlue);
		animation: circle-pulse ease-in-out infinite;
	}

	.icon-circle svg {
		width: 36px;
		height: 36px;
		fill: var(--brandLightGreen);
		animation: svg-pulse ease-in-out infinite;
	}
</style>
