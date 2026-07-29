<script>
	import '$assets/global-styles.css';

	import Hero from '$lib/components/Hero.svelte';
	import FooterIcons from '$lib/components/FooterIcons.svelte';
	import MethodsSection from '$lib/components/MethodsSection.svelte';
	import GameChart from '$lib/components/bikeshare/GameChart.svelte';
	import { bikeShareIcons } from '$lib/icons.js';

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
		<Hero
			icons={bikeShareIcons}
			title="Bike Share activity during World Cup match days"
			lede="How did Bike Share activity change around Toronto's World Cup matches?"
			date="07/2026"
			titleSize="55px"
			titleSizeMobile="34px"
			titleLineHeight="1.1"
			trailingBreaks={2}
		>
			<p>
				We estimated the number of Bike Share trips before, during, and after FIFA World Cup 2026 matches in Toronto. The charts below show spikes of activity after matches end, especially for Bike Share stations near the stadium.
			</p>
		</Hero>
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

	<MethodsSection>
		<h3>Data collection</h3>
		<p>Station-level bike availability was collected from <a href="https://open.toronto.ca/dataset/bike-share-toronto/" target="_blank" rel="noopener">Toronto Bike Share</a>'s public GBFS (General Bikeshare Feed Specification) station_status feed, pulled every 5 seconds. Each download compared the current state of every station against its last recorded state; a new row was only written when a station's status changed, producing an event-driven log dataset, rather than fixed-interval snapshots.</p>

		<h3>Trip estimation</h3>
		<p>The source data does not report individual trips directly; it only reports the number of bikes currently available at each station. Number of trips were inferred by comparing every consecutive pair of observations at each station and summing the magnitude of every decrease in available bikes (i.e. this assumes a trip is started if a Bike Share station decreases its number of bikes in a 5 second window). Two corrections were applied to reduce potential sources of over-counting:</p>

		<ol>
			<li>Bikes taken out of service: a drop in available bikes that coincided with an equal increase in the station's disabled-bike count (e.g. a bike flagged for maintenance) was excluded, since this reflects an operational action rather than a rider trip.</li>
			<li>Short return events: a single bike departure immediately reversed by a return within 30 seconds at the same station was excluded, since this is more consistent with a false start (e.g. re-docking a bike that has a broken seat) than a real trip.</li>
		</ol>

		<p>Checking against Bike Share Toronto's own published daily estimates for earlier dates, as well as comparing with open-source tools such as <a href="https://github.com/mjarrett/bikeraccoonAPI" target="_blank" rel="noopener">BikeRaccoon</a>, showed our method to have similar results to these other sources, but not precisely the same numbers. Remaining differences could reflect rebalancing-truck movements and definitional differences in what counts as a completed trip. Therefore, data in the charts above should be treated as a relative, comparative measure rather than an exact super precise trip count.</p>

		<h3>Match-day windows</h3>
		<p>For each of the six 2026 FIFA World Cup matches in Toronto, activity was extracted for an 8-hour window spanning 3 hours before kickoff to 3 hours after, with an assumed 2-hour match duration. (None of the games went to extra time, but the Portugal-Croatia game had substantial added time at the end of the second half that might have pushed beyond the 2 hour window. It was an exciting game!)</p>

		<h3>Baseline comparison</h3>
		<p>For each date of interest, activity was compared to a baseline defined as the average activity in the same time-of-day windows across the six most recent occurrences of the same day of the week (e.g. a Thursday is compared to the prior six Thursdays). This controls for typical weekday/weekend demand patterns so that deviations reflect the specific event being studied rather than routine day-of-week variation.</p>

		<h3>Spatial filtering</h3>
		<p>Three versions of the World Cup match-day dataset were produced:</p>

		<ul>
			<li>System-wide &mdash; all bike share stations included.</li>
			<li>1 km radius &mdash; restricted to the 27 stations within 1 kilometer of a fixed reference point of the stadium.</li>
			<li>2 km radius &mdash; restricted to the 91 stations within 2 kilometers of the same point.</li>
		</ul>
		<br>

		<p>Station distances were computed by projecting station coordinates and the reference point into UTM Zone 17N (EPSG:32617) and calculating straight-line (Euclidean) distance in meters.</p>
	</MethodsSection>

	<div class="footer-icons">
		<div class="footer-icons-inner">
			<FooterIcons icons={bikeShareIcons} />
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

	/* ── Responsive ── */
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
