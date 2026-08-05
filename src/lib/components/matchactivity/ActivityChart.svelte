<script>
	import { buildActivityChart, W, H, MARGIN, PLOT_H } from '$lib/matchactivity/activityChartGeometry.js';
	import { ballPath } from '$lib/icons.js';

	let { rows, cityLabel, levelLabel } = $props();

	const chart = $derived(buildActivityChart(rows));

	function fmtDate(iso, opts) {
		return new Date(iso + 'T12:00:00').toLocaleDateString('en-US', opts);
	}

	function fmtPct(v) {
		if (v === null || v === undefined) return '—';
		return `${v >= 0 ? '+' : ''}${v.toFixed(1)}%`;
	}

	let hoverIdx = $state(null);
	let svgEl = $state(null);
	let tooltipEl = $state(null);
	let tooltipLeft = $state(0);

	const hoverRow = $derived(hoverIdx === null ? null : chart.rows[hoverIdx]);

	function positionTooltip(i) {
		if (!svgEl) return;
		const svgRect = svgEl.getBoundingClientRect();
		const scale = svgRect.width / W;
		const px = chart.x(i) * scale;
		const tooltipWidth = tooltipEl?.offsetWidth ?? 200;
		tooltipLeft = Math.min(px + 10, Math.max(0, svgRect.width - tooltipWidth - 4));
	}

	function onEnter(i) {
		hoverIdx = i;
		positionTooltip(i);
	}

	function onLeave() {
		hoverIdx = null;
	}

	$effect(() => {
		if (hoverIdx !== null && tooltipEl) positionTooltip(hoverIdx);
	});
</script>

