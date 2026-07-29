<script>
	import { base } from '$app/paths';
	import { ballPath, personPath } from '$lib/icons.js';

	let { stadium: s, countryName } = $props();

	function fmtPop(n) {
		if (n === null) return '—';
		const rounded = Math.round(n / 10_000) * 10_000;
		return rounded.toLocaleString();
	}

	function fmtPct(n) {
		if (n === null) return '—';
		return Math.round(n) + '%';
	}

	const r = 28;
	const circ = 2 * Math.PI * r;
	const donutFill = $derived(
		s.pctInIsochrone !== null ? (Math.min(s.pctInIsochrone, 100) / 100) * circ : 0
	);
</script>

<div class="card">
	<div class="card-header">
		<div class="card-header-row">
			<div class="card-header-left">
				<h3 class="card-stadium-name">
					<svg class="ball-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" aria-hidden="true"><path d={ballPath} /></svg><span>{s.fifaName}</span>
				</h3>
				<p class="card-fifa-name">({s.name})</p>
				{#if s.capacity}
					<p class="card-capacity">{s.capacity.toLocaleString()} capacity</p>
				{/if}
			</div>
			<div class="card-header-right">
				<div class="card-location">{s.city}, {s.stateProvince}</div>
				<div class="card-country">{countryName[s.country]}</div>
			</div>
		</div>
	</div>
	<div class="card-map">
		{#if s.img}
			<img src="{base}/{s.img}" alt="{s.city} transit map" class="map-img" />
		{:else}
			<div class="map-img-placeholder"><span>{s.city}</span></div>
		{/if}
	</div>
	<div class="card-body">
		<div class="card-stats">
			<div class="stat">
				<span class="stat-value">{fmtPop(s.popInIsochrone)}</span>
				<span class="stat-label">residents within a<br/>60-minute transit trip</span>
				{#if s.popInIsochrone !== null}
					{@const full = Math.floor(s.popInIsochrone / 100_000)}
					{@const partial = (s.popInIsochrone % 100_000) / 100_000}
					<div class="pictograph">
						{#each Array(full) as _}
							<svg viewBox="0 -960 960 960" class="person-icon"><path d={personPath} /></svg>
						{/each}
						{#if partial > 0.1}
							<svg viewBox="0 -960 960 960" class="person-icon person-icon-partial" style="--partial: {partial}"><path d={personPath} /></svg>
						{/if}
					</div>
				{/if}
			</div>
			<div class="stat">
				{#if s.pctInIsochrone !== null}
					<div class="donut-row">
						<svg class="donut" viewBox="0 0 72 72">
							<circle class="donut-fill" cx="36" cy="36" r={r} />
							<circle class="donut-bg" cx="36" cy="36" r={r} />
							<circle
								class="donut-arc"
								cx="36" cy="36" r={r}
								stroke-dasharray="{donutFill} {circ}"
								transform="rotate(-90 36 36)"
							/>
							<text class="donut-text" x="36" y="36">{fmtPct(s.pctInIsochrone)}</text>
						</svg>
						<span class="stat-label">of residents<br/>within 25 km</span>
					</div>
				{:else}
					<span class="stat-value">—</span>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	.card {
		border-radius: 10px;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		flex: 1;
		background: var(--brandDarkGreen);
		box-shadow: 0 4px 16px rgba(30, 55, 101, 0.12), 0 1px 4px rgba(30, 55, 101, 0.08);
		transition: transform 0.15s, box-shadow 0.15s;
	}

	.card-map {
		width: 100%;
		aspect-ratio: 1 / 1;
		background-color: var(--brandDarkGreen);
		position: relative;
		padding: 10px;
		box-sizing: border-box;
		margin-top: -10px;
		margin-bottom: -10px;
	}

	.map-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.map-img-placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--brandLightGreen);
		font-family: OpenSans, sans-serif;
		font-size: 12px;
		letter-spacing: 0.04em;
	}

	.card-header {
		padding: 20px 22px 16px;
	}

	.card-header-row {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 12px;
	}

	.card-header-left {
		flex-shrink: 0;
	}

	.card-header-right {
		text-align: right;
		flex-shrink: 0;
	}

	.card-body {
		padding: 0 22px 22px;
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.card-location {
		font-family: OpenSansBold, sans-serif;
		font-size: clamp(11px, 2.5vw, 15px);
		color: var(--brandWhite);
		margin-bottom: 2px;
	}

	.card-country {
		font-family: OpenSans, sans-serif;
		font-size: clamp(9px, 2vw, 13px);
		color: var(--brandLightGreen);
	}

	.card-stadium-name {
		font-family: TradeGothicBold, sans-serif;
		font-weight: normal;
		font-size: clamp(17px, 3.5vw, 21px);
		color: var(--brandWhite);
		margin: 0 0 6px;
		padding: 0;
		line-height: 1.15;
		text-align: left;
		display: flex;
		align-items: center;
		gap: 6px;
	}

	@media (max-width: 440px) {
		.card-header-left {
			max-width: 55%;
		}
	}

	.ball-icon {
		width: 1em;
		height: 1em;
		fill: var(--brandWhite);
		flex-shrink: 0;
	}

	.card-capacity {
		font-family: OpenSans, sans-serif;
		font-size: clamp(9px, 2vw, 12px);
		color: var(--brandLightBlue);
		margin: 0;
		margin-top: 4px;
		padding: 0;
		padding-left: calc(1em + 15px);
		line-height: 1.4;
		text-align: left;
	}

	.card-fifa-name {
		font-family: OpenSans, sans-serif;
		font-size: clamp(9px, 2vw, 12px);
		color: var(--brandLightGreen);
		margin: 0;
		padding: 0;
		padding-left: calc(1em + 15px);
		line-height: 1.4;
		text-align: left;
	}

	.card-stats {
		display: flex;
		gap: 0;
		margin-top: 20px;
		padding-top: 20px;
		border-top: 1px solid var(--brandDarkGreen);
	}

	.stat {
		display: flex;
		flex-direction: column;
		gap: 3px;
		flex: 1;
		padding-right: 12px;
	}

	.stat + .stat {
		padding-right: 0;
		padding-left: 12px;
		border-left: 1px solid var(--brandDarkGreen);
		align-items: flex-end;
		text-align: right;
	}

	.stat-value {
		font-family: TradeGothicBold, sans-serif;
		font-size: 26px;
		color: var(--brandWhite);
		line-height: 1;
	}

	.pictograph {
		display: flex;
		flex-wrap: wrap;
		gap: 2px;
		margin-top: 6px;
	}

	.person-icon {
		width: 14px;
		height: 14px;
		fill: var(--brandYellow);
		flex-shrink: 0;
	}

	.person-icon-partial {
		opacity: var(--partial);
	}

	.donut-row {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.donut {
		width: 90px;
		height: 90px;
		flex-shrink: 0;
	}

	.donut-fill {
		fill: none;
		stroke: none;
	}

	.donut-bg {
		fill: none;
		stroke: rgba(141, 191, 46, 0.15);
		stroke-width: 8;
	}

	.donut-arc {
		fill: none;
		stroke: var(--brandYellow);
		stroke-width: 8;
		stroke-linecap: round;
	}

	.donut-text {
		fill: var(--brandWhite);
		font-family: TradeGothicBold, sans-serif;
		font-size: 16px;
		text-anchor: middle;
		dominant-baseline: middle;
	}

	.stat-label {
		font-family: OpenSans, sans-serif;
		font-size: 12px;
		color: rgba(255, 255, 255, 0.8);
		line-height: 1.4;
	}
</style>
