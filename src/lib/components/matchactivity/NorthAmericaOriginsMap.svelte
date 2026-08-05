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

	const REGION_LABELS = {
		US: 'U.S.A.',
		'Toronto Hamilton CMA': 'Greater Toronto and Hamilton Area',
		'Vancouver CMA': 'Metro Vancouver',
		'Ontario - GTHA': 'Rest of Ontario',
		'BC - Metro Van': 'Rest of BC',
	};

	function displayName(region) {
		return REGION_LABELS[region] ?? region;
	}

	const geo = $derived.by(() => {
		const { projection, path } = fitProjection({
			type: 'mercator',
			fitTo: bboxFeature(CROP_BBOX),
			width: W,
			height: H,
			padding: 0,
		});
		// Same two-layer approach as the metro maps: a solid land base covering every
		// province/territory + the US (so shared borders never show a seam of background water
		// peeking through), then a highlighted overlay on top for every unit *except* Quebec -
		// no origin data is collected there yet, so it reads as plain land instead of an equal,
		// hoverable-feeling region alongside the rest.
		const landPaths = [...provincesFC.features, usaFeature].map((f) => path(f));
		const highlightPaths = [...provincesFC.features.filter((f) => f.properties.PRENAME !== 'Quebec'), usaFeature].map((f) => path(f));
		// No origin data is collected in Quebec - some data levels still include a Quebec row
		// (typically at 0%) that should never render as a hoverable circle on the map.
		const points = rows
			.filter((r) => r.region !== 'Quebec')
			.map((r) => {
				const [lon, lat] = displayLonLat(r);
				const [x, y] = projection([lon, lat]);
				return { ...r, x, y, r: radiusScale(r.pct) };
			});
		points.sort((a, b) => b.r - a.r);
		return { landPaths, highlightPaths, points };
	});

	let hoverIdx = $state(null);
	let wrapEl = $state(null);
	let tooltipEl = $state(null);
	let cursorPos = $state({ x: 0, y: 0 });
	let tooltipPos = $state({ left: 0, top: 0 });

	function onEnter(i, evt) {
		hoverIdx = i;
		cursorPos = { x: evt.clientX, y: evt.clientY };
	}
	function onLeave() {
		hoverIdx = null;
	}

	// Keeps the tooltip inside the map frame - flips to the opposite side of the cursor whenever
	// the default (bottom-right) placement would run off the edge of the frame itself. The frame
	// clips with overflow:hidden, so what matters is the frame's own bounds, not the viewport -
	// a circle near the frame's bottom-right can still be well inside the browser window. Reruns
	// whenever tooltipEl is (re)bound, i.e. right after the tooltip mounts, so it can measure its
	// real size.
	$effect(() => {
		if (hoverIdx === null || !wrapEl) return;
		const rect = wrapEl.getBoundingClientRect();
		const tw = tooltipEl?.offsetWidth ?? 0;
		const th = tooltipEl?.offsetHeight ?? 0;
		const OFFSET = 12;
		const cx = cursorPos.x - rect.left;
		const cy = cursorPos.y - rect.top;
		let left = cx + OFFSET;
		let top = cy + OFFSET;
		if (cx + tw + OFFSET > rect.width) left = cx - tw - OFFSET;
		if (cy + th + OFFSET > rect.height) top = cy - th - OFFSET;
		tooltipPos = { left, top };
	});

	// Tap-to-show/tap-elsewhere-to-dismiss for touch devices, without breaking desktop
	// hover/click: a tap on a circle stops propagation and shows its tooltip; any other tap
	// (elsewhere on this map, or anywhere else on the page) dismisses it.
	$effect(() => {
		function handleWindowClick(e) {
			if (wrapEl && !wrapEl.contains(e.target)) hoverIdx = null;
		}
		window.addEventListener('click', handleWindowClick);
		return () => window.removeEventListener('click', handleWindowClick);
	});

	const hoverPoint = $derived(hoverIdx === null ? null : geo.points[hoverIdx]);
</script>

<div class="na-map">
	<p class="map-title">{cityLabel}</p>
	<div class="map-frame" bind:this={wrapEl} onclick={() => (hoverIdx = null)} role="presentation">
		<svg viewBox="0 0 {W} {H}" style="overflow: hidden">
			<rect class="water" x="0" y="0" width={W} height={H} />
			{#each geo.landPaths as d}
				<path class="land" {d} />
			{/each}
			{#each geo.highlightPaths as d}
				<path class="highlight" {d} />
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
					onclick={(e) => { e.stopPropagation(); onEnter(i, e); }}
					role="presentation"
				/>
			{/each}
		</svg>

		{#if hoverPoint}
			<div class="tooltip" bind:this={tooltipEl} style="left: {tooltipPos.left}px; top: {tooltipPos.top}px;">
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
		font-size: 22px;
		color: var(--brandWhite);
		margin: 0;
		padding: 0;
		text-align: center;
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
	.land {
		/* Solid base covering every province/territory + the US, same idea as the metro maps'
		   solid land rect - guarantees no seam of background water shows through between
		   adjacent provinces, regardless of how closely their simplified borders line up. */
		fill: #52827e;
		stroke: none;
	}
	.highlight {
		/* Drawn on top of .land for every unit except Quebec - same coloring effect as the CSD
		   outlines on the metro maps (a light tint + a clear border), not a flat fill. */
		fill: rgba(235, 160, 15, 0.25);
		stroke: var(--brandOrange);
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
