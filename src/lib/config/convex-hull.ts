import { Point } from '@/types'

function orientation(p: Point, q: Point, r: Point): number {
  const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y)
  if (val === 0) return 0
  return val > 0 ? 1 : 2
}

export function grahamScan(points: Point[]): { steps: Point[][], hull: Point[] } {
  if (points.length < 3) return { steps: [points], hull: points }

  const steps: Point[][] = []

  // Find the bottommost point (and leftmost if there are multiple bottommost points)
  let bottom = 0
  for (let i = 1; i < points.length; i++) {
    if (points[i].y < points[bottom].y || (points[i].y === points[bottom].y && points[i].x < points[bottom].x)) {
      bottom = i
    }
  }

  // Swap the bottommost point with the first point
  [points[0], points[bottom]] = [points[bottom], points[0]]
  steps.push([...points]) // Step: Initial points with bottommost point first

  // Sort the remaining points based on polar angle with respect to the bottommost point
  const sortedPoints = points.slice(1).sort((a, b) => {
    const o = orientation(points[0], a, b)
    if (o === 0) {
      // If collinear, sort based on distance from points[0]
      const distA = (a.x - points[0].x) ** 2 + (a.y - points[0].y) ** 2
      const distB = (b.x - points[0].x) ** 2 + (b.y - points[0].y) ** 2
      return distA - distB
    }
    return o === 2 ? -1 : 1
  })
  steps.push([points[0], ...sortedPoints]) // Step: Sorted points

  // Build the convex hull
  const hull: Point[] = [points[0], sortedPoints[0], sortedPoints[1]]
  steps.push([...hull]) // Step: Initial triangle

  for (let i = 2; i < sortedPoints.length; i++) {
    while (hull.length > 1 && orientation(hull[hull.length - 2], hull[hull.length - 1], sortedPoints[i]) !== 2) {
      hull.pop()
      steps.push([...hull, sortedPoints[i]]) // Step: Removed point from hull
    }
    hull.push(sortedPoints[i])
    steps.push([...hull]) // Step: Added new point to hull
  }

  return { steps, hull }
}