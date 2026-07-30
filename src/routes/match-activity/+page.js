export const prerender = true;

// The boundary GeoJSON files under src/data/geo/ are fairly large - importing them directly
// would inline that data into the page's JS bundle. Importing the URL instead (Vite emits them
// as plain static assets) and fetching it here, in the route's load function, keeps them as
// separately-cached JSON fetched at request/prerender time, matching how the CSV data for the
// other two routes is loaded.
import gthaCsdUrl from '$data/geo/csd/gtha.json?url';
import metroVancouverCsdUrl from '$data/geo/csd/metro_vancouver.json?url';
import provincesUrl from '$data/geo/provinces_territories.json?url';
import usaNationUrl from '$data/geo/usa/nation.json?url';
import waterTorontoUrl from '$data/geo/water/toronto.json?url';
import waterVancouverUrl from '$data/geo/water/vancouver.json?url';

const GEO_URLS = {
	gthaCsd: gthaCsdUrl,
	metroVancouverCsd: metroVancouverCsdUrl,
	provinces: provincesUrl,
	usaNation: usaNationUrl,
	waterToronto: waterTorontoUrl,
	waterVancouver: waterVancouverUrl,
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
