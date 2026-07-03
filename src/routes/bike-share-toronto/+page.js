export const prerender = true;

import { base } from '$app/paths';
import { parseGames } from './lib/data.js';

const FILES = {
	all: 'bike-share-world-cup.csv',
	'1km': 'bike-share-world-cup-1km.csv',
	'2km': 'bike-share-world-cup-2km.csv',
};

export async function load({ fetch }) {
	const entries = await Promise.all(
		Object.entries(FILES).map(async ([key, filename]) => {
			const res = await fetch(`${base}/bike-share-toronto/${filename}`);
			const csv = await res.text();
			return [key, parseGames(csv)];
		})
	);

	return { gamesByFilter: Object.fromEntries(entries) };
}
