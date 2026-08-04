<script>
	import '$assets/global-styles.css';
	import { base } from '$app/paths';

	import Hero from '$lib/components/Hero.svelte';
	import FooterIcons from '$lib/components/FooterIcons.svelte';
	import { homeIcons } from '$lib/icons.js';

	const links = [
		{
			href: `${base}/transit-oriented-stadiums`,
			title: 'Transit-Oriented Stadiums',
			description:
				"How well are FIFA World Cup 2026 stadiums connected to their host cities by public transit?",
		},
		{
			href: `${base}/bike-share-toronto`,
			title: 'Bike Share activity during World Cup match days',
			description:
				'How did Bike Share activity in Toronto change on FIFA World Cup 2026 match days, compared to a typical day?',
		},
		{
			href: `${base}/match-activity`,
			title: 'Visitation Activity Across Matches',
			description: 'A closer look at activity trends across Toronto and Vancouver around all matches.',
		},
	];
</script>

<svelte:head>
	<title>FIFA World Cup 2026 | School of Cities</title>

	<meta name="description" content="Data stories about transit, mobility, and host cities during the 2026 FIFA World Cup.">
	<meta name="author" content="Jeff Allen, Yihoi Jung, Aniket Kali">

	<meta property="og:title" content="FIFA World Cup 2026 | School of Cities" />
	<meta property="og:description" content="Data stories about transit, mobility, and host cities during the 2026 FIFA World Cup." />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://schoolofcities.github.io/fifa-world-cup-2026/" />
	<meta property="og:locale" content="en_CA">

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="https://schoolofcities.github.io/fifa-world-cup-2026/" />
	<meta name="twitter:title" content="FIFA World Cup 2026 | School of Cities" />
	<meta name="twitter:description" content="Data stories about transit, mobility, and host cities during the 2026 FIFA World Cup." />
</svelte:head>

<main>
	<!-- Hero header -->
	<div class="hero">
		<Hero
			icons={homeIcons}
			title="FIFA World Cup 2026: Cities in Motion"
			lede="Data stories about transit, mobility, and activity during the 2026 World Cup."
			date="2026"
			author='Jeff Allen, Yihoi Jung, Aniket Kali'
		>
			<p>
				This is a collection of data stories from School of Cities exploring how FIFA World Cup 2026 host cities move: from how well stadiums connect to public transit, to how Bike Share activity shifts around match days. Explore the stories below.
			</p>
		</Hero>
	</div>

	<!-- Link cards -->
	<div class="links-section">
		<div class="links-grid">
			{#each links as link}
				<a class="link-card" href={link.href}>
					<h2>{link.title}</h2>
					<p>{link.description}</p>
					<span class="link-cta">Explore &rarr;</span>
				</a>
			{/each}
		</div>
	</div>

	<div class="footer-icons">
		<FooterIcons icons={homeIcons} />
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
		padding-bottom: 80px;
		padding-left: 20px;
		padding-right: 20px;
	}

	/* ── Link cards ── */
	.links-section {
		max-width: 1100px;
		margin: 0 auto;
		padding: 60px 24px 0;
	}

	.links-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 24px;
	}

	.link-card {
		display: flex;
		flex-direction: column;
		border-radius: 10px;
		padding: 28px 26px 26px;
		background: var(--brandDarkGreen);
		box-shadow: 0 4px 16px rgba(30, 55, 101, 0.12), 0 1px 4px rgba(30, 55, 101, 0.08);
		text-decoration: none;
		transition: transform 0.15s, box-shadow 0.15s;
	}

	.link-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 10px 28px rgba(30, 55, 101, 0.2), 0 2px 6px rgba(30, 55, 101, 0.12);
	}

	.link-card h2 {
		font-family: TradeGothicBold, sans-serif;
		font-weight: normal;
		font-size: 21px;
		color: var(--brandWhite);
		margin: 0 0 10px;
		padding: 0;
		text-align: left;
		line-height: 1.2;
	}

	.link-card p {
		font-family: OpenSans, sans-serif;
		font-size: 14px;
		line-height: 1.6;
		color: rgba(255, 255, 255, 0.85);
		margin: 0;
		padding: 0;
		flex: 1;
	}

	.link-cta {
		font-family: OpenSansBold, sans-serif;
		font-size: 13px;
		color: var(--brandYellow);
		margin-top: 18px;
	}

	/* ── Footer icons ── */
	.footer-icons {
		max-width: 700px;
		margin: 80px auto 0;
		padding: 0 20px;
	}
</style>
