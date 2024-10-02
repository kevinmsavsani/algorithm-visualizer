import { Point } from '@/types';

function orientation(p: Point, q: Point, r: Point): number {
  const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
  if (val === 0) return 0;
  return val > 0 ? 1 : 2;
}

export function grahamScan(points: Point[]): { steps: Point[][], hull: Point[] } {
  if (points.length < 3) return { steps: [points], hull: points };

  const steps: Point[][] = [];

  let bottom = 0;
  for (let i = 1; i < points.length; i++) {
    if (points[i].y < points[bottom].y || (points[i].y === points[bottom].y && points[i].x < points[bottom].x)) {
      bottom = i;
    }
  }

  [points[0], points[bottom]] = [points[bottom], points[0]];
  steps.push([...points]);

  const sortedPoints = points.slice(1).sort((a, b) => {
    const o = orientation(points[0], a, b);
    if (o === 0) {
      const distA = (a.x - points[0].x) ** 2 + (a.y - points[0].y) ** 2;
      const distB = (b.x - points[0].x) ** 2 + (b.y - points[0].y) ** 2;
      return distA - distB;
    }
    return o === 2 ? -1 : 1;
  });
  steps.push([points[0], ...sortedPoints]);

  const hull: Point[] = [points[0], sortedPoints[0], sortedPoints[1]];
  steps.push([...hull]);

  for (let i = 2; i < sortedPoints.length; i++) {
    while (hull.length > 1 && orientation(hull[hull.length - 2], hull[hull.length - 1], sortedPoints[i]) !== 2) {
      hull.pop();
      steps.push([...hull, sortedPoints[i]]);
    }
    hull.push(sortedPoints[i]);
    steps.push([...hull]);
  }

  return { steps, hull };
}

export function jarvisMarch(points: Point[]): { steps: Point[][], hull: Point[] } {
  if (points.length < 3) return { steps: [points], hull: points };

  const steps: Point[][] = [];
  const hull: Point[] = [];

  let leftmost = 0;
  for (let i = 1; i < points.length; i++) {
    if (points[i].x < points[leftmost].x) {
      leftmost = i;
    }
  }

  let p = leftmost;
  do {
    hull.push(points[p]);
    steps.push([...hull]);

    let q = (p + 1) % points.length;
    for (let i = 0; i < points.length; i++) {
      if (orientation(points[p], points[i], points[q]) === 2) {
        q = i;
      }
    }

    p = q;
  } while (p !== leftmost);

  return { steps, hull };
}

export function monotoneChain(points: Point[]): { steps: Point[][], hull: Point[] } {
  if (points.length < 3) return { steps: [points], hull: points };

  const steps: Point[][] = [];
  points.sort((a, b) => a.x === b.x ? a.y - b.y : a.x - b.x);
  steps.push([...points]);

  const lower: Point[] = [];
  for (let i = 0; i < points.length; i++) {
    while (lower.length >= 2 && orientation(lower[lower.length - 2], lower[lower.length - 1], points[i]) !== 2) {
      lower.pop();
      steps.push([...lower]);
    }
    lower.push(points[i]);
    steps.push([...lower]);
  }

  const upper: Point[] = [];
  for (let i = points.length - 1; i >= 0; i--) {
    while (upper.length >= 2 && orientation(upper[upper.length - 2], upper[upper.length - 1], points[i]) !== 2) {
      upper.pop();
      steps.push([...upper]);
    }
    upper.push(points[i]);
    steps.push([...upper]);
  }

  upper.pop();
  lower.pop();
  const hull = lower.concat(upper);
  steps.push([...hull]);

  return { steps, hull };
}