<div class="card">
	<div class="card-header">
		<div>
			<p class="card-title">{cityLabel}</p>
			<p class="card-sub">{levelLabel}</p>
		</div>
		<div class="legend">
			<span class="legend-item">
				<span class="swatch solid"></span>
				FIFA World Cup 2026
			</span>
			<span class="legend-item">
				<span class="swatch dashed"></span>
				Pre-tournament baseline
			</span>
			<span class="legend-item">
				<span class="swatch dotted"></span>
				Same period, 2025
			</span>
			<span class="legend-item">
				<span class="swatch matchday"></span>
				<svg class="legend-ball-icon" viewBox="0 -960 960 960" aria-hidden="true"><path d={ballPath} /></svg>
				Match day
			</span>
		</div>
	</div>
	<div class="chart-wrap">
		<svg viewBox="0 0 {W} {H}" bind:this={svgEl}>
			{#each chart.matchDayIdxs as mi, mIdx}
				<line
					class="matchday-line"
					x1={chart.x(mi).toFixed(2)}
					x2={chart.x(mi).toFixed(2)}
					y1={MARGIN.top}
					y2={MARGIN.top + PLOT_H}
				/>
				{#if mIdx === 0}
					<g class="matchday-label" transform="translate({chart.x(mi).toFixed(2)}, {MARGIN.top + 4})">
						<path class="ball-icon" transform="scale(0.017) translate(6, 950)" d={ballPath} />
						<text class="matchday-label-text" x="17" y="11">Match day</text>
					</g>
				{/if}
			{/each}

			<line class="axis-line" x1={MARGIN.left} x2={W - MARGIN.right} y1={MARGIN.top + PLOT_H} y2={MARGIN.top + PLOT_H} />
			{#each chart.xTickIdxs as i}
				<text class="tick-label" x={chart.x(i).toFixed(2)} y={MARGIN.top + PLOT_H + 20} text-anchor="middle">
					{fmtDate(chart.rows[i].dateMain2026, { month: 'short', day: 'numeric' })}
				</text>
			{/each}

			{#each chart.fills as f}
				<path class={f.cls} d={f.d} />
			{/each}

			<path class="line-2025" d={chart.path2025} />
			<path class="line-pre2026" d={chart.pathPre2026} />
			<path class="line-main" d={chart.pathMain} />

			{#each chart.rows as r, i}
				<rect
					class="hover-target"
					x={(chart.x(i) - chart.bandW / 2).toFixed(2)}
					y={MARGIN.top}
					width={chart.bandW.toFixed(2)}
					height={PLOT_H}
					onmouseenter={() => onEnter(i)}
					onmouseleave={onLeave}
					role="presentation"
				/>
			{/each}

			{#if hoverIdx !== null}
				<rect
					class="crosshair"
					x={(chart.x(hoverIdx) - chart.bandW / 2).toFixed(2)}
					y={MARGIN.top}
					width={chart.bandW.toFixed(2)}
					height={PLOT_H}
					pointer-events="none"
				/>
			{/if}
		</svg>

		{#if hoverRow}
			<div class="tooltip" bind:this={tooltipEl} style="opacity: 1; left: {tooltipLeft}px; top: 10px;">
				<div class="t-row t-main">
					<span class="t-swatch" style="background:var(--series-main)"></span>
					{fmtDate(hoverRow.dateMain2026, { weekday: 'long', month: 'long', day: 'numeric' })}
					{#if hoverRow.isMatchDay}<span class="t-matchday">&middot; Match day</span>{/if}
				</div>
				<div class="t-row">
					<span class="t-swatch" style="background:var(--series-pre2026)"></span>
					Approx. 5 weeks before ({fmtDate(hoverRow.datePre2026, { month: 'short', day: 'numeric' })}): {fmtPct(hoverRow.pctVsPre2026)}
				</div>
				<div class="t-row">
					<span class="t-swatch" style="background:var(--series-2025)"></span>
					1 year before ({fmtDate(hoverRow.date2025, { month: 'short', day: 'numeric' })}): {fmtPct(hoverRow.pctVs2025)}
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.card {
		background: var(--surface-1);
		border-radius: 12px;
		padding: 24px 24px 14px;
		border: 1px solid var(--grid);
		min-width: 0;
		overflow: hidden;
	}
	.card-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 12px;
		margin-bottom: 16px;
		min-width: 0;
	}
	.card-title {
		font-family: TradeGothicBold, sans-serif;
		font-size: 28px;
		font-weight: normal;
		margin: 0 0 4px;
		color: var(--text-primary);
	}
	.card-sub {
		font-family: OpenSansBold, sans-serif;
		font-size: 15px;
		color: var(--text-secondary);
		margin: 0;
	}
	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 6px 16px;
		justify-content: flex-end;
		padding-top: 6px;
		max-width: 340px;
	}
	.legend-item {
		display: flex;
		align-items: center;
		gap: 6px;
		font-family: OpenSans, sans-serif;
		font-size: 15px;
		font-weight: 300;
		color: var(--text-primary);
		white-space: nowrap;
	}
	.legend-item .swatch {
		width: 22px;
		height: 3px;
		border-radius: 2px;
		display: inline-block;
	}
	.legend-item .swatch.solid {
		background: var(--series-main);
		height: 4px;
	}
	.legend-item .swatch.dashed {
		background: repeating-linear-gradient(to right, var(--series-pre2026) 0 2px, transparent 2px 5px);
		height: 2px;
	}
	.legend-item .swatch.dotted {
		background: repeating-linear-gradient(to right, var(--series-2025) 0 2px, transparent 2px 5px);
		height: 2px;
	}
	.legend-item .swatch.matchday {
		width: 2px;
		height: 14px;
		background: repeating-linear-gradient(to bottom, var(--matchday-line) 0 3px, transparent 3px 6px);
	}
	.legend-ball-icon {
		width: 16px;
		height: 16px;
		fill: var(--text-primary);
		flex-shrink: 0;
	}
	.chart-wrap {
		position: relative;
	}
	svg {
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
	}
	.axis-line {
		stroke: var(--axis);
		stroke-width: 1;
	}
	.tick-label {
		fill: var(--text-muted);
		font-family: OpenSans, sans-serif;
		font-size: 14px;
	}
	.matchday-line {
		stroke: var(--matchday-line);
		stroke-width: 1.75;
		stroke-dasharray: 2 3;
	}
	.matchday-label .ball-icon {
		fill: var(--text-secondary);
	}
	.matchday-label-text {
		fill: var(--text-secondary);
		font-family: OpenSans, sans-serif;
		font-size: 16px;
	}
	.line-main {
		fill: none;
		stroke: var(--series-main);
		stroke-width: 4;
		stroke-linejoin: round;
		stroke-linecap: round;
	}
	.line-pre2026 {
		fill: none;
		stroke: var(--series-pre2026);
		stroke-width: 2;
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-dasharray: 1.5 4;
	}
	.line-2025 {
		fill: none;
		stroke: var(--series-2025);
		stroke-width: 2;
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-dasharray: 1.5 4;
	}
	.fill-main {
		fill: var(--fill-main);
	}
	.fill-pre2026 {
		fill: var(--fill-pre2026);
	}
	.fill-2025 {
		fill: var(--fill-2025);
	}
	.hover-target {
		fill: transparent;
	}
	.crosshair {
		fill: rgba(255, 255, 255, 0.12);
		pointer-events: none;
	}
	.tooltip {
		position: absolute;
		pointer-events: none;
		background: var(--surface-1);
		border: 1px solid var(--grid);
		border-radius: 8px;
		padding: 8px 11px;
		font-family: OpenSans, sans-serif;
		font-size: 14px;
		color: var(--text-primary);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
		opacity: 0;
		transition: opacity 0.1s;
		white-space: nowrap;
		z-index: 10;
	}
	.tooltip .t-row {
		display: flex;
		align-items: center;
		gap: 6px;
		margin: 2px 0;
	}
	.tooltip .t-main {
		font-family: OpenSansBold, sans-serif;
		margin-bottom: 4px;
	}
	.tooltip .t-matchday {
		color: var(--text-secondary);
		font-family: OpenSans, sans-serif;
	}
	.tooltip .t-swatch {
		width: 7px;
		height: 7px;
		border-radius: 2px;
		flex-shrink: 0;
	}

	@media screen and (max-width: 1000px) {
		.card {
			padding: 20px 20px 12px;
		}
		.card-title {
			font-size: 19px;
		}
		.legend {
			justify-content: flex-start;
			max-width: none;
		}
		.line-pre2026,
		.line-2025 {
			stroke-width: 3;
		}
		.matchday-line {
			stroke-width: 2.25;
		}
	}

	@media screen and (max-width: 480px) {
		.card {
			padding: 18px 16px 10px;
		}
		.legend-item {
			font-size: 11px;
		}
		.line-pre2026,
		.line-2025 {
			stroke-width: 3.5;
		}
		.matchday-line {
			stroke-width: 2.5;
		}
	}
</style>
