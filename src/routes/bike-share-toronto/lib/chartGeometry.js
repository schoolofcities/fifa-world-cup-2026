import { timeToMinutes } from './data.js';

export const W = 960;
export const H = 340;
export const MARGIN = { top: 18, right: 16, bottom: 34, left: 116 };
export const PLOT_W = W - MARGIN.left - MARGIN.right;
export const PLOT_H = H - MARGIN.top - MARGIN.bottom;

// Catmull-Rom-derived cubic Bezier control points for a polyline (shared by line strokes and fills,
// so fill edges bow through the same curve as the lines instead of cutting straight between vertices).
function smoothSegments(points) {
	if (points.length < 3) return null;
	const segs = [];
	for (let i = 0; i < points.length - 1; i++) {
		const p0 = points[i - 1] ?? points[i];
		const p1 = points[i];
		const p2 = points[i + 1];
		const p3 = points[i + 2] ?? p2;
		const c1x = p1.x + (p2.x - p0.x) / 6;
		const c1y = p1.y + (p2.y - p0.y) / 6;
		const c2x = p2.x - (p3.x - p1.x) / 6;
		const c2y = p2.y - (p3.y - p1.y) / 6;
		segs.push({ c1x, c1y, c2x, c2y, x: p2.x, y: p2.y });
	}
	return segs;
}

function smoothPath(points) {
	const segs = smoothSegments(points);
	if (!segs) {
		return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ');
	}
	let d = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
	for (const s of segs) {
		d += ` C ${s.c1x.toFixed(2)} ${s.c1y.toFixed(2)}, ${s.c2x.toFixed(2)} ${s.c2y.toFixed(2)}, ${s.x.toFixed(2)} ${s.y.toFixed(2)}`;
	}
	return d;
}

// Same curve as smoothPath, but traversed in reverse (for closing a fill polygon along the bottom edge).
function smoothPathReversed(points) {
	const segs = smoothSegments(points);
	if (!segs) {
		return points
			.slice()
			.reverse()
			.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
			.join(' ');
	}
	let d = '';
	for (let i = segs.length - 1; i >= 0; i--) {
		const s = segs[i];
		const start = i === 0 ? points[0] : segs[i - 1];
		d += ` C ${s.c2x.toFixed(2)} ${s.c2y.toFixed(2)}, ${s.c1x.toFixed(2)} ${s.c1y.toFixed(2)}, ${start.x.toFixed(2)} ${start.y.toFixed(2)}`;
	}
	return d;
}

// Builds all scales, ticks, and derived geometry needed to render one game's chart.
export function buildChart(game) {
	const rows = game.rows;
	const n = rows.length;
	const xMin = rows[0].offsetStart;
	const xMax = rows[n - 1].offsetEnd;

	const x = (offset) => MARGIN.left + ((offset - xMin) / (xMax - xMin)) * PLOT_W;
	// each row's value represents its 10-minute window (offsetStart–offsetEnd); plot it at the window's midpoint
	const xAt = (i) => x((rows[i].offsetStart + rows[i].offsetEnd) / 2);

	const maxVal = Math.max(...rows.map((r) => Math.max(r.target, r.baseline)));
	const yMax = Math.ceil(maxVal / 10) * 10;
	const y = (v) => MARGIN.top + PLOT_H - (v / yMax) * PLOT_H;

	const pathFor = (key) => smoothPath(rows.map((r, i) => ({ x: xAt(i), y: y(r[key]) })));

	const diffFills = () => {
		const signAt = (i) => (rows[i].target >= rows[i].baseline ? 'above' : 'below');
		const pts = [];
		rows.forEach((r, i) => {
			pts.push({ xPos: xAt(i), target: r.target, baseline: r.baseline, sign: signAt(i) });
			if (i < n - 1 && signAt(i) !== signAt(i + 1)) {
				const d0 = rows[i].target - rows[i].baseline;
				const d1 = rows[i + 1].target - rows[i + 1].baseline;
				const t = d0 / (d0 - d1);
				const xPos = xAt(i) + t * (xAt(i + 1) - xAt(i));
				const val = rows[i].target + t * (rows[i + 1].target - rows[i].target);
				pts.push({ xPos, target: val, baseline: val, sign: null });
			}
		});
		const segs = [];
		let cur = [];
		for (const p of pts) {
			if (p.sign === null) {
				cur.push(p);
				segs.push(cur);
				cur = [p];
			} else {
				cur.push(p);
			}
		}
		if (cur.length > 1) segs.push(cur);
		return segs.map((seg) => {
			const sign = seg.find((p) => p.sign !== null)?.sign ?? seg[0].sign;
			// top/bottom edges follow the same Catmull-Rom curve as the line strokes, so the fill
			// doesn't cut straight between vertices while the lines above/below it bow through a curve
			const topPoints = seg.map((p) => ({ x: p.xPos, y: y(p.target) }));
			const botPoints = seg.map((p) => ({ x: p.xPos, y: y(p.baseline) }));
			const d = `${smoothPath(topPoints)} ${smoothPathReversed(botPoints)} Z`;
			return { d, cls: sign === 'above' ? 'fill-above' : 'fill-below' };
		});
	};

	// match window: kickoff to kickoff + 2h (fixed 2h assumed duration)
	const kickoffMin = timeToMinutes(game.kickoff) + (timeToMinutes(game.kickoff) < xMin ? 24 * 60 : 0);
	const matchStart = kickoffMin;
	const matchEnd = kickoffMin + 120;

	const yTicks = [];
	const yTickStep = yMax > 60 ? 20 : 10;
	for (let v = 0; v <= yMax; v += yTickStep) yTicks.push(v);

	const xTickEvery = 6; // hourly, since 10-min buckets
	const xTickIdxs = rows.map((_, i) => i).filter((i) => i % xTickEvery === 0);
	const xTickAt = (i) => x(rows[i].offsetStart);

	const bandW = PLOT_W / n;

	return {
		rows,
		n,
		x,
		xAt,
		xTickAt,
		y,
		yMax,
		pathTarget: pathFor('target'),
		pathBaseline: pathFor('baseline'),
		fills: diffFills(),
		matchStart,
		matchEnd,
		yTicks,
		xTickIdxs,
		bandW,
	};
}
