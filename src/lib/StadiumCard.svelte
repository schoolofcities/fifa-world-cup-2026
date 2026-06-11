<script>
	import { base } from '$app/paths';

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
					<svg class="ball-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" aria-hidden="true"><path d="m414-168 12-56q3-13 12.5-21.5T462-256l124-10q13-2 24 5t16 19l16 38q39-23 70-55.5t52-72.5l-12-6q-11-8-16-19.5t-2-24.5l28-122q3-12 12.5-20t21.5-10q-5-25-12.5-48.5T764-628q-9 5-19.5 4.5T726-630l-106-64q-11-7-16-19t-2-25l8-34q-31-14-63.5-21t-66.5-7q-14 0-29 1.5t-29 4.5l30 68q5 12 2.5 25T442-680l-94 82q-10 9-23.5 10t-24.5-6l-92-56q-23 38-35.5 81.5T160-480q0 16 4 52l88-8q14-2 25.5 4.5T294-412l48 114q5 12 2.5 25T332-252l-38 32q27 20 57.5 33t62.5 19Zm72-172q-13 2-24-5t-16-19l-54-124q-5-12-1.5-25t13.5-21l102-86q9-9 22-10t24 6l112 66q11 7 17 19t3 25l-32 130q-3 13-12 21.5T618-352l-132 12Zm-6 260q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg>{s.fifaName}
				</h3>
				<p class="card-fifa-name">({s.name})</p>
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
							<svg viewBox="0 -960 960 960" class="person-icon"><path d="M367-527q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm296.5-343.5Q560-607 560-640t-23.5-56.5Q513-720 480-720t-56.5 23.5Q400-673 400-640t23.5 56.5Q447-560 480-560t56.5-23.5ZM480-640Zm0 400Z"/></svg>
						{/each}
						{#if partial > 0.1}
							<svg viewBox="0 -960 960 960" class="person-icon person-icon-partial" style="--partial: {partial}"><path d="M367-527q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm296.5-343.5Q560-607 560-640t-23.5-56.5Q513-720 480-720t-56.5 23.5Q400-673 400-640t23.5 56.5Q447-560 480-560t56.5-23.5ZM480-640Zm0 400Z"/></svg>
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
						<span class="stat-label">of residents<br/>within 25km</span>
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
		align-items: center;
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
		font-size: clamp(15px, 3.5vw, 21px);
		color: var(--brandWhite);
		margin: 0 0 6px;
		padding: 0;
		line-height: 1.15;
		text-align: left;
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.ball-icon {
		width: 1em;
		height: 1em;
		fill: var(--brandWhite);
		flex-shrink: 0;
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
