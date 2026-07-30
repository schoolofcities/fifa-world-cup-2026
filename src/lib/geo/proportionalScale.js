// Square-root radius scale for proportional-symbol maps, so symbol *area* (not radius) scales
// linearly with value - the standard convention for these maps.
export function makeRadiusScale(maxValue, { minR = 2, maxR = 42 } = {}) {
	const k = Math.sqrt(maxValue) || 1;
	return (value) => minR + (maxR - minR) * (Math.sqrt(Math.max(value, 0)) / k);
}

// A handful of origin regions sit far enough from the mapped area (deep in the US, or far
// enough north in Yukon/NWT/Nunavut) that their true centroid would fall outside any reasonably
// cropped North America frame. These display-only overrides nudge just those points into the
// visible frame while keeping them inside the correct territory/country - the label and percent
// value shown on hover are untouched, only where the symbol is drawn.
export const NORTH_AMERICA_DISPLAY_OVERRIDES = {
	US: [-98.6, 41.2],
	'Northwest Territories': [-114.4, 62.45],
	Nunavut: [-92.1, 62.8],
	// "Rest of home province" points sit close enough to their own CMA point (same province, a
	// few hundred km apart) that at North-America scale their circles can touch or overlap -
	// nudged further from the CMA (NW for Ontario, N for BC) so both stay legible.
	'Ontario - GTHA': [-88.5, 52.5],
	'BC - Metro Van': [-124.9, 57.5],
};

export function displayLonLat(row) {
	return NORTH_AMERICA_DISPLAY_OVERRIDES[row.region] ?? [row.lon, row.lat];
}
