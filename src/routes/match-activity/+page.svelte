<script>
	import '$assets/global-styles.css';

	import Hero from '$lib/components/Hero.svelte';
	import FooterIcons from '$lib/components/FooterIcons.svelte';
	import { matchActivityIcons } from '$lib/icons.js';
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
			<p><strong>Coming soon:</strong> this story is still in progress.</p>
		</div>
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
