<script>
	import '$assets/global-styles.css';
	import IconRow from '$lib/IconRow.svelte';
	import StadiumCard from '$lib/StadiumCard.svelte';
	import MethodsSection from '$lib/MethodsSection.svelte';
	import { base } from '$app/paths';
	import { flip } from 'svelte/animate';

	let { data } = $props();

	const countryName = { USA: 'USA', MEX: 'Mexico', CAN: 'Canada' };

	import { stadiumBase } from '$lib/stadiums.js';

	const stadiums = $derived(
		stadiumBase.map((s) => ({
			...s,
			...(data.stats[s.id] ?? {}),
			popInIsochrone: data.stats[s.id]?.popInIsochrone ?? null,
			pctInIsochrone: data.stats[s.id]?.pctInIsochrone ?? null,
		}))
	);

	let sortKey = $state('name');

	const sorted = $derived(
		[...stadiums].sort((a, b) => {
			if (sortKey === 'name') return a.fifaName.localeCompare(b.fifaName);
			if (sortKey === 'pop') {
				if (a.popInIsochrone === null && b.popInIsochrone === null) return 0;
				if (a.popInIsochrone === null) return 1;
				if (b.popInIsochrone === null) return -1;
				return b.popInIsochrone - a.popInIsochrone;
			}
			if (sortKey === 'pct') {
				if (a.pctInIsochrone === null && b.pctInIsochrone === null) return 0;
				if (a.pctInIsochrone === null) return 1;
				if (b.pctInIsochrone === null) return -1;
				return b.pctInIsochrone - a.pctInIsochrone;
			}
			return 0;
		})
	);
</script>

