<script>
	import '$assets/global-styles.css';

	import Hero from '$lib/components/Hero.svelte';
	import FooterIcons from '$lib/components/FooterIcons.svelte';
	import MethodsSection from '$lib/components/MethodsSection.svelte';
	import ActivityChartsSection from '$lib/components/matchactivity/ActivityChartsSection.svelte';
	import ZoiMapsSection from '$lib/components/matchactivity/ZoiMapsSection.svelte';
	import OriginsMapsSection from '$lib/components/matchactivity/OriginsMapsSection.svelte';
	import { matchActivityIcons } from '$lib/icons.js';

	let { data } = $props();
</script>

<svelte:head>
	<title>Match Activity</title>

	<meta name="description" content="A closer look at match-day activity across FIFA World Cup 2026 host cities.">
	<meta name="author" content="Yihoi Jung, Aniket Kali">

	<meta property="og:title" content="Match Activity | School of Cities" />
	<meta property="og:description" content="A closer look at match-day activity across FIFA World Cup 2026 host cities." />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://schoolofcities.github.io/fifa-world-cup-2026/match-activity" />
	<meta property="og:image" content="https://raw.githubusercontent.com/schoolofcities/fifa-world-cup-2026/main/static/web-card-match-activity.png" />
	<meta property="og:locale" content="en_CA">

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="https://schoolofcities.github.io/fifa-world-cup-2026/match-activity" />
	<meta name="twitter:title" content="Match Activity | School of Cities" />
	<meta name="twitter:description" content="A closer look at match-day activity across FIFA World Cup 2026 host cities." />
	<meta name="twitter:image" content="https://raw.githubusercontent.com/schoolofcities/fifa-world-cup-2026/main/static/web-card-match-activity.png" />
</svelte:head>

