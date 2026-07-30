<script>
	import { fitProjection } from '$lib/geo/projection.js';

	let { province, csd, zone2km, cityLabel } = $props();

	const W = 380;
	const H = 380;

	const paths = $derived.by(() => {
		const { path } = fitProjection({
			type: 'mercator',
			fitTo: { type: 'FeatureCollection', features: [csd, zone2km] },
			width: W,
			height: H,
			padding: W * 0.14,
		});
		return {
			province: path(province),
			csd: path(csd),
			zone2km: path(zone2km),
		};
	});
</script>

<div class="zone-map">
	<p class="map-title">{cityLabel}</p>
	<div class="map-frame">
		<svg viewBox="0 0 {W} {H}" style="overflow: hidden">
			<rect class="water" x="0" y="0" width={W} height={H} />
			<path class="province" d={paths.province} />
			<path class="csd" d={paths.csd} />
			<path class="zone-2km" d={paths.zone2km} />
		</svg>
	</div>
</div>

<style>
	.zone-map {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.map-title {
		font-family: TradeGothicBold, sans-serif;
		font-weight: normal;
		font-size: 19px;
		color: var(--brandWhite);
		margin: 0;
		padding: 0;
	}
	.map-frame {
		border-radius: 10px;
		overflow: hidden;
		box-shadow: 0 4px 16px rgba(30, 55, 101, 0.12), 0 1px 4px rgba(30, 55, 101, 0.08);
	}
	svg {
		display: block;
		width: 100%;
		height: auto;
	}
	.water {
		fill: var(--zone-water);
	}
	.province {
		fill: var(--zone-province-fill);
		stroke: var(--zone-province-stroke);
		stroke-width: 1;
	}
	.csd {
		fill: var(--zone-csd-fill);
		stroke: var(--zone-csd-stroke);
		stroke-width: 1.25;
	}
	.zone-2km {
		fill: var(--zone-2km-fill);
		stroke: var(--zone-2km-stroke);
		stroke-width: 1.25;
	}
</style>
