<script>
	import '$assets/global-styles.css';

	import Hero from '$lib/components/Hero.svelte';
	import FooterIcons from '$lib/components/FooterIcons.svelte';
	import MethodsSection from '$lib/components/MethodsSection.svelte';
	import ActivityChartsSection from '$lib/components/matchactivity/ActivityChartsSection.svelte';
	import ZonesMapSection from '$lib/components/matchactivity/ZonesMapSection.svelte';
	import OriginsMapsSection from '$lib/components/matchactivity/OriginsMapsSection.svelte';
	import { matchActivityIcons } from '$lib/icons.js';

	let { data } = $props();
</script>

<svelte:head>
	<title>Match Activity</title>

	<meta name="description" content="A closer look at match-day activity across FIFA World Cup 2026 host cities.">
	<meta name="author" content="Jeff Allen">

	<meta property="og:title" content="Match Activity | School of Cities" />
	<meta property="og:description" content="A closer look at match-day activity across FIFA World Cup 2026 host cities." />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://schoolofcities.github.io/fifa-world-cup-2026/match-activity" />
	<meta property="og:locale" content="en_CA">

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="https://schoolofcities.github.io/fifa-world-cup-2026/match-activity" />
	<meta name="twitter:creator" content="@JeffAllenMaps" />
	<meta name="twitter:title" content="Match Activity | School of Cities" />
	<meta name="twitter:description" content="A closer look at match-day activity across FIFA World Cup 2026 host cities." />
</svelte:head>

<main>
	<!-- Hero header -->
	<div class="hero">
		<Hero
			icons={matchActivityIcons}
			title="Match Activity"
			lede="What did match days look like across FIFA World Cup 2026 host cities?"
			date="2026"
		>
			<p>
				This page is under construction. Check back soon for a closer look at match-day activity during the 2026 World Cup.
			</p>
		</Hero>
	</div>

	<!-- Placeholder note -->
	<div class="placeholder-note">
		<div class="placeholder-note-inner">
			<p><strong>Coming soon:</strong> the visualizations below are in place, but all of the surrounding text (including this note and the Data & Methods section) is placeholder copy.</p>
		</div>
	</div>

	<!-- Zones of interest -->
	<div class="section-intro">
		<h2>Zones of interest</h2>
		<p>
			<em>Placeholder text.</em> For both Toronto and Vancouver, we looked at match-day activity two ways: in a tight ring around the stadium and official fan zone, and across the city as a whole. The maps below show how those two areas compare.
		</p>
	</div>
	<ZonesMapSection geo={data.geo} />

	<!-- Activity over time -->
	<div class="section-intro">
		<h2>Activity over time</h2>
		<p>
			<em>Placeholder text.</em> How did daily activity during the tournament compare to a quieter baseline period earlier in 2026, and to the same weeks one year earlier? Match days stand out as clear spikes above both baselines.
		</p>
	</div>
	<ActivityChartsSection />

	<!-- Where visitors came from -->
	<div class="section-intro">
		<h2>Where visitors came from</h2>
		<p>
			<em>Placeholder text.</em> Most match-day activity came from close by, but a meaningful share travelled from across the metro area, and from further afield across Canada and the US. The maps below break that down by distance.
		</p>
	</div>
	<OriginsMapsSection geo={data.geo} />

	<MethodsSection>
		<h3>Data collection</h3>
		<p><em>Placeholder &mdash; methods write-up coming soon.</em> This section will describe the source of the underlying activity and origin data, how it was aggregated, and any limitations worth flagging.</p>

		<h3>Zones of interest</h3>
		<p><em>Placeholder.</em> This section will describe how the 2km stadium &amp; fan-zone buffer and the city (CSD) boundary were defined for each host city.</p>

		<h3>Baseline periods</h3>
		<p><em>Placeholder.</em> This section will describe how the pre-tournament and prior-year baseline periods were chosen and matched to the 2026 World Cup dates.</p>

		<h3>Origins</h3>
		<p><em>Placeholder.</em> This section will describe how visitor origins were estimated and aggregated to the census subdivision, metro, and province/state levels shown above.</p>
	</MethodsSection>

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

	/* ── Section intros ── */
	.section-intro {
		max-width: 700px;
		margin: 0 auto;
		padding: 60px 24px 30px;
	}

	.section-intro h2 {
		font-family: TradeGothicBold, sans-serif;
		font-weight: normal;
		font-size: 28px;
		color: var(--brandWhite);
		margin: 0 0 12px;
		padding: 0;
		text-align: left;
	}

	.section-intro p {
		font-family: OpenSans, sans-serif;
		font-size: 16px;
		line-height: 1.6;
		color: rgba(255, 255, 255, 0.9);
		margin: 0;
		padding: 0;
		text-align: left;
	}

	.section-intro p em {
		font-family: OpenSansItalic, sans-serif;
		font-style: normal;
		color: var(--brandLightGreen);
	}

	/* ── Placeholder note ── */
	.placeholder-note {
		max-width: 700px;
		margin: 60px auto 60px;
		padding: 0 24px;
	}

	.placeholder-note-inner {
		border-left: 4px solid var(--brandDarkBlue);
		padding: 14px 20px;
		background-color: var(--brandDarkGreen);
		border-radius: 0 6px 6px 0;
	}

	.placeholder-note p {
		font-family: OpenSans, sans-serif;
		font-size: 14px;
		line-height: 1.6;
		color: var(--brandWhite);
		margin: 0;
		padding: 0;
	}

	.placeholder-note strong {
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
</style>
