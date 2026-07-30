<script>
	import { fitProjection } from '$lib/geo/projection.js';

	let { csdFC, usaFeature, waterFC, rows, cityLabel, radiusScale } = $props();

	const W = 380;
	const H = 380;

	const geo = $derived.by(() => {
		// Zoom/extent stays fixed to the CSD collection, exactly as before - the province/USA/
		// water layers are drawn for context only, using this same projection, so they show only
		// as much of themselves as happens to fall within that (unchanged) frame.
		const { projection, path } = fitProjection({
			type: 'mercator',
			fitTo: csdFC,
			width: W,
			height: H,
			padding: W * 0.06,
		});
		const csdPaths = csdFC.features.map((f) => path(f));
		const usaPath = path(usaFeature);
		const waterPaths = waterFC.features.map((f) => path(f));
		const points = rows.map((r) => {
			const [x, y] = projection([r.lon, r.lat]);
			return { ...r, x, y, r: radiusScale(r.pct) };
		});
		// draw smaller symbols last so they aren't hidden under larger overlapping ones
		points.sort((a, b) => b.r - a.r);
		return { csdPaths, usaPath, waterPaths, points };
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

<div class="metro-map">
	<p class="map-title">{cityLabel}</p>
	<div class="map-frame" bind:this={wrapEl}>
		<svg viewBox="0 0 {W} {H}" style="overflow: hidden">
			<rect class="land" x="0" y="0" width={W} height={H} />
			<path class="usa-border" d={geo.usaPath} />
			{#each geo.waterPaths as d}
				<path class="water" {d} />
			{/each}
			{#each geo.csdPaths as d}
				<path class="csd-border" {d} />
			{/each}
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
				<div class="t-region">{hoverPoint.region}</div>
				<div class="t-pct">{hoverPoint.pct.toFixed(hoverPoint.pct < 1 ? 2 : 1)}% of visits</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.metro-map {
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
	.land {
		fill: #52827e;
	}
	.usa-border {
		fill: none;
		stroke: var(--brandOrange);
		stroke-width: 1.75;
	}
	.water {
		fill: #75a3bb;
	}
	.csd-border {
		fill: rgba(141, 191, 46, 0.16);
		stroke: rgba(141, 191, 46, 0.55);
		stroke-width: 1;
	}
	.symbol {
		fill: rgba(227, 152, 28, 0.75);
		stroke: var(--brandYellow);
		stroke-width: 1.25;
		cursor: pointer;
		transition: fill 0.1s;
	}
	.symbol.hovered {
		fill: rgba(241, 197, 0, 0.85);
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
