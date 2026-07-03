export function timeToMinutes(t) {
	const [h, m] = t.split(':').map(Number);
	return h * 60 + m;
}

// Parses the raw CSV text into one entry per game, each holding its rows
// plus a continuous minute-offset axis (since 7pm kickoffs' windows cross
// midnight, where time_start wraps from 23:xx back to 00:00).
export function parseGames(csv) {
	const raw = csv
		.trim()
		.split('\n')
		.slice(1)
		.map((line) => {
			const [date, kickoff, country_a, country_b, time_start, time_end, target, baseline] =
				line.split(',');
			return {
				date,
				kickoff,
				country_a,
				country_b,
				time_start,
				time_end,
				// counts are per 10-minute window in the source data; divide down to a per-minute rate for display
				target: parseFloat(target) / 10,
				baseline: parseFloat(baseline) / 10,
			};
		});

	const games = [];
	const byDate = new Map();
	raw.forEach((r) => {
		if (!byDate.has(r.date)) {
			const game = { date: r.date, kickoff: r.kickoff, country_a: r.country_a, country_b: r.country_b, rows: [] };
			byDate.set(r.date, game);
			games.push(game);
		}
		byDate.get(r.date).rows.push(r);
	});

	games.forEach((game) => {
		const startMin = timeToMinutes(game.rows[0].time_start);
		game.rows = game.rows.map((r) => {
			let offsetStart = timeToMinutes(r.time_start);
			if (offsetStart < startMin) offsetStart += 24 * 60;
			let offsetEnd = timeToMinutes(r.time_end);
			if (offsetEnd < startMin) offsetEnd += 24 * 60;
			if (offsetEnd === startMin) offsetEnd += 24 * 60;
			return { ...r, offsetStart, offsetEnd };
		});
	});

	return games;
}