<main>
	<!-- Hero header -->
	<div class="hero">
		<div class="hero-inner">
			<div class="hero-logo">
				<a href="https://schoolofcities.utoronto.ca" target="_blank" rel="noopener">
					<img src="{base}/sofc-uoft-logo-white.svg" alt="School of Cities / University of Toronto" />
				</a>
			</div>
			<div class="hero-icons">
				<IconRow duration={5} />
			</div>
			<div class="hero-rule"></div>
			<h1>Transit-Oriented Stadiums</h1>
			<p class="hero-lede">
				How connected are FIFA World Cup 2026 stadiums to their cities via public transit?
			</p><br>
			<p>
				We generated 60-minute public transit <a href="https://en.wikipedia.org/wiki/Isochrone_map" target="_blank" rel="noopener">isochrones</a> around every stadium and estimated how much of each metro's population lives within this area. The maps show that cities vary widely in how connected their stadiums are to the rest of the city via public transit.
			</p>
			<div class="hero-byline">
				<span class="hero-author">By Jeff Allen</span>
				<span class="hero-byline-sep">···</span>
				<span class="hero-date">06/2026</span>
			</div>
		</div>
	</div>

	<!-- Sort controls + cards section -->
	<div class="cards-section">
		<div class="cards-grid controls-bar">
			<div class="controls-bar-inner">
				<div class="legend-item">
					<svg class="legend-svg" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
						<clipPath id="circle-clip"><circle cx="30" cy="30" r="29"/></clipPath>
						<circle cx="30" cy="30" r="29" fill="none"/>
						<path clip-path="url(#circle-clip)" fill="#F1C500" stroke="white" stroke-width="1"
							d="M32,14 L35,16 L39,14 L42,17 L45,15 L47,20 L45,23 L47,27 L46,30 L48,34 L45,37 L43,41 L40,44 L36,46 L32,47 L28,46 L24,47 L21,44 L18,41 L16,37 L14,33 L15,29 L13,25 L16,21 L18,17 L22,15 L26,13 Z"/>
						<circle cx="30" cy="30" r="3" fill="#e05c5c"/>
					</svg>
					<span class="legend-label">Area reachable from the stadium in ~60 minutes by public transit</span>
				</div>
				<div class="sort-bar-inner">
					<span class="sort-label">Sort by</span>
					<div class="sort-buttons" role="group" aria-label="Sort stadiums by">
						<button
							class:active={sortKey === 'name'}
							onclick={() => (sortKey = 'name')}
						>Name</button>
						<button
							class:active={sortKey === 'pop'}
							onclick={() => (sortKey = 'pop')}
						>Population reached</button>
						<button
							class:active={sortKey === 'pct'}
							onclick={() => (sortKey = 'pct')}
						>% within 25km</button>
					</div>
				</div>
			</div>
		</div>

		<!-- Stadium cards -->
		<div class="cards-grid">
			{#each sorted as s (s.id)}
				<div animate:flip={{ duration: 400 }}>
					<StadiumCard stadium={s} {countryName} />
				</div>
			{/each}
		</div>
	</div>

	<!-- Monterrey note -->
	<div class="monterrey-note">
		<div class="monterrey-note-inner">
			<p><strong>Note on Monterrey:</strong> Estadio BBVA (Guadalupe, NL) is not included in this analysis. No public GTFS data exists for any transit agency in the Monterrey metropolitan area, making a reliable transit isochrone impossible to compute at this time.</p>
		</div>
	</div>

	<MethodsSection />
</main>

<style>
	/* ── Page ── */
	main {
		background-color: var(--brandMedGreen);
		padding-bottom: 100px;
	}

	/* ── Hero ── */
	.hero {
		background-color: var(--brandDarkGreen);
		padding-top: 50px;
		padding-bottom: 100px;
		padding-left: 20px;
		padding-right: 20px;
	}

	.hero-inner {
		max-width: 700px;
		margin: 0 auto;
	}

	.hero-logo {
		margin-bottom: 82px;
	}

	.hero-logo a {
		display: inline-block;
		transition: opacity 0.2s;
	}

	.hero-logo a:hover {
		opacity: 0.8;
	}

	.hero-logo img {
		height: 45px;
		width: auto;
		display: block;
	}

	.hero-icons {
		margin-bottom: 48px;
	}

	.hero-rule {
		width: 48px;
		height: 4px;
		background-color: var(--brandLightGreen);
		margin-bottom: 32px;
		border-radius: 2px;
	}

	.hero h1 {
		font-family: TradeGothicBold, sans-serif;
		font-size: 63px;
		line-height: 1.0;
		color: var(--brandWhite);
		margin: 0 0 32px;
		padding: 0;
	}

	.hero p {
		font-family: OpenSans, sans-serif;
		font-size: 19px;
		line-height: 1.7;
		color: var(--brandWhite);
		margin: 0;
		padding: 0;
		max-width: 100%;
	}

	.hero p.hero-lede {
		color: var(--brandYellow);
		font-family: OpenSansBoldItalic, sans-serif;
		font-size: 19.5px;
	}

	.hero p a {
		color: var(--brandWhite);
		text-decoration: underline;
		font-family: inherit;
	}

	.hero p a:hover {
		color: var(--brandYellow);
	}

	.hero-byline {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-top: 24px;
		font-family: OpenSans, sans-serif;
		font-size: 13px;
		color: rgba(255, 255, 255, 0.55);
		letter-spacing: 0.03em;
	}

	.hero-byline-sep {
		opacity: 0.4;
	}

	/* ── Cards section ── */
	.cards-section {
		max-width: 1600px;
		margin: 0 auto;
		padding: 0 24px;
	}

	/* ── Controls bar (legend + sort on one row) ── */

	.controls-bar-inner {
		grid-column: 1 / -1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 12px;
		padding: 28px 0 16px;
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.legend-svg {
		width: 44px;
		height: 44px;
		flex-shrink: 0;
	}

	.legend-label {
		font-family: OpenSansBold, sans-serif;
		font-size: 14px;
		color: var(--brandWhite);
	}

	.sort-bar-inner {
		display: flex;
		align-items: center;
		gap: 14px;
		flex-wrap: wrap;
	}

	.sort-label {
		font-family: OpenSansBold, sans-serif;
		font-size: 14px;
		color: var(--brandWhite);
		white-space: nowrap;
	}

	.sort-buttons {
		display: flex;
		background: var(--brandDarkGreen);
		border-radius: 6px;
		overflow: hidden;
		padding: 3px;
		gap: 2px;
	}

	.sort-buttons button {
		background: transparent;
		border: none;
		padding: 6px 14px;
		font-family: OpenSans, sans-serif;
		font-size: 13px;
		color: var(--brandLightGreen);
		cursor: pointer;
		border-radius: 4px;
		transition: background-color 0.12s, color 0.12s;
		white-space: nowrap;
	}

	.sort-buttons button:hover {
		background-color: rgba(141, 191, 46, 0.15);
		color: var(--brandWhite);
	}

	.sort-buttons button.active {
		background-color: var(--brandLightGreen);
		color: var(--brandDarkBlue);
		font-family: OpenSansBold, sans-serif;
	}

	/* ── Cards grid ── */
	.cards-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(500px, 500px));
		gap: 20px;
		justify-content: center;
	}

	/* ── Monterrey note ── */
	.monterrey-note {
		max-width: 700px;
		margin: 60px auto 60px;
		padding: 0 24px;
	}

	.monterrey-note-inner {
		border-left: 4px solid var(--brandDarkBlue);
		padding: 14px 20px;
		background-color: var(--brandDarkGreen);
		border-radius: 0 6px 6px 0;
	}

	.monterrey-note p {
		font-family: OpenSans, sans-serif;
		font-size: 14px;
		line-height: 1.6;
		color: var(--brandWhite);
		margin: 0;
		padding: 0;
	}

	.monterrey-note strong {
		font-family: OpenSansBold, sans-serif;
		font-weight: normal;
		color: var(--brandLightGreen);
	}

	/* ── Responsive ── */
	@media screen and (max-width: 700px) {
		.hero h1 {
			font-size: 34px;
		}
		.hero p {
			font-size: 17px;
		}
		.cards-grid {
			grid-template-columns: 1fr;
		}
		.controls-bar-inner {
			flex-direction: column;
			align-items: flex-start;
		}
	}
</style>
