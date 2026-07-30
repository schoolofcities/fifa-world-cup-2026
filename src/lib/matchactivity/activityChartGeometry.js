import { smoothPath } from '$lib/curve.js';

export const W = 960;
export const H = 300;
export const MARGIN = { top: 18, right: 16, bottom: 40, left: 16 };
export const PLOT_W = W - MARGIN.left - MARGIN.right;
export const PLOT_H = H - MARGIN.top - MARGIN.bottom;

const SERIES_KEYS = ['activityMain2026', 'activityPre2026', 'activity2025'];

// Builds scales, line paths, match-day markers, and x-axis ticks for one city/level's
// daily activity series (main 2026 vs. the pre-2026 and 2025 baselines).
export function buildActivityChart(rows) {
	const n = rows.length;
	const x = (i) => MARGIN.left + (i / (n - 1)) * PLOT_W;
	const bandW = PLOT_W / n;

	const allVals = rows.flatMap((r) => SERIES_KEYS.map((k) => r[k])).filter((v) => v !== null && v !== undefined);
	const minVal = Math.min(...allVals);
	const maxVal = Math.max(...allVals);
	const pad = (maxVal - minVal) * 0.1 || maxVal * 0.1 || 1;
	const yMin = Math.max(0, minVal - pad);
	const yMax = maxVal + pad;
	const y = (v) => MARGIN.top + PLOT_H - ((v - yMin) / (yMax - yMin)) * PLOT_H;

	const pathFor = (key) => {
		const pts = rows.map((r, i) => ({ x: x(i), y: y(r[key]), i })).filter((p) => rows[p.i][key] !== null && rows[p.i][key] !== undefined);
		return smoothPath(pts);
	};

	const matchDayIdxs = rows.map((r, i) => (r.isMatchDay ? i : -1)).filter((i) => i >= 0);

	// weekly-ish x-axis ticks, always including the first and last day
	const tickEvery = 7;
	const xTickIdxs = rows.map((_, i) => i).filter((i) => i % tickEvery === 0 || i === n - 1);

	return {
		rows,
		n,
		x,
		y,
		bandW,
		pathMain: pathFor('activityMain2026'),
		pathPre2026: pathFor('activityPre2026'),
		path2025: pathFor('activity2025'),
		matchDayIdxs,
		xTickIdxs,
	};
}
