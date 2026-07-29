<script>
	import '$assets/global-styles.css';
	import { base } from '$app/paths';
	import { flip } from 'svelte/animate';

	import Hero from '$lib/components/Hero.svelte';
	import FooterIcons from '$lib/components/FooterIcons.svelte';
	import MethodsSection from '$lib/components/MethodsSection.svelte';
	import StadiumCard from '$lib/components/stadiums/StadiumCard.svelte';
	import { transitIcons } from '$lib/icons.js';
	import { stadiumBase } from '$data/stadiums.js';

	let { data } = $props();

	const countryName = { USA: 'USA', MEX: 'Mexico', CAN: 'Canada' };

	const stadiums = $derived(
		stadiumBase.map((s) => ({
			...s,
			...(data.stats[s.id] ?? {}),
			popInIsochrone: data.stats[s.id]?.popInIsochrone ?? null,
			pctInIsochrone: data.stats[s.id]?.pctInIsochrone ?? null,
		}))
	);

	let sortKey = $state('pop');

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


<svelte:head>

	<title>Transit-Oriented Stadiums</title>

	<meta name="description" content="How well are FIFA World Cup 2026 stadiums connected to their host cities by public transit?">
	<meta name="author" content="Jeff Allen">

	<meta property="og:title" content="Transit-Oriented Stadiums | School of Cities" />
	<meta property="og:description" content="How well are FIFA World Cup 2026 stadiums connected to their host cities by public transit?" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://schoolofcities.github.io/fifa-world-cup-2026/transit-oriented-stadiums" />
	<meta property="og:image" content="https://raw.githubusercontent.com/schoolofcities/fifa-world-cup-2026/main/static/web-card-transit-oriented-stadiums.png" />
	<meta property="og:locale" content="en_CA">

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="https://schoolofcities.github.io/fifa-world-cup-2026/transit-oriented-stadiums" />
	<meta name="twitter:creator" content="@JeffAllenMaps" />
	<meta name="twitter:title" content="Transit-Oriented Stadiums | School of Cities" />
	<meta name="twitter:description" content="How well are FIFA World Cup 2026 stadiums connected to their host cities by public transit?" />
	<meta name="twitter:image" content="https://raw.githubusercontent.com/schoolofcities/fifa-world-cup-2026/main/static/web-card-transit-oriented-stadiums.png" />

</svelte:head>



