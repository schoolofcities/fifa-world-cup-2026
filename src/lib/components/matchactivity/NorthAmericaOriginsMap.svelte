<script>
	import { fitProjection, bboxFeature } from '$lib/geo/projection.js';
	import { displayLonLat } from '$lib/geo/proportionalScale.js';

	let { provincesFC, usaFeature, rows, cityLabel, radiusScale } = $props();

	const W = 380;
	const H = 380;

	// Crops the visible frame to southern/central Canada plus a sliver of the northern US -
	// deliberately narrower than the real data extent (which reaches deep into the US and
	// close to the pole for the northern territories); see proportionalScale.js's
	// NORTH_AMERICA_DISPLAY_OVERRIDES for the handful of points nudged back into this frame.
	const CROP_BBOX = [-141, 41, -52, 68];

	function displayName(region) {
		return region === 'US' ? 'United States' : region;
	}

	const geo = $derived.by(() => {
		const { projection, path } = fitProjection({
			type: 'mercator',
			fitTo: bboxFeature(CROP_BBOX),
			width: W,
			height: H,
			padding: 0,
		});
		// Quebec is drawn separately (dimmed) - no origin data is collected there yet, so it
		// shouldn't read as an equal, hoverable-feeling region alongside the rest.
		const provincePaths = provincesFC.features.filter((f) => f.properties.PRENAME !== 'Quebec').map((f) => path(f));
		const quebecPath = provincesFC.features.filter((f) => f.properties.PRENAME === 'Quebec').map((f) => path(f))[0];
		const usaPath = path(usaFeature);
		const points = rows.map((r) => {
			const [lon, lat] = displayLonLat(r);
			const [x, y] = projection([lon, lat]);
			return { ...r, x, y, r: radiusScale(r.pct) };
		});
		points.sort((a, b) => b.r - a.r);
		return { provincePaths, quebecPath, usaPath, points };
	});

	let hoverIdx = $state(null);
	let wrapEl = $state(null);
	let tooltipPos = $state({ left: 0, top: 0 });

	function onEnter(i, evt) {
		hoverIdx = i;
		if (!wrapEl) return;
		const rect = wrapEl.getBoundingClientRect();
		tooltipPos = { left: evt.clientX - rect.left + 10, top: evt.clientY - rect.top + 10 };
	}
	function onLeave() {
		hoverIdx = null;
	}

	const hoverPoint = $derived(hoverIdx === null ? null : geo.points[hoverIdx]);
</script>

<div class="na-map">
	<p class="map-title">{cityLabel}</p>
	<div class="map-frame" bind:this={wrapEl}>
		<svg viewBox="0 0 {W} {H}" style="overflow: hidden">
			<rect class="water" x="0" y="0" width={W} height={H} />
			{#each geo.provincePaths as d}
				<path class="province" {d} />
			{/each}
			<path class="usa" d={geo.usaPath} />
			<path class="quebec" d={geo.quebecPath} role="presentation" />
			{#each geo.points as p, i}
				<circle
					class="symbol"
					class:hovered={hoverIdx === i}
					cx={p.x.toFixed(2)}
					cy={p.y.toFixed(2)}
					r={p.r.toFixed(2)}
					onmouseenter={(e) => onEnter(i, e)}
					onmouseleave={onLeave}
					role="presentation"
				/>
			{/each}
		</svg>

		{#if hoverPoint}
			<div class="tooltip" style="left: {tooltipPos.left}px; top: {tooltipPos.top}px;">
				<div class="t-region">{displayName(hoverPoint.region)}</div>
				<div class="t-pct">{hoverPoint.pct.toFixed(hoverPoint.pct < 1 ? 2 : 1)}% of visits</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.na-map {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.map-title {
		font-family: TradeGothicBold, sans-serif;
		font-weight: normal;
		font-size: 19px;
		color: var(--brandWhite);
		margin: 0;
		padding: 0;
	}
	.map-frame {
		position: relative;
		border-radius: 10px;
		overflow: hidden;
		box-shadow: 0 4px 16px rgba(30, 55, 101, 0.12), 0 1px 4px rgba(30, 55, 101, 0.08);
	}
	svg {
		display: block;
		width: 100%;
		height: auto;
	}
	.water {
		fill: #75a3bb;
	}
	.usa {
		/* Faint fill (not solid land color) so the surrounding ocean blue stays visible through
		   it, same idea as the metro maps' CSD outlines. */
		fill: rgba(82, 130, 126, 0.35);
		stroke: rgba(235, 160, 15, 0.6);
		stroke-width: 0.75;
	}
	.province {
		fill: rgba(82, 130, 126, 0.35);
		stroke: var(--brandOrange);
		stroke-width: 1;
	}
	.quebec {
		/* No origin data for Quebec yet - blended in rather than styled as a normal, hoverable
		   province (pointer-events off, no tooltip wired up; a methods note explains why). */
		fill: rgba(82, 130, 126, 0.16);
		stroke: rgba(235, 160, 15, 0.4);
		stroke-width: 1;
		pointer-events: none;
	}
	.symbol {
		fill: rgba(227, 152, 28, 0.75);
		stroke: var(--brandYellow);
		stroke-width: 1.25;
		cursor: pointer;
		transition: fill 0.1s;
	}
	.symbol.hovered {
		fill: rgba(241, 197, 0, 0.9);
		stroke: var(--brandYellow);
	}
	.tooltip {
		position: absolute;
		pointer-events: none;
		background: var(--brandDarkBlue);
		border-radius: 8px;
		padding: 7px 11px;
		font-family: OpenSans, sans-serif;
		font-size: 13px;
		color: var(--brandWhite);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
		white-space: nowrap;
		z-index: 10;
	}
	.t-region {
		font-family: OpenSansBold, sans-serif;
		margin-bottom: 2px;
	}
	.t-pct {
		color: rgba(255, 255, 255, 0.8);
	}
</style>
