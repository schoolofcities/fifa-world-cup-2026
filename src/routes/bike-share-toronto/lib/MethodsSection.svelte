<div class="methods">
	<div class="methods-inner">
		<h2>Data &amp; Methods</h2>

		<h3>Data collection</h3>
		<p>Station-level bike availability was collected from Toronto Bike Share's public <a href="https://github.com/MobilityData/gbfs" target="_blank" rel="noopener">GBFS</a> (General Bikeshare Feed Specification) station_status feed, pulled every 5 seconds. Each download compared the current state of every station against its last recorded state; a new row was only written when a station's status actually changed (e.g. its available bike count), producing an event-driven log rather than fixed-interval snapshots.</p>

		<h3>Activity estimation</h3>
		<p>GBFS does not report individual trips directly; it only reports the number of bikes currently available at each station. "Activity" (an estimate of bike departures) was inferred by comparing every consecutive pair of observations at each station and summing the magnitude of every decrease in available bikes across all stations in a given time window. Two corrections were applied to reduce known sources of over-counting:</p>

		<ol>
			<li>Bikes taken out of service: a drop in available bikes that coincided with an equal increase in the station's disabled-bike count (e.g. a bike flagged for maintenance) was excluded, since this reflects an operational action rather than a rider trip.</li>
			<li>Short "flap" events: a single bike departure immediately reversed by a return within 30 seconds at the same station was excluded, since this is more consistent with a false start (e.g. re-docking a bike that has a broken seat) than a real trip.</li>
		</ol>

		<p>This method is a common approach for estimating ridership from GBFS snapshot data (comparable to open-source tools such as <a href="https://github.com/bike-lane-uprising/bikeRACOON" target="_blank" rel="noopener">bikeRACOON</a>), and checking against Bike Share Toronto's own published daily estimates for earlier dates showed our method to have similar results to these other sources, but not exactly the same. Remaining differences could reflect rebalancing-truck movements and definitional differences in what counts as a completed trip. Therefore, data in the charts above should be treated as a relative, comparative measure rather than an exact trip count.</p>

		<h3>Match-day windows</h3>
		<p>For each of six 2026 FIFA World Cup matches, activity was extracted for an 8-hour window spanning 3 hours before kickoff to 3 hours after, with an assumed 2-hour match duration.</p>

		<h3>Baseline comparison</h3>
		<p>For each date of interest, activity was compared to a baseline defined as the average activity in the same 10-minute time-of-day windows across the six most recent occurrences of the same day of the week (e.g. a Thursday is compared to the prior six Thursdays). This controls for typical weekday/weekend demand patterns so that deviations reflect the specific event being studied rather than routine day-of-week variation.</p>

		<h3>Spatial filtering</h3>
		<p>Three versions of the World Cup match-day dataset were produced:</p>

		<ol>
			<li>System-wide &mdash; all bike share stations included.</li>
			<li>1 km radius &mdash; restricted to the 27 stations within 1 kilometer of a fixed reference point of the stadium.</li>
			<li>2 km radius &mdash; restricted to the 91 stations within 2 kilometers of the same point.</li>
		</ol>

		<p>Station distances were computed by projecting station coordinates and the reference point into UTM Zone 17N (EPSG:32617) and calculating straight-line (Euclidean) distance in meters.</p>

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
