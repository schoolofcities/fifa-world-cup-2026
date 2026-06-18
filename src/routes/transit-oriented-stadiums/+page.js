export const prerender = true;

import { base } from '$app/paths';

export async function load({ fetch }) {
	const res = await fetch(`${base}/transit-oriented-stadiums/population_matrix_long.csv`);
	const text = await res.text();

	const lines = text.trim().split('\n').slice(1); // skip header
	const stats = {};

	for (const line of lines) {
		const [stadium_id, , , , cutoff_min, buffer_km, transit_pop, , pct_reachable] =
			line.split(',').map((v) => v.replace(/"/g, ''));

		if (cutoff_min === '60' && buffer_km === '25') {
			stats[Number(stadium_id)] = {
				popInIsochrone: Number(transit_pop),
				pctInIsochrone: Number(pct_reachable),
			};
		}
	}

	return { stats };
}