<main>
	<!-- Hero header -->
	<div class="hero">
		<Hero
			icons={matchActivityIcons}
			title="Visitation Activity Across Matches"
			lede="The recent soccer matches looked more like any old day in both Toronto and Vancouver"
			date="2026"
			author="Yihoi Jung, Aniket Kali"
		>
			<p>
				We looked at mobile activity around the stadiums and fan zones during World Cup matches in Toronto and Vancouver – how much it changed, and where visitors came from – to see just how prominent these matches were.
			</p>
		</Hero>
	</div>

	<!-- Article intro -->
	<div class="section-intro">
		<p>
			It was the first time that Canada had hosted the FIFA Men's World Cup &ndash; to much fanfare and trepidation. Toronto invested in transit infrastructure to get ahead of congestion woes, and Vancouver renovated its stadium and expanded pedestrian zones.
		</p>
		<p>
			In the end, did the effort match visitors to the cities and their matches? We took a look at visitor activity during the recent soccer matches from Canada and the US only &ndash; how many people came, how it compared to times before, and where they came from &ndash; to find out just how prominent these matches were.
		</p>
		<p>
			We drew two catchment areas for visitors: first, the two-kilometre zones around the match stadium and fan zones, and second, the whole of the host city, shown below. Using mobile activity records, we counted those individuals that fell in these catchments.
		</p>
	</div>
	<ZoiMapsSection />

	<div class="section-intro">
		<p>
			Counting the number of visits to these zones from June 1st to July 10th &ndash; encapsulating all soccer matches in both cities &ndash; we compare them to about five weeks prior, as well as the same date one year ago, plotted below.
		</p>
		<p>
			Activity is mostly up compared to five weeks prior, but this may be a result of the weather warming up. Perhaps surprisingly, compared to the same date in 2025, activity is just about the same and many days lower, with a lack of noticeable spikes on match days.
		</p>
	</div>
	<ActivityChartsSection />

	<div class="section-intro">
		<p>
			Even if visitation trends did not spike for matches in either city, there still were visitors. Where did they come from &ndash; nearby or from afar?
		</p>
		<p>
			Overwhelmingly, visitors on match days were local: largely from the host cities themselves, with a modest amount from their metropolitan regions, and a trickle coming from other provinces or the United States, as shown below.
		</p>
	</div>
	<OriginsMapsSection geo={data.geo} />

	<div class="section-intro">
		<p>
			And so another set of soccer matches came and went through Toronto and Vancouver. Despite the anticipation and the worries, it looked more like just another day in the city than a major attraction.
		</p>
	</div>

	<div class="ma-methods">
	<MethodsSection>
		<h3>Mobile activity data</h3>
		<p>We used anonymized mobile activity data provided by Cuebiq, which aggregates a sample of location records collected by mobility data providers. Because the data represent only a subset of mobile devices and include privacy-preserving noise, the results should be interpreted as broad patterns rather than precise counts of people.</p>
		<p>We examined three 40-day periods, with two comparison periods to distinguish activity related to the tournament:</p>
		<ol>
			<li>World Cup period: June 1 to July 10, 2026</li>
			<li>Five-week baseline: April 22 to May 31, 2026</li>
			<li>Previous-year baseline: June 1 to July 10, 2025</li>
		</ol>

		<h3>Areas of interest</h3>
		<p>We measured activity within two types of areas to capture venue visitors and the surrounding areas. The first consisted of two-kilometre buffers around the match stadium and official fan zone in each host city.</p>
		<p>We tested several alternative buffer sizes &ndash; 100 metres, 200 metres, 500 metres, 1 kilometre, 2 kilometres, 5 kilometres, and 10 kilometres &ndash; and found similar overall patterns. We therefore used the 2-kilometre buffers as a balance between capturing event-related activity and limiting unrelated activity elsewhere in the city.</p>
		<p>For a broader comparison, we also measured activity across the full municipal boundaries of Toronto and Vancouver, using Statistics Canada census subdivision (CSD) boundaries.</p>

		<h3>Activity trends</h3>
		<p>For each area, we compared daily activity during the World Cup period with the corresponding days in the two baseline periods. We initially explored an hourly breakdown of activity, but the available sample was not large enough to support reliable hour-by-hour estimates.</p>
		<p>We do not report raw device or visitor counts as the data is a subsample of the population and to preserve privacy. Instead, the charts show normalized activity values that permit comparison.</p>

		<h3>Visitor origins</h3>
		<p>We also examined the estimated home origins of visitors observed within the stadium and fan-zone catchments on match days. Origins were available for Canada, excluding Quebec, and for the United States. Visitors from other countries are therefore not represented, even though international visitors from outside Canada and the United States undoubtedly attended the tournament.</p>
		<p>Within Canada, we examined origins at two geographic scales: the Toronto and Vancouver census metropolitan areas (CMA), and Canada's provinces and territories. The United States was included as a single origin category. This allowed us to distinguish visitors from the host city, the surrounding metropolitan region, other parts of Canada, and the United States.</p>
		<p>For each origin, we calculated its average percentage of observed visits across match days. These figures describe the composition of recorded visitor activity rather than the total number of individual visitors.</p>

		<h3>Limitations</h3>
		<p>Mobile activity data are an indirect and incomplete measure of visitation. They capture only devices represented in Cuebiq's sample, and privacy protections introduce additional noise into the data. A recorded device within a catchment also cannot be assumed to represent someone attending a World Cup event.</p>
		<p>The consistency of the results across multiple buffer sizes suggests that the broad findings are not driven solely by the precise boundaries selected. Nevertheless, the activity and origin estimates should be understood as approximate indicators of relative patterns, not comprehensive attendance figures.</p>
	</MethodsSection>
	</div>

	<div class="footer-icons">
		<FooterIcons icons={matchActivityIcons} />
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

	.hero :global(p) {
		margin-bottom: 16px;
	}

	.hero :global(p:last-child) {
		margin-bottom: 0;
	}

	/* ── Section intros ── */
	.section-intro {
		max-width: 700px;
		margin: 0 auto;
		padding: 44px 24px;
	}

	.section-intro p {
		font-family: OpenSans, sans-serif;
		font-size: 18px;
		line-height: 1.65;
		color: rgba(255, 255, 255, 0.9);
		margin: 0 0 12px;
		padding: 0;
		text-align: left;
	}

	.section-intro p:last-child {
		margin-bottom: 0;
	}

	/* ── Footer icons ── */
	.footer-icons {
		max-width: 700px;
		margin: 50px auto 0;
		padding: 0 20px;
	}

	/* ── Data & Methods (scoped to this page only; MethodsSection is shared) ── */
	:global(.ma-methods .methods-inner p),
	:global(.ma-methods .methods-inner li) {
		font-size: 17px !important;
	}

	/* MethodsSection's own 60px top margin is redundant here - the preceding closing paragraph
	   already carries the standard 44px bottom padding, so this would otherwise nearly double
	   the gap compared to every other paragraph-to-visual transition on the page. */
	:global(.ma-methods .methods) {
		margin-top: 0 !important;
	}
</style>
