<script>
	import ActivityChart from './ActivityChart.svelte';

	import torontoTwoKm from '$data/activity/toronto_2km.json';
	import torontoCsd from '$data/activity/toronto_csd.json';
	import vancouverTwoKm from '$data/activity/vancouver_2km.json';
	import vancouverCsd from '$data/activity/vancouver_csd.json';

	const levels = [
		{
			key: '2km',
			label: 'Within 2km of stadium & fan zone',
			levelLabel: 'Within 2km of the stadium & fan zone',
			toronto: torontoTwoKm,
			vancouver: vancouverTwoKm,
		},
		{
			key: 'csd',
			label: 'Across the whole city',
			levelLabel: 'Across the whole city (census subdivision)',
			toronto: torontoCsd,
			vancouver: vancouverCsd,
		},
	];

	let levelKey = $state('2km');
	const level = $derived(levels.find((l) => l.key === levelKey));
</script>

<div class="activity-section">
	<div class="filter-bar" role="group" aria-label="Filter activity by geographic scope">
		{#each levels as l}
			<button class:active={levelKey === l.key} onclick={() => (levelKey = l.key)}>
				{l.label}
			</button>
		{/each}
	</div>

	<div class="grid">
		<ActivityChart rows={level.toronto} cityLabel="Toronto" levelLabel={level.levelLabel} />
		<ActivityChart rows={level.vancouver} cityLabel="Vancouver" levelLabel={level.levelLabel} />
	</div>
</div>

<style>
	.activity-section {
		--surface-1: var(--brandDarkGreen);
		--text-primary: var(--brandWhite);
		--text-secondary: rgba(255, 255, 255, 0.75);
		--text-muted: rgba(255, 255, 255, 0.55);
		--grid: rgba(255, 255, 255, 0.12);
		--axis: rgba(255, 255, 255, 0.28);
		--series-main: #ff6a1a;
		--series-pre2026: var(--brandLightBlue);
		--series-2025: rgba(255, 255, 255, 0.55);
		--matchday-line: rgba(255, 255, 255, 0.4);
		max-width: 1000px;
		margin: 0 auto;
		padding: 0 24px;
	}

	.filter-bar {
		display: flex;
		flex-wrap: wrap;
		gap: 2px;
		background: var(--brandDarkGreen);
		border-radius: 6px;
		padding: 3px;
		margin-bottom: 24px;
		width: fit-content;
	}

	.filter-bar button {
		background: transparent;
		border: none;
		padding: 8px 16px;
		font-family: OpenSans, sans-serif;
		font-size: 14px;
		color: var(--brandLightGreen);
		cursor: pointer;
		border-radius: 4px;
		transition: background-color 0.12s, color 0.12s;
		white-space: nowrap;
	}

	.filter-bar button:hover {
		background-color: rgba(141, 191, 46, 0.15);
		color: var(--brandWhite);
	}

	.filter-bar button.active {
		background-color: var(--brandLightGreen);
		color: var(--brandDarkBlue);
		font-family: OpenSansBold, sans-serif;
	}

	.grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 24px;
	}

	@media screen and (max-width: 700px) {
		.filter-bar {
			flex-direction: column;
			width: 100%;
		}
		.filter-bar button {
			width: 100%;
			text-align: left;
		}
	}
</style>
