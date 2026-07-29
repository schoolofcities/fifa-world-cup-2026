<script>
	/** Shared "Data & Methods" section shell; page-specific content is passed as children. */
	let { children } = $props();
</script>

<div class="methods">
	<div class="methods-inner">
		<h2>Data &amp; Methods</h2>
		{@render children?.()}
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

	:global(.methods h3) {
		font-family: TradeGothicBold, sans-serif;
		font-weight: normal;
		font-size: 21px;
		color: var(--brandWhite);
		margin: 28px 0 6px;
		padding: 0;
		text-transform: none;
		letter-spacing: 0.02em;
	}

	:global(.methods p),
	:global(.methods ol),
	:global(.methods li) {
		font-family: OpenSans, sans-serif !important;
		font-size: 16px !important;
		line-height: 1.6 !important;
		color: rgba(255, 255, 255, 0.88) !important;
		margin: 0 0 14px;
		padding: 0;
	}

	:global(.methods ol) {
		padding-left: 20px;
	}

	:global(.methods li) {
		margin-bottom: 6px;
	}

	:global(.methods li::marker) {
		font-family: OpenSansBold, sans-serif;
	}

	:global(.methods a) {
		color: var(--brandWhite);
		font-family: OpenSans, sans-serif;
		text-decoration: underline;
	}

	:global(.methods a:hover) {
		color: var(--brandYellow);
	}
</style>
