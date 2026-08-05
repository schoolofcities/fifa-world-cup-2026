<script>
	import { base } from '$app/paths';

	const CITIES = [
		{ key: 'toronto', label: 'Toronto, Ont.', venue: 'BMO Field', img: 'match-activity/zoi/toronto.png' },
		{ key: 'vancouver', label: 'Vancouver, B.C.', venue: 'BC Place', img: 'match-activity/zoi/vancouver.png' },
	];

	const legend = [
		{ cls: 'dot', label: 'Stadium & fan zone locations' },
		{ cls: 'buffer', label: 'Match & fan zone (2km buffer)' },
		{ cls: 'csd', label: 'City boundary (CSD)' },
	];
</script>

<div class="zoi-section">
	<div class="zoi-card">
		<div class="zoi-legend">
			{#each legend as l}
				<span class="legend-item">
					<span class="legend-swatch {l.cls}"></span>
					{l.label}
				</span>
			{/each}
		</div>

		<div class="zoi-columns">
			{#each CITIES as c}
				<div class="zoi-column">
					<p class="zoi-label">{c.label}</p>
					<p class="zoi-venue">({c.venue})</p>
					<div class="circle-wrap">
						<img src="{base}/{c.img}" alt="Zone of interest map of {c.label}" />
					</div>
				</div>
			{/each}
		</div>

	</div>
</div>

<style>
	.zoi-section {
		max-width: 1000px;
		margin: 0 auto;
		padding: 0 24px;
	}

	.zoi-card {
		background: var(--brandDarkGreen);
		border-radius: 14px;
		padding: 24px 24px 18px;
	}

	.zoi-columns {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
		margin-top: 18px;
	}

	.zoi-column {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
	}

	.zoi-label {
		font-family: TradeGothicBold, sans-serif;
		font-weight: normal;
		font-size: 28px;
		color: var(--brandWhite);
		margin: 0 0 -10px;
		text-align: center;
	}

	.zoi-venue {
		font-family: OpenSans, sans-serif;
		font-size: 14px;
		color: var(--brandLightGreen);
		margin: 0 0 5px;
		text-align: center;
	}

	.circle-wrap {
		width: 100%;
		max-width: 480px;
		aspect-ratio: 1 / 1;
		border-radius: 50%;
		overflow: hidden;
		border: 2px solid var(--brandYellow);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
	}

	.circle-wrap img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.zoi-legend {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 8px 24px;
		padding-bottom: 14px;
		border-bottom: 1px solid rgba(255, 255, 255, 0.15);
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: 8px;
		font-family: OpenSans, sans-serif;
		font-size: 13px;
		color: rgba(255, 255, 255, 0.85);
		white-space: nowrap;
	}

	.legend-swatch {
		width: 14px;
		height: 14px;
		border-radius: 4px;
		flex-shrink: 0;
	}

	.legend-swatch.buffer {
		background: #e2941f;
	}
	.legend-swatch.csd {
		background: #f1c500;
	}
	.legend-swatch.dot {
		background: #dc4633;
		border: 1.5px solid var(--brandWhite);
		border-radius: 50%;
		width: 11px;
		height: 11px;
	}

	@media screen and (max-width: 600px) {
		.zoi-columns {
			grid-template-columns: 1fr;
			gap: 24px;
		}
		.zoi-card {
			padding: 20px 18px 16px;
		}
	}
</style>
