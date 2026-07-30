<script>
	import ZonesMap from './ZonesMap.svelte';

	let { geo } = $props();

	const ontario = geo.provinces.features.find((f) => f.properties.PRENAME === 'Ontario');
	const britishColumbia = geo.provinces.features.find((f) => f.properties.PRENAME === 'British Columbia');

	const legend = [
		{ cls: 'zone-2km', label: 'Within 2km of the stadium & fan zone', desc: 'the area we measured activity in for the closer, event-driven view' },
		{ cls: 'csd', label: 'City boundary (CSD)', desc: 'the full city, for comparison against the immediate stadium area' },
		{ cls: 'province', label: 'Rest of the province', desc: 'the broader region surrounding each city' },
		{ cls: 'water', label: 'Lakes & ocean', desc: '' },
	];
</script>

<div class="zones-section">
	<div class="zones-grid">
		<ZonesMap cityLabel="Toronto" province={ontario} csd={geo.torontoCsd.features[0]} zone2km={geo.torontoZone.features[0]} />
		<ZonesMap cityLabel="Vancouver" province={britishColumbia} csd={geo.vancouverCsd.features[0]} zone2km={geo.vancouverZone.features[0]} />
	</div>

	<div class="zones-legend">
		{#each legend as l}
			<div class="legend-item">
				<span class="legend-swatch {l.cls}"></span>
				<span class="legend-text">
					<span class="legend-label">{l.label}</span>
					{#if l.desc}<span class="legend-desc"> &mdash; {l.desc}</span>{/if}
				</span>
			</div>
		{/each}
	</div>
</div>

<style>
	.zones-section {
		--zone-water: var(--brandLightBlue);
		--zone-province-fill: rgba(141, 191, 46, 0.4);
		--zone-province-stroke: rgba(141, 191, 46, 0.7);
		--zone-csd-fill: rgba(241, 197, 0, 0.35);
		--zone-csd-stroke: rgba(241, 197, 0, 0.85);
		--zone-2km-fill: rgba(235, 160, 15, 0.8);
		--zone-2km-stroke: var(--brandOrange);
		max-width: 1000px;
		margin: 0 auto;
		padding: 0 24px;
	}

	.zones-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 28px;
		margin-bottom: 24px;
	}

	.zones-legend {
		display: flex;
		flex-direction: column;
		gap: 8px;
		background: var(--brandDarkGreen);
		border-radius: 10px;
		padding: 18px 22px;
	}

	.legend-item {
		display: flex;
		align-items: flex-start;
		gap: 10px;
	}

	.legend-swatch {
		width: 18px;
		height: 18px;
		border-radius: 4px;
		flex-shrink: 0;
		margin-top: 2px;
	}

	.legend-swatch.zone-2km {
		background: var(--zone-2km-fill);
		border: 1.5px solid var(--zone-2km-stroke);
	}
	.legend-swatch.csd {
		background: var(--zone-csd-fill);
		border: 1.5px solid var(--zone-csd-stroke);
	}
	.legend-swatch.province {
		background: var(--zone-province-fill);
		border: 1.5px solid var(--zone-province-stroke);
	}
	.legend-swatch.water {
		background: var(--zone-water);
	}

	.legend-text {
		font-family: OpenSans, sans-serif;
		font-size: 13px;
		line-height: 1.5;
		color: rgba(255, 255, 255, 0.85);
	}

	.legend-label {
		font-family: OpenSansBold, sans-serif;
		color: var(--brandWhite);
	}

	.legend-desc {
		color: rgba(255, 255, 255, 0.7);
	}

	@media screen and (max-width: 480px) {
		.zones-legend {
			padding: 16px 18px;
		}
	}
</style>
