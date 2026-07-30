<script>
	import MetroOriginsMap from './MetroOriginsMap.svelte';
	import NorthAmericaOriginsMap from './NorthAmericaOriginsMap.svelte';
	import { makeRadiusScale } from '$lib/geo/proportionalScale.js';

	import metroToronto2km from '$data/origins/metro/toronto_2km.json';
	import metroTorontoCsd from '$data/origins/metro/toronto_csd.json';
	import metroVancouver2km from '$data/origins/metro/vancouver_2km.json';
	import metroVancouverCsd from '$data/origins/metro/vancouver_csd.json';

	import naToronto2km from '$data/origins/north_america/toronto_2km.json';
	import naTorontoCsd from '$data/origins/north_america/toronto_csd.json';
	import naVancouver2km from '$data/origins/north_america/vancouver_2km.json';
	import naVancouverCsd from '$data/origins/north_america/vancouver_csd.json';

	let { geo } = $props();

	const usaFeature = $derived(geo.usaNation.features[0]);

	const levels = [
		{ key: '2km', label: 'Within 2km of stadium & fan zone', metroToronto: metroToronto2km, metroVancouver: metroVancouver2km, naToronto: naToronto2km, naVancouver: naVancouver2km },
		{ key: 'csd', label: 'Across the whole city', metroToronto: metroTorontoCsd, metroVancouver: metroVancouverCsd, naToronto: naTorontoCsd, naVancouver: naVancouverCsd },
	];

	let levelKey = $state('2km');
	const level = $derived(levels.find((l) => l.key === levelKey));

	// One shared radius scale across all 4 maps at the current level, so symbol size is
	// comparable between metro/North-America maps and between cities.
	const radiusScale = $derived.by(() => {
		const allPcts = [...level.metroToronto, ...level.metroVancouver, ...level.naToronto, ...level.naVancouver].map((r) => r.pct);
		return makeRadiusScale(Math.max(...allPcts));
	});
</script>

<div class="origins-section">
	<div class="filter-bar" role="group" aria-label="Filter origins by geographic scope">
		{#each levels as l}
			<button class:active={levelKey === l.key} onclick={() => (levelKey = l.key)}>
				{l.label}
			</button>
		{/each}
	</div>

	<div class="origins-row">
		<MetroOriginsMap csdFC={geo.gthaCsd} {usaFeature} waterFC={geo.waterToronto} rows={level.metroToronto} cityLabel="Toronto & the GTHA" {radiusScale} />
		<NorthAmericaOriginsMap provincesFC={geo.provinces} {usaFeature} rows={level.naToronto} cityLabel="Toronto & North America" {radiusScale} />
	</div>
	<div class="origins-row">
		<MetroOriginsMap csdFC={geo.metroVancouverCsd} {usaFeature} waterFC={geo.waterVancouver} rows={level.metroVancouver} cityLabel="Vancouver & Metro Van" {radiusScale} />
		<NorthAmericaOriginsMap provincesFC={geo.provinces} {usaFeature} rows={level.naVancouver} cityLabel="Vancouver & North America" {radiusScale} />
	</div>

	<div class="origins-legend">
		<div class="legend-item">
			<span class="legend-swatch symbol"></span>
			<span class="legend-text"><span class="legend-label">Circle size</span> &mdash; average share of match-day visits coming from that area (larger = more visits)</span>
		</div>
		<div class="legend-item">
			<span class="legend-swatch province"></span>
			<span class="legend-text"><span class="legend-label">City, province &amp; country boundaries</span> &mdash; hover a circle for the exact share</span>
		</div>
		<div class="legend-item">
			<span class="legend-swatch quebec"></span>
			<span class="legend-text"><span class="legend-label">Quebec</span> &mdash; shown for context only, no origin data collected there yet</span>
		</div>
	</div>
</div>

<style>
	.origins-section {
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

	.origins-row {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 28px;
		margin-bottom: 28px;
	}

	.origins-legend {
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
		width: 16px;
		height: 16px;
		border-radius: 50%;
		flex-shrink: 0;
		margin-top: 2px;
	}
	.legend-swatch.symbol {
		background: rgba(227, 152, 28, 0.75);
		border: 1.5px solid var(--brandYellow);
	}
	.legend-swatch.province {
		/* Legend swatches need to read clearly on their own - shown more solid here than the
		   faint on-map fill (which is deliberately subtle so the ocean shows through it). */
		border-radius: 4px;
		background: #52827e;
		border: 1.5px solid var(--brandOrange);
	}
	.legend-swatch.quebec {
		border-radius: 4px;
		background: rgba(82, 130, 126, 0.55);
		border: 1.5px solid rgba(235, 160, 15, 0.6);
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