<main>
	<!-- Hero header -->
	<div class="hero">
		<Hero
			icons={transitIcons}
			title="Transit-Oriented Stadiums"
			lede="How well are FIFA World Cup 2026 stadiums connected to their host cities by public transit?"
			date="06/2026"
		>
			<p>
				We mapped how far you can travel in 60 minutes by public transit around every stadium. Then we estimated how much of each metro's population lives within this area. The maps and data show that cities vary widely in how connected their stadiums are to the rest of the city via public transit.
			</p>
		</Hero>
	</div>

	<!-- Sort controls + cards section -->
	<div class="cards-section">
		<div class="controls-bar">
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
			<div class="sort-bar">
				<span class="sort-label">Sort by</span>
				<div class="sort-buttons" role="group" aria-label="Sort stadiums by">
					<button
						class:active={sortKey === 'name'}
						onclick={() => (sortKey = 'name')}
					>Stadium name</button>
					<button
						class:active={sortKey === 'pop'}
						onclick={() => (sortKey = 'pop')}
					>Population reached</button>
					<button
						class:active={sortKey === 'pct'}
						onclick={() => (sortKey = 'pct')}
					>% of population within 25 km</button>
				</div>
			</div>
		</div>

		<!-- Stadium cards -->
		<div class="cards-grid">
			{#each sorted as s (s.id)}
				<div class="card-wrapper" animate:flip={{ duration: 400 }}>
					<StadiumCard stadium={s} {countryName} />
				</div>
			{/each}
		</div>
	</div>

	<!-- Monterrey note -->
	<div class="monterrey-note">
		<div class="monterrey-note-inner">
			<p><strong>Note on Monterrey:</strong> Estadio BBVA (Guadalupe, NL) is not included in this analysis as we were unable to find GTFS for transit agencies in the region.</p>
		</div>
	</div>

	<MethodsSection>
		<p>
			In brief, we ...
		</p>

		<ol>
			<li>Built multi-modal (transit + walk) routing networks for each metro area.</li>
			<li>Used these networks to generate 60-minute <a href="https://en.wikipedia.org/wiki/Isochrone_map" target="_blank" rel="noopener">isochrones</a> around each stadium.</li>
			<li>Overlaid the isochrones with population data to estimate the total number and share of metro residents within each catchment.</li>
		</ol>

		<p>The following goes into detail for each step, as well as summarizes limitations in the data and methods.</p>

		<h3>Transit networks</h3>
		<p>We built routing networks using <a href="https://ipeagit.github.io/r5r/" target="_blank" rel="noopener">r5r</a>, an R package that allows for large scale multimodal <a href="https://en.wikipedia.org/wiki/Network_analysis_(spatial)" target="_blank" rel="noopener">network analysis</a>. For each stadium, we assembled the relevant <a href="https://www.openstreetmap.org" target="_blank" rel="noopener">OpenStreetMap</a> street network (downloaded by state or province as <a href="https://wiki.openstreetmap.org/wiki/PBF_Format" target="_blank" rel="noopener">PBF files</a> from <a href="https://download.geofabrik.de/" target="_blank" rel="noopener">Geofabrik</a> and clipped to each stadium's 50 km buffer) alongside all available <a href="https://en.wikipedia.org/wiki/GTFS" target="_blank" rel="noopener">GTFS</a> feeds for transit agencies serving the region. We sourced GTFS feeds from transit agency open-data portals, <a href="https://database.mobilitydata.org/" target="_blank" rel="noopener">MobilityDatabase</a>, and <a href="https://www.transit.land/" target="_blank" rel="noopener">Transitland</a>. For smaller routes where no published feed existed, we constructed feeds manually from publicly available route and schedule data (for example, a planned event shuttle network in Arlington (Dallas Stadium), and the recently opening SITEUR Mi Macro Línea 5 in Guadalajara). The result is a network dataset that can be used for routing and travel time estimates that account for walking to/from stops, waiting for a transit vehicle, in-vehicle travel times, and any transferring between vehicles necessary.</p>

		<h3>Isochrones</h3>
		<p>We computed transit isochrones for each stadium at 15, 30, 45, and 60-minute travel time thresholds. These travel times account for walking to/from stops, waiting for a transit vehicle, in-vehicle travel time, and any transferring between routes. We used a departure time of 5 p.m. local time on Tuesday, June 9, 2026. This is approximately representative of a weekday evening during the tournament's group stage. To account for uncertainty in exactly when someone might leave, we sampled departures across a 120-minute window centred on that time and used the 33rd-percentile travel time within this window. This reflects what most fans with a rough sense of the schedule could reliably achieve, rather than an optimistic best-case trip where you arrive at the stop just as a vehicle departs. We set walk speed to 4.5 km/h with a maximum walking time of 60 minutes (i.e. if there is no public transit present, then the map would result in a 60-minute walking isochrone).</p>

		<h3>Population</h3>
		<p>We estimated population within each isochrone by summing <a href="https://www.worldpop.org/" target="_blank" rel="noopener">WorldPop</a> R2025A (2025 estimates, 100m resolution) raster cells that fall within the 60-minute transit isochrone polygon. We derived metro-level population denominators used to calculate the percentage of the metro population reachable from 25 km buffers around each stadium, also intersected with the WorldPop grid. All spatial operations used area-equidistant projections centred on each stadium to minimize distortion in distance and area measurements.</p>

		<h3>Limitations</h3>

		<p>These results reflect a simulated departure window of 5–7 p.m. local time on a single Tuesday in June 2026. Outcomes could differ significantly for morning kick-offs, weekend matches, or cities where evening transit frequency drops sharply after the peak hour.</p>

		<p>Our routing model assumes all access to transit is on foot. In practice, people also cycle, drive to park-and-ride facilities, or use taxi and rideshare drop-offs at stations. Each of these could extend the effective catchment area. We sourced pedestrian networks from OpenStreetMap, which may not fully represent all walkable paths. Missing footpaths or crossings can cause the routing engine to underestimate walkable access to transit stops. These factors may underestimate the size of isochrones.</p>

		<p>Our analysis does not account for financial cost, physical accessibility, or other barriers to public transit use. A person may live within a 60-minute transit isochrone and still face obstacles (e.g. unaffordable fares, inaccessible stations, language barriers, or wayfinding difficulties) that may increase travel times or cause someone to not take public transit at all. Therefore, treat the reachable population figures as an upper bound on who could use public transit, not who potentially would.</p>

		<p>Similarly, travel time estimations are based on published schedules, but does not account for real-world delays. For example, buses or trams in mixed traffic are often slowed by traffic congestion, meaning actual travel times could exceed our estimates (especially shortly after events). </p>

		<p>
		We did try to include event service enhancements (e.g. trains serving MetLife Stadium, or the planned shuttle network in Arlington), but some services may have been missed and any very recent changes announced after we built the networks would not be reflected. GTFS feed coverage also varies by city, and some smaller or informal transit operators may not be represented.</p>

		<p>Population figures are modeled estimates for 2025 rather than census counts which occur at different years in each country. We approximated metro boundaries using fixed-radius buffers rather than official metropolitan area definitions. The 25 km buffer was selected for consistency (since metro area boundaries can vary substantially in what is considered as part of the metro area). But using a 25 km buffer arguably would under-count the metro population when a stadium sits near the edge or outside the urban core. For example, Boston Stadium (Gillette Stadium) is located in Foxborough, roughly 40 km south of downtown Boston, so most of the Boston metro falls outside the buffer. Similarly, Estadio Azteca sits on the southern edge of Mexico City, meaning a substantial portion of the urban area's roughly 23 million residents live beyond the 25 km radius.</p>

		<p>We assigned population to isochrone polygons using <a href="https://en.wikipedia.org/wiki/Areal_interpolation" target="_blank" rel="noopener">areal interpolation</a>, which assumes population is distributed uniformly within each 100 metre cell. This may over- or under-count in areas where the isochrone edge cuts through zones with uneven population density such as parks, industrial or commercial areas, or grid cells that contain rivers or water bodies.</p>
	</MethodsSection>
	<div class="footer-icons">
		<FooterIcons icons={transitIcons} />
	</div>
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

	/* ── Cards section ── */
	.cards-section {
		max-width: 1600px;
		margin: 0 auto;
		padding: 0 24px;
	}

	/* ── Controls bar (legend + sort on one row) ── */

	.controls-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 12px;
		padding: 28px 24px 16px;
		max-width: 1600px;
		margin: 0 auto;
		box-sizing: border-box;
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: 8px;
		flex: 1;
		min-width: 0;
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

	.sort-bar {
		display: flex;
		align-items: center;
		gap: 10px;
		min-width: 0;
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
		width: 496px;
		margin-right: 4px;
	}

	.sort-buttons button {
		background: transparent;
		border: none;
		padding: 6px 10px;
		font-family: OpenSans, sans-serif;
		font-size: 13px;
		color: var(--brandLightGreen);
		cursor: pointer;
		border-radius: 4px;
		transition: background-color 0.12s, color 0.12s;
		flex: 1;
		text-align: center;
		white-space: nowrap;
	}


	@media (max-width: 900px) {
		.controls-bar {
			flex-direction: column;
			align-items: center;
		}
		.sort-bar {
			width: 496px;
			max-width: 100%;
			justify-content: center;
		}
		.sort-bar {
			flex-direction: column;
			align-items: center;
		}
		.sort-buttons {
			width: 100%;
		}
	}

	@media (max-width: 700px) {
		.controls-bar {
			flex-direction: column;
			align-items: flex-start;
		}
		.sort-bar {
			width: 100%;
		}
		.sort-buttons {
			width: 100%;
		}
		.sort-buttons button {
			font-size: clamp(8px, 2.8vw, 13px);
			padding: 6px 2px;
			white-space: normal;
		}
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
		grid-template-columns: repeat(auto-fill, 500px);
		gap: 20px;
		justify-content: center;
		align-items: stretch;
	}

	.card-wrapper {
		display: flex;
		flex-direction: column;
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

	/* ── Footer icons ── */
	.footer-icons {
		max-width: 700px;
		margin: 50px auto 0;
		padding: 0 20px;
	}

	/* ── Responsive ── */
	@media screen and (max-width: 700px) {
		.cards-grid {
			grid-template-columns: min(500px, 100%);
		}
	}
</style>
