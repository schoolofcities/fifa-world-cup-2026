<div class="methods">
	<div class="methods-inner">
		<h2>Data &amp; Methods</h2>

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

	</div>
</div>

<style>
	.methods {
		background-color: var(--brandDarkGreen);
		padding: 60px 20px 80px;
		margin-top: 60px;
	}

	.methods-inner {
		max-width: 700px;
		margin: 0 auto;
	}

	.methods h2 {
		font-family: TradeGothicBold, sans-serif;
		font-weight: normal;
		font-size: 22px;
		color: var(--brandYellow);
		margin: 0 0 24px;
		padding: 0;
		text-transform: none;
		letter-spacing: 0.02em;
	}

	.methods h3 {
		font-family: TradeGothicBold, sans-serif;
		font-weight: normal;
		font-size: 21px;
		color: var(--brandWhite);
		margin: 28px 0 6px;
		padding: 0;
		text-transform: none;
		letter-spacing: 0.02em;
	}

	.methods p,
	.methods ol,
	.methods li {
		font-family: OpenSans, sans-serif !important;
		font-size: 16px !important;
		line-height: 1.6 !important;
		color: rgba(255, 255, 255, 0.88) !important;
		margin: 0 0 14px;
		padding: 0;
	}

	.methods ol {
		padding-left: 20px;
	}

	.methods li {
		margin-bottom: 6px;
	}

	.methods li::marker {
		font-family: OpenSansBold, sans-serif;
	}

	.methods a {
		color: var(--brandWhite);
		font-family: OpenSans, sans-serif;
		text-decoration: underline;
	}

	.methods a:hover {
		color: var(--brandYellow);
	}
</style>
