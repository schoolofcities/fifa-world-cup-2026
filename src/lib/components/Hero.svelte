<script>
	import { base } from '$app/paths';
	import IconRow from './IconRow.svelte';

	/**
	 * Shared page hero: logo, pulsing icon row, title, lede, arbitrary description
	 * content (via children), and a byline. Callers wrap this in their own `.hero`
	 * div so page-specific background/padding can still vary.
	 */
	let {
		icons = [],
		title,
		lede,
		date,
		author = 'Jeff Allen',
		titleSize = '63px',
		titleSizeMobile = '38px',
		titleLineHeight = '1.0',
		trailingBreaks = 0,
		children,
	} = $props();
</script>

<div
	class="hero-inner"
	style="--hero-title-size: {titleSize}; --hero-title-size-mobile: {titleSizeMobile}; --hero-title-line-height: {titleLineHeight};"
>
	<div class="hero-logo">
		<a href="https://schoolofcities.utoronto.ca" target="_blank" rel="noopener">
			<img src="{base}/sofc-uoft-logo-white.svg" alt="School of Cities / University of Toronto" />
		</a>
	</div>
	<div class="hero-icons">
		<IconRow duration={5} {icons} />
	</div>
	<div class="hero-rule"></div>
	<h1>{title}</h1>
	<p class="hero-lede">{lede}</p><br />
	{@render children?.()}
	<div class="hero-byline">
		<span class="hero-author">By {author}</span>
		<span class="hero-byline-sep">&middot;&middot;&middot;</span>
		<span class="hero-date">{date}</span>
	</div>
	{#each Array(trailingBreaks) as _}<br />{/each}
</div>

<style>
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

	h1 {
		font-family: TradeGothicBold, sans-serif;
		font-size: var(--hero-title-size);
		line-height: var(--hero-title-line-height);
		color: var(--brandWhite);
		margin: 0 0 32px;
		padding: 0;
	}

	:global(.hero-inner p) {
		font-family: OpenSans, sans-serif;
		font-size: 19px;
		line-height: 1.7;
		color: var(--brandWhite);
		margin: 0;
		padding: 0;
		max-width: 100%;
	}

	:global(.hero-inner p.hero-lede) {
		color: var(--brandYellow);
		font-family: OpenSansBoldItalic, sans-serif;
		font-size: 19.5px;
	}

	:global(.hero-inner p a) {
		color: var(--brandWhite);
		text-decoration: underline;
		font-family: inherit;
	}

	:global(.hero-inner p a:hover) {
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

	@media screen and (max-width: 700px) {
		.hero-logo img {
			height: 36px;
		}
		h1 {
			font-size: var(--hero-title-size-mobile);
		}
		:global(.hero-inner p) {
			font-size: 17px;
		}
	}
</style>
