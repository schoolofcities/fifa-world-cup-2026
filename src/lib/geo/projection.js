import { geoMercator, geoConicConformal, geoPath } from 'd3-geo';

// Fits a projection (and its accompanying SVG path generator) to a set of GeoJSON features
// within a width x height viewport. Pass `fitTo` instead of relying on `features`' own extent
// when the visible crop should be wider/narrower than the data itself (e.g. a North America map
// that deliberately shows more ocean/sky than its features strictly need).
export function fitProjection({ type = 'mercator', features, fitTo, width, height, padding = 0, parallels, rotate }) {
	const wrap = (f) => (Array.isArray(f) ? { type: 'FeatureCollection', features: f } : f);
	const extentTarget = wrap(fitTo ?? features);

	const projection = type === 'conicConformal' ? geoConicConformal() : geoMercator();
	if (parallels) projection.parallels(parallels);
	if (rotate) projection.rotate(rotate);
	projection.fitExtent(
		[
			[padding, padding],
			[width - padding, height - padding],
		],
		extentTarget
	);

	const path = geoPath(projection);
	return { projection, path };
}

// A rectangular GeoJSON Polygon in lon/lat, used purely as a `fitTo` target to control
// how a projection is framed without needing that shape to be rendered itself.
//
// Ring winding: d3-geo's spherical bounds/fitExtent code needs this ring wound clockwise in
// lon/lat (x,y) terms - the opposite of the standard planar/RFC-7946 counterclockwise
// convention - or it (silently) treats the rectangle as covering the rest of the world instead
// of the small region inside it. Verified empirically (see process_geometry.ipynb's
// `fix_winding` for the same finding against the real boundary data).
export function bboxFeature([minLon, minLat, maxLon, maxLat]) {
	return {
		type: 'Feature',
		properties: {},
		geometry: {
			type: 'Polygon',
			coordinates: [
				[
					[minLon, minLat],
					[minLon, maxLat],
					[maxLon, maxLat],
					[maxLon, minLat],
					[minLon, minLat],
				],
			],
		},
	};
}

export function projectPoint(projection, lon, lat) {
	return projection([lon, lat]);
}
