import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'

interface Point {
  x: number
  y: number
}

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 400
const GRID_SPACING = 20 // Define the spacing for the grid

export default function ConvexHullVisualizer() {
  const [points, setPoints] = useState<Point[]>([])
  const [hull, setHull] = useState<Point[]>([])
  const [animationSteps, setAnimationSteps] = useState<Point[][]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    drawCanvas()
  }, [points, hull, animationSteps])

  const drawCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    // Draw grid
    drawGrid(ctx)

    // Draw points
    ctx.fillStyle = 'white' // Change to white for better visibility in dark mode
    points.forEach((point) => {
      ctx.beginPath()
      ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI)
      ctx.fill()
    })

    // Draw animated steps
    animationSteps.forEach((step, index) => {
      ctx.strokeStyle = 'red'
      ctx.setLineDash([5, 3])
      for (let i = 0; i < step.length - 1; i++) {
        ctx.beginPath()
        ctx.moveTo(step[i].x, step[i].y)
        ctx.lineTo(step[i + 1].x, step[i + 1].y)
        ctx.stroke()
        ctx.closePath()
      }
    })

    // Draw final convex hull
    ctx.strokeStyle = 'blue'
    ctx.setLineDash([])
    for (let i = 0; i < hull.length - 1; i++) {
      ctx.beginPath()
      ctx.moveTo(hull[i].x, hull[i].y)
      ctx.lineTo(hull[i + 1].x, hull[i + 1].y)
      ctx.stroke()
      ctx.closePath()
    }
  }

  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)' // Light gray color for grid
    ctx.lineWidth = 1

    // Draw vertical lines
    for (let x = GRID_SPACING; x < CANVAS_WIDTH; x += GRID_SPACING) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, CANVAS_HEIGHT)
      ctx.stroke()
      ctx.closePath()
    }

    // Draw horizontal lines
    for (let y = GRID_SPACING; y < CANVAS_HEIGHT; y += GRID_SPACING) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(CANVAS_WIDTH, y)
      ctx.stroke()
      ctx.closePath()
    }
  }

  const addPoint = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    setPoints((prevPoints) => [...prevPoints, { x, y }])
  }

  const clearBoard = () => {
    setPoints([])
    setHull([])
    setAnimationSteps([])
  }

  const createRandomPoints = () => {
    const newPoints = Array.from({ length: 10 }, () => ({
      x: Math.floor(Math.random() * CANVAS_WIDTH),
      y: Math.floor(Math.random() * CANVAS_HEIGHT),
    }))
    setPoints(newPoints)
    setHull([])
    setAnimationSteps([])
  }

  const compare = (a: Point, b: Point) => {
    if (a.x < b.x) return -1
    if (a.x === b.x && a.y < b.y) return -1
    return 1
  }

  const orientation = (a: Point, b: Point, c: Point) => {
    const val = (b.y - a.y) * (c.x - b.x) - (b.x - a.x) * (c.y - b.y)
    if (val === 0) return 0
    return val > 0 ? 1 : -1
  }

  const convexHull = () => {
    if (points.length < 3) {
      alert('At least 3 points are required to form a convex hull')
      return
    }

    const sortedPoints = [...points].sort(compare)
    const n = sortedPoints.length
    const p1 = sortedPoints[0],
      p2 = sortedPoints[n - 1]

    let up: Point[] = [],
      lo: Point[] = [],
      animateSteps: Point[][] = []
    up.push(p1)
    lo.push(p1)

    for (let i = 1; i < n; i++) {
      if (i === n - 1 || orientation(p1, sortedPoints[i], p2) !== -1) {
        animateSteps.push([...up])
        while (
          up.length >= 2 &&
          orientation(up[up.length - 2], up[up.length - 1], sortedPoints[i]) ===
            -1
        ) {
          up.pop()
          animateSteps.push([...up])
        }
        up.push(sortedPoints[i])
      }
      if (i === n - 1 || orientation(p1, sortedPoints[i], p2) !== 1) {
        animateSteps.push([...lo])
        while (
          lo.length >= 2 &&
          orientation(lo[lo.length - 2], lo[lo.length - 1], sortedPoints[i]) ===
            1
        ) {
          lo.pop()
          animateSteps.push([...lo])
        }
        lo.push(sortedPoints[i])
      }
    }

    const result = [...up.slice(0, up.length - 1), ...lo.reverse()]
    setHull(result)
    setAnimationSteps(animateSteps)
  }

  return (
    <div className="flex flex-col items-center p-4 dark:bg-gray-900 dark:text-white">
      <h1 className="text-2xl font-bold mb-4">Convex Hull Visualizer</h1>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border border-gray-300 dark:border-gray-700 mb-4 cursor-crosshair"
        onClick={addPoint}
      />
      <div className="flex gap-4 mb-4">
        <Button
          onClick={createRandomPoints}
          className="dark:bg-gray-700 dark:text-white"
        >
          Random Points
        </Button>
        <Button
          onClick={convexHull}
          className="dark:bg-gray-700 dark:text-white"
        >
          Compute Convex Hull
        </Button>
        <Button
          onClick={clearBoard}
          className="dark:bg-gray-700 dark:text-white"
        >
          Clear
        </Button>
      </div>
    </div>
  )
}
