import { smoothPath, smoothPathReversed } from '$lib/curve.js';

export const W = 960;
export const H = 300;
export const MARGIN = { top: 18, right: 16, bottom: 40, left: 16 };
export const PLOT_W = W - MARGIN.left - MARGIN.right;
export const PLOT_H = H - MARGIN.top - MARGIN.bottom;

const SERIES_KEYS = ['activityMain2026', 'activityPre2026', 'activity2025'];

const FILL_CLASS = {
	activityMain2026: 'fill-main',
	activityPre2026: 'fill-pre2026',
	activity2025: 'fill-2025',
};

// Builds the shaded bands between the main 2026 line and each baseline independently
// (main vs. pre-2026, main vs. 2025). Each band is split wherever the two lines cross,
// and colored by whichever of the pair sits on top there.
function buildBandFills(rows, xAt, y) {
	const fills = [];
	for (const otherKey of ['activityPre2026', 'activity2025']) {
		fills.push(...pairFills(rows, xAt, y, 'activityMain2026', otherKey));
	}
	return fills;
}

function pairFills(rows, xAt, y, keyA, keyB) {
	const n = rows.length;
	const validAt = (i) => rows[i][keyA] !== null && rows[i][keyA] !== undefined && rows[i][keyB] !== null && rows[i][keyB] !== undefined;

	// split into runs of contiguous rows where both series have data
	const runs = [];
	let run = [];
	for (let i = 0; i < n; i++) {
		if (validAt(i)) {
			run.push(i);
		} else if (run.length > 1) {
			runs.push(run);
			run = [];
		} else {
			run = [];
		}
	}
	if (run.length > 1) runs.push(run);

	const fills = [];
	for (const idxs of runs) fills.push(...pairFillsForRun(rows, idxs, keyA, keyB, xAt, y));
	return fills;
}

function pairFillsForRun(rows, idxs, keyA, keyB, xAt, y) {
	const signAt = (i) => (rows[i][keyA] >= rows[i][keyB] ? 'A' : 'B');

	// walk the run's points, inserting an exact crossing point wherever A/B swap order
	const points = [];
	for (let ii = 0; ii < idxs.length; ii++) {
		const i = idxs[ii];
		points.push({ xPos: xAt(i), a: rows[i][keyA], b: rows[i][keyB], sign: signAt(i) });
		if (ii === idxs.length - 1) continue;
		const j = idxs[ii + 1];
		if (signAt(i) !== signAt(j)) {
			const d0 = rows[i][keyA] - rows[i][keyB];
			const d1 = rows[j][keyA] - rows[j][keyB];
			const t = d0 / (d0 - d1);
			const xPos = xAt(i) + t * (xAt(j) - xAt(i));
			const val = rows[i][keyA] + t * (rows[j][keyA] - rows[i][keyA]);
			points.push({ xPos, a: val, b: val, sign: null });
		}
	}

	// group into segments with a constant sign, splitting (and duplicating) at each crossing point
	const segments = [];
	let seg = [];
	for (const p of points) {
		seg.push(p);
		if (p.sign === null) {
			segments.push(seg);
			seg = [p];
		}
	}
	if (seg.length > 1) segments.push(seg);

	const fills = [];
	for (const s of segments) {
		if (s.length < 2) continue;
		const sign = s.find((p) => p.sign !== null)?.sign ?? s[0].sign;
		const aPts = s.map((p) => ({ x: p.xPos, y: y(p.a) }));
		const bPts = s.map((p) => ({ x: p.xPos, y: y(p.b) }));
		const d = `${smoothPath(aPts)} ${smoothPathReversed(bPts)} Z`;
		fills.push({ d, cls: FILL_CLASS[sign === 'A' ? keyA : keyB] });
	}
	return fills;
}

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
		fills: buildBandFills(rows, x, y),
		matchDayIdxs,
		xTickIdxs,
	};
}
