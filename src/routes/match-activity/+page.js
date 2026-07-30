export const prerender = true;

// The boundary GeoJSON files under src/data/geo/ are fairly large (~680KB combined) - importing
// them directly would inline that data into the page's JS bundle. Importing the URL instead (Vite
// emits them as plain static assets) and fetching it here, in the route's load function, keeps
// them as separately-cached JSON fetched at request/prerender time, matching how the CSV data for
// the other two routes is loaded.
import torontoZoneUrl from '$data/geo/zone_2km/toronto.json?url';
import vancouverZoneUrl from '$data/geo/zone_2km/vancouver.json?url';
import torontoCsdUrl from '$data/geo/csd/toronto.json?url';
import vancouverCsdUrl from '$data/geo/csd/vancouver.json?url';
import gthaCsdUrl from '$data/geo/csd/gtha.json?url';
import metroVancouverCsdUrl from '$data/geo/csd/metro_vancouver.json?url';
import cmaTorontoHamiltonUrl from '$data/geo/cma/toronto_hamilton.json?url';
import cmaVancouverUrl from '$data/geo/cma/vancouver.json?url';
import provincesUrl from '$data/geo/provinces_territories.json?url';

const GEO_URLS = {
	torontoZone: torontoZoneUrl,
	vancouverZone: vancouverZoneUrl,
	torontoCsd: torontoCsdUrl,
	vancouverCsd: vancouverCsdUrl,
	gthaCsd: gthaCsdUrl,
	metroVancouverCsd: metroVancouverCsdUrl,
	cmaTorontoHamilton: cmaTorontoHamiltonUrl,
	cmaVancouver: cmaVancouverUrl,
	provinces: provincesUrl,
};

export async function load({ fetch }) {
	const entries = await Promise.all(
		Object.entries(GEO_URLS).map(async ([key, url]) => {
			const res = await fetch(url);
			return [key, await res.json()];
		})
	);

	return { geo: Object.fromEntries(entries) };
}
