<script>
	import { buildChart, W, H, MARGIN, PLOT_H, PLOT_W } from './chartGeometry.js';
	import { countryFlags } from './countryFlags.js';

	let { game, scopeLabel = 'across Toronto' } = $props();

	const bikePath =
		'M200-80q-83 0-141.5-58.5T0-280q0-83 58.5-141.5T200-480q83 0 141.5 58.5T400-280q0 83-58.5 141.5T200-80Zm85-115q35-35 35-85t-35-85q-35-35-85-35t-85 35q-35 35-35 85t35 85q35 35 85 35t85-35Zm155-5v-200L312-512q-12-11-18-25.5t-6-30.5q0-16 6.5-30.5T312-624l112-112q12-12 27.5-18t32.5-6q17 0 32.5 6t27.5 18l76 76q28 28 64 44t76 16v80q-57 0-108.5-22T560-604l-32-32-96 96 88 92v248h-80Zm123.5-563.5Q540-787 540-820t23.5-56.5Q587-900 620-900t56.5 23.5Q700-853 700-820t-23.5 56.5Q653-740 620-740t-56.5-23.5ZM760-80q-83 0-141.5-58.5T560-280q0-83 58.5-141.5T760-480q83 0 141.5 58.5T960-280q0 83-58.5 141.5T760-80Zm85-115q35-35 35-85t-35-85q-35-35-85-35t-85 35q-35 35-35 85t35 85q35 35 85 35t85-35Z';

	const chart = $derived(buildChart(game));

	// wraps the scope label ("starting within 2km of Toronto Stadium") onto short lines for the axis title,
	// keeping "2km of Toronto" together and "Stadium" on its own line
	const scopeLines = $derived.by(() => {
		const words = scopeLabel.split(' ');
		if (words.length <= 2) return [scopeLabel];
		const kmIdx = words.findIndex((w) => /km$/.test(w));
		if (kmIdx === -1) {
			const mid = Math.ceil(words.length / 2);
			return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
		}
		return [
			words.slice(0, kmIdx).join(' '),
			words.slice(kmIdx, kmIdx + 3).join(' '),
			words.slice(kmIdx + 3).join(' '),
		];
	});

	const dateLabel = $derived(
		new Date(game.date + 'T12:00:00').toLocaleDateString('en-US', {
			weekday: 'long',
			month: 'long',
			day: 'numeric',
		})
	);

	const shortDateLabel = $derived(
		new Date(game.date + 'T12:00:00').toLocaleDateString('en-US', {
			month: 'long',
			day: 'numeric',
		})
	);

	const weekdayLabel = $derived(
		new Date(game.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long' })
	);

	let hoverIdx = $state(null);
	let svgEl = $state(null);
	let tooltipLeft = $state(0);

	const hoverRow = $derived(hoverIdx === null ? null : chart.rows[hoverIdx]);
	const hoverX = $derived(hoverIdx === null ? 0 : chart.xAt(hoverIdx));

	function onEnter(i) {
		hoverIdx = i;
		if (!svgEl) return;
		const svgRect = svgEl.getBoundingClientRect();
		const scale = svgRect.width / W;
		const px = chart.xAt(i) * scale;
		tooltipLeft = Math.min(px + 10, svgRect.width - 140);
	}

	function onLeave() {
		hoverIdx = null;
	}
</script>

<div class="card">
	<div class="card-header">
		<div>
			<p class="card-title">
				<span class="flag">{countryFlags[game.country_a] ?? ''}</span> {game.country_a}
				vs
				<span class="flag">{countryFlags[game.country_b] ?? ''}</span> {game.country_b}
			</p>
			<p class="card-sub">{dateLabel} &middot; Kickoff {game.kickoff}</p>
		</div>
		<div class="legend">
			<div class="legend-items">
				<span class="legend-item">
					<span class="swatch"></span>
					<svg class="legend-bike-icon target" viewBox="0 -960 960 960" aria-hidden="true"><path d={bikePath} /></svg>
					Bike Share trips on {shortDateLabel}
				</span>
				<span class="legend-item">
					<span class="swatch dashed"></span>
					<svg class="legend-bike-icon baseline" viewBox="0 -960 960 960" aria-hidden="true"><path d={bikePath} /></svg>
					Baseline (average of 6 prior {weekdayLabel}s)
				</span>
			</div>
		</div>
	</div>
	<div class="chart-wrap">
		<svg viewBox="0 0 {W} {H}" bind:this={svgEl}>
			<rect
				class="game-band"
				x={chart.x(chart.matchStart).toFixed(2)}
				y={MARGIN.top}
				width={(chart.x(chart.matchEnd) - chart.x(chart.matchStart)).toFixed(2)}
				height={PLOT_H}
			/>
			<line
				class="game-band-line"
				x1={chart.x(chart.matchStart).toFixed(2)}
				x2={chart.x(chart.matchStart).toFixed(2)}
				y1={MARGIN.top}
				y2={MARGIN.top + PLOT_H}
			/>
			<line
				class="game-band-line"
				x1={chart.x(chart.matchEnd).toFixed(2)}
				x2={chart.x(chart.matchEnd).toFixed(2)}
				y1={MARGIN.top}
				y2={MARGIN.top + PLOT_H}
			/>
			{#each chart.yTicks as v}
				<line class="gridline" x1={MARGIN.left} x2={W - MARGIN.right} y1={chart.y(v).toFixed(2)} y2={chart.y(v).toFixed(2)} />
				<text class="tick-label" x={MARGIN.left - 6} y={(chart.y(v) + 3).toFixed(2)} text-anchor="end">{v.toLocaleString()}</text>
			{/each}
			<text class="axis-title" x="4" y={MARGIN.top + PLOT_H / 2 - (17 * (scopeLines.length + 2)) / 2} text-anchor="start">
				<tspan x="4" dy="0">Bike share trips</tspan>
				<tspan x="4" dy="17">per minute</tspan>
				{#each scopeLines as line}
					<tspan x="4" dy="17">{line}</tspan>
				{/each}
			</text>

			<line class="axis-line" x1={MARGIN.left} x2={W - MARGIN.right} y1={MARGIN.top + PLOT_H} y2={MARGIN.top + PLOT_H} />
			{#each chart.xTickIdxs as i}
				<text class="tick-label" x={chart.xTickAt(i).toFixed(2)} y={MARGIN.top + PLOT_H + 16} text-anchor="middle">{chart.rows[i].time_start}</text>
			{/each}
			<text class="axis-title" x={MARGIN.left + PLOT_W / 2} y={MARGIN.top + PLOT_H + 36} text-anchor="middle">Trip departure time</text>

			{#each chart.fills as f}
				<path class={f.cls} d={f.d} />
			{/each}
			<path class="line-baseline" d={chart.pathBaseline} />
			<path class="line-target" d={chart.pathTarget} />

			<g
				class="end-bike-icon"
				transform="translate({(chart.xAt(chart.n - 1) + 10).toFixed(2)}, {chart.y(chart.rows[chart.n - 1].target).toFixed(2)}) scale(0.0167) translate(-480, 490)"
				style="fill:var(--series-target-line)"
			>
				<path d={bikePath} />
			</g>
			<g
				class="end-bike-icon"
				transform="translate({(chart.xAt(chart.n - 1) + 10).toFixed(2)}, {chart.y(chart.rows[chart.n - 1].baseline).toFixed(2)}) scale(0.0167) translate(-480, 490)"
				style="fill:var(--series-baseline-line)"
			>
				<path d={bikePath} />
			</g>

			{#each chart.rows as r, i}
				<rect
					class="hover-target"
					x={(chart.xAt(i) - chart.bandW / 2).toFixed(2)}
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
					x={(hoverX - chart.bandW / 2).toFixed(2)}
					y={MARGIN.top}
					width={chart.bandW.toFixed(2)}
					height={PLOT_H}
					pointer-events="none"
				/>
			{/if}

			<g
				class="game-band-label"
				transform="translate({((chart.x(chart.matchStart) + chart.x(chart.matchEnd)) / 2 - 46).toFixed(2)}, {MARGIN.top + 12})"
			>
				<path
					class="ball-icon"
					transform="scale(0.0146) translate(0, 960)"
					d="m414-168 12-56q3-13 12.5-21.5T462-256l124-10q13-2 24 5t16 19l16 38q39-23 70-55.5t52-72.5l-12-6q-11-8-16-19.5t-2-24.5l28-122q3-12 12.5-20t21.5-10q-5-25-12.5-48.5T764-628q-9 5-19.5 4.5T726-630l-106-64q-11-7-16-19t-2-25l8-34q-31-14-63.5-21t-66.5-7q-14 0-29 1.5t-29 4.5l30 68q5 12 2.5 25T442-680l-94 82q-10 9-23.5 10t-24.5-6l-92-56q-23 38-35.5 81.5T160-480q0 16 4 52l88-8q14-2 25.5 4.5T294-412l48 114q5 12 2.5 25T332-252l-38 32q27 20 57.5 33t62.5 19Zm72-172q-13 2-24-5t-16-19l-54-124q-5-12-1.5-25t13.5-21l102-86q9-9 22-10t24 6l112 66q11 7 17 19t3 25l-32 130q-3 13-12 21.5T618-352l-132 12Zm-6 260q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"
				/>
				<text class="game-band-label-text" x="16" y="10.5">~match time</text>
			</g>
		</svg>

		{#if hoverRow}
			{@const diff = hoverRow.target - hoverRow.baseline}
			{@const pct = (diff / hoverRow.baseline) * 100}
			<div class="tooltip" style="opacity: 1; left: {tooltipLeft}px; top: 10px;">
				<div class="t-time">{hoverRow.time_start}&ndash;{hoverRow.time_end}</div>
				<div class="t-row"><span class="t-swatch" style="background:var(--series-target-line)"></span>{shortDateLabel}: {hoverRow.target.toFixed(1)} trips/min</div>
				<div class="t-row"><span class="t-swatch" style="background:var(--series-baseline-line)"></span>Baseline: {hoverRow.baseline.toFixed(1)} trips/min</div>
				<div class="t-row" style="color:var(--text-secondary)">{diff >= 0 ? '+' : ''}{diff.toFixed(1)} ({pct >= 0 ? '+' : ''}{pct.toFixed(1)}%)</div>
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
		font-size: 25px;
		font-weight: normal;
		margin: 0 0 6px;
		color: var(--text-primary);
	}
	.card-title .flag {
		font-size: 0.75em;
	}
	.card-sub {
		font-family: OpenSansBold, sans-serif;
		font-size: 14px;
		color: var(--text-secondary);
		margin: 0;
	}
	.legend {
		padding-top: 6px;
		text-align: left;
	}
	.legend-items {
		display: flex;
		flex-direction: column;
		gap: 6px;
		align-items: flex-start;
	}
	.legend-item {
		display: flex;
		align-items: center;
		gap: 6px;
		font-family: OpenSans, sans-serif;
		font-size: 16px;
		font-weight: 300;
		color: var(--text-primary);
		white-space: nowrap;
	}
	.legend-item .swatch {
		width: 28px;
		height: 3px;
		border-radius: 2px;
		display: inline-block;
		background: var(--series-target-line);
	}
	.legend-item .swatch.dashed {
		background: repeating-linear-gradient(to right, var(--series-baseline-line) 0 5px, transparent 5px 9px);
		height: 2px;
	}
	.legend-bike-icon {
		width: 14px;
		height: 14px;
		flex-shrink: 0;
	}
	.legend-bike-icon.target {
		fill: var(--series-target-line);
	}
	.legend-bike-icon.baseline {
		fill: var(--series-baseline-line);
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
	.gridline {
		stroke: var(--grid);
		stroke-width: 1;
	}
	.axis-line {
		stroke: var(--axis);
		stroke-width: 1;
	}
	.tick-label {
		fill: var(--text-muted);
		font-size: 13px;
	}
	.axis-title {
		fill: var(--text-primary);
		font-family: OpenSans, sans-serif;
		font-size: 11px;
	}
	.game-band {
		fill: var(--game-band);
	}
	.game-band-line {
		stroke: var(--game-band-line);
		stroke-width: 1;
		stroke-dasharray: 2 3;
	}
	.game-band-label .ball-icon {
		fill: var(--text-muted);
	}
	.game-band-label-text {
		fill: var(--text-muted);
		font-family: OpenSans, sans-serif;
		font-size: 12px;
	}
	.line-target {
		fill: none;
		stroke: var(--series-target-line);
		stroke-width: 2.5;
		stroke-linejoin: round;
		stroke-linecap: round;
	}
	.line-baseline {
		fill: none;
		stroke: var(--series-baseline-line);
		stroke-width: 2.5;
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-dasharray: 6 5;
	}
	.fill-above {
		fill: var(--above-fill);
	}
	.fill-below {
		fill: var(--below-fill);
	}
	.end-bike-icon {
		filter: drop-shadow(0 0 2px var(--surface-1)) drop-shadow(0 0 2px var(--surface-1));
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
		font-size: 13px;
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
		gap: 5px;
		margin: 1px 0;
	}
	.tooltip .t-swatch {
		width: 7px;
		height: 7px;
		border-radius: 2px;
	}
	.tooltip .t-time {
		color: var(--text-secondary);
		font-weight: 600;
		margin-bottom: 3px;
	}

	@media screen and (max-width: 480px) {
		.card {
			padding: 18px 16px 10px;
		}
		.card-title {
			font-size: 23px;
		}
		.card-sub {
			font-size: 15px;
		}
		.legend-item {
			white-space: normal;
			font-size: 17px;
		}
		.legend-bike-icon {
			width: 15px;
			height: 15px;
		}
	}
</style>
