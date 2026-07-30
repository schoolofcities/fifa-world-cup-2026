// Catmull-Rom-derived cubic Bezier smoothing for a polyline, shared by any chart that draws
// a curved line (and, where relevant, a filled band) through a series of points.

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

export function smoothPath(points) {
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
export function smoothPathReversed(points) {
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
