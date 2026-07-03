<script>
	import '$assets/global-styles.css';
	import { base } from '$app/paths';
	import IconRow from './lib/IconRow.svelte';
	import GameChart from './lib/GameChart.svelte';
	import MethodsSection from './lib/MethodsSection.svelte';

	let { data } = $props();

	const filters = [
		{ key: 'all', label: 'All Bike Share trips' },
		{ key: '2km', label: 'Starting within 2km of Toronto Stadium' },
		{ key: '1km', label: 'Starting within 1km of Toronto Stadium' },
	];

	let filter = $state('all');

	const games = $derived([...data.gamesByFilter[filter]].reverse());

	const scopeLabels = {
		all: 'across Toronto',
		'2km': 'starting within 2km of Toronto Stadium',
		'1km': 'starting within 1km of Toronto Stadium',
	};
	const scopeLabel = $derived(scopeLabels[filter]);
</script>

<svelte:head>
	<title>Toronto Bike Share activity during World Cup match days</title>

	<meta name="description" content="How did Bike Share activity in Toronto change on FIFA World Cup 2026 match days, compared to a typical day?">
	<meta name="author" content="Jeff Allen">

	<meta property="og:title" content="Toronto Bike Share activity during World Cup match days | School of Cities" />
	<meta property="og:description" content="How did Bike Share activity in Toronto change on FIFA World Cup 2026 match days, compared to a typical day?" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://schoolofcities.github.io/fifa-world-cup-2026/bike-share-toronto" />
	<meta property="og:image" content="https://raw.githubusercontent.com/schoolofcities/fifa-world-cup-2026/main/static/web-card-bike-share.png" />
	<meta property="og:locale" content="en_CA">

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="https://schoolofcities.github.io/fifa-world-cup-2026/bike-share-toronto" />
	<meta name="twitter:creator" content="@JeffAllenMaps" />
	<meta name="twitter:title" content="Toronto Bike Share activity during World Cup match days | School of Cities" />
	<meta name="twitter:description" content="How did Bike Share activity in Toronto change on FIFA World Cup 2026 match days, compared to a typical day?" />
	<meta name="twitter:image" content="https://raw.githubusercontent.com/schoolofcities/fifa-world-cup-2026/main/static/web-card-bike-share.png" />
</svelte:head>

<main class="viz-root">
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
			<h1>Bike Share activity during World Cup match days</h1>
			<p class="hero-lede">
				How did Bike Share activity change around Toronto's World Cup matches?
			</p><br>
			<p>
				We estimated the number of Bike Share trips before, during, and after FIFA World Cup 2026 matches in Toronto. The charts below show spikes of activity after matches end, especially for Bike Share stations near the stadium.
			</p>
			
			<div class="hero-byline">
				<span class="hero-author">By Jeff Allen</span>
				<span class="hero-byline-sep">&middot;&middot;&middot;</span>
				<span class="hero-date">07/2026</span>
			</div>
			<br><br>
		</div>
	</div>

	<!-- Charts section -->
	<div class="charts-section">
		<div class="filter-bar" role="group" aria-label="Filter trips by distance from stadium">
			{#each filters as f}
				<button class:active={filter === f.key} onclick={() => (filter = f.key)}>
					{f.label}
				</button>
			{/each}
		</div>

		<div class="grid">
			{#each games as game (game.date)}
				<GameChart {game} {scopeLabel} />
			{/each}
		</div>
	</div>

	<MethodsSection />

	<div class="footer-icons">
		<div class="footer-icons-inner">
			<IconRow duration={5} />
			<a href="https://schoolofcities.utoronto.ca" target="_blank" rel="noopener" class="footer-logo">
				<img src="{base}/sofc-uoft-logo-white.svg" alt="School of Cities / University of Toronto" />
			</a>
		</div>
	</div>
</main>

<style>
	.viz-root {
		--surface-1: var(--brandDarkGreen);
		--text-primary: var(--brandWhite);
		--text-secondary: rgba(255, 255, 255, 0.75);
		--text-muted: rgba(255, 255, 255, 0.55);
		--grid: rgba(255, 255, 255, 0.12);
		--axis: rgba(255, 255, 255, 0.28);
		--series-target: var(--brandYellow);
		--series-baseline: var(--brandLightBlue);
		--series-target-line: var(--brandYellow);
		--series-baseline-line: var(--brandLightBlue);
		--above-fill: rgba(241, 197, 0, 0.16);
		--below-fill: rgba(111, 199, 234, 0.16);
		--game-band: rgba(255, 255, 255, 0.08);
		--game-band-line: rgba(255, 255, 255, 0.35);
		background-color: var(--brandMedGreen);
	}

	/* ── Hero ── */
	.hero {
		background-color: var(--brandDarkGreen);
		padding-top: 50px;
		padding-bottom: 60px;
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
		font-size: 55px;
		line-height: 1.1;
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

	/* ── Charts section ── */
	.charts-section {
		max-width: 1280px;
		margin: 0 auto;
		padding: 40px 24px 60px;
	}

	.filter-bar {
		display: flex;
		flex-wrap: wrap;
		gap: 2px;
		background: var(--brandDarkGreen);
		border-radius: 6px;
		padding: 3px;
		margin-bottom: 28px;
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

	.grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 28px;
	}

	/* ── Footer icons ── */
	.footer-icons {
		background-color: var(--brandDarkGreen);
		max-width: 100%;
		margin: 50px 0 0;
		padding: 40px 20px;
	}

	.footer-icons-inner {
		max-width: 700px;
		margin: 0 auto;
	}

	.footer-logo {
		display: inline-block;
		margin-top: 56px;
		transition: opacity 0.2s;
	}

	.footer-logo:hover {
		opacity: 0.8;
	}

	.footer-logo img {
		height: 45px;
		width: auto;
		display: block;
	}

	/* ── Responsive ── */
	@media screen and (max-width: 700px) {
		.hero-logo img {
			height: 36px;
		}
		.hero h1 {
			font-size: 34px;
		}
		.hero p {
			font-size: 17px;
		}
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
