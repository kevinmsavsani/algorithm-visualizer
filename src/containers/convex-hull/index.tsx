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
  const [currentStep, setCurrentStep] = useState<number>(-1) // Track the current step index
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isGenerating, setIsGenerating] = useState<boolean>(false) // To track if the hull is being generated
  const [isPaused, setIsPaused] = useState<boolean>(true) // Track if the animation is paused
  const [animationIntervalId, setAnimationIntervalId] =
    useState<NodeJS.Timeout | null>(null) // Track the animation interval

  useEffect(() => {
    drawCanvas()
  }, [points, hull, animationSteps, currentStep])

  useEffect(() => {
    // Start or stop the animation loop based on isPaused and currentStep
    if (!isPaused && animationSteps.length > 0) {
      const intervalId = setInterval(() => {
        stepForward()
      }, 1000) // Adjust the speed of the animation by changing the interval (in ms)
      setAnimationIntervalId(intervalId)
    } else {
      // Clear the interval if paused or if there are no steps
      if (animationIntervalId) {
        clearInterval(animationIntervalId)
        setAnimationIntervalId(null)
      }
    }

    return () => {
      // Cleanup on component unmount
      if (animationIntervalId) {
        clearInterval(animationIntervalId)
      }
    }
  }, [isPaused, currentStep, animationSteps])

  const drawCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    // Draw grid
    drawGrid(ctx)

    // Draw all points
    ctx.fillStyle = 'white' // Change to white for better visibility in dark mode
    points.forEach((point) => {
      ctx.beginPath()
      ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI)
      ctx.fill()
    })

    // Draw current step only if valid
    if (currentStep >= 0 && currentStep < animationSteps.length) {
      const step = animationSteps[currentStep]
      ctx.strokeStyle = 'red'
      ctx.setLineDash([5, 3])
      for (let i = 0; i < step.length - 1; i++) {
        ctx.beginPath()
        ctx.moveTo(step[i].x, step[i].y)
        ctx.lineTo(step[i + 1].x, step[i + 1].y)
        ctx.stroke()
        ctx.closePath()
      }
    }

    // Draw final convex hull only when all steps are completed
    if (currentStep === animationSteps.length - 1) {
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
    setCurrentStep(-1) // Reset current step
    setIsGenerating(false) // Reset generating state
    setIsPaused(true) // Pause the animation
    if (animationIntervalId) {
      clearInterval(animationIntervalId) // Clear any existing animation interval
      setAnimationIntervalId(null) // Reset interval ID
    }
  }

  const createRandomPoints = () => {
    const newPoints = Array.from({ length: 10 }, () => ({
      x: Math.floor(Math.random() * CANVAS_WIDTH),
      y: Math.floor(Math.random() * CANVAS_HEIGHT),
    }))
    setPoints(newPoints)
    setHull([])
    setAnimationSteps([])
    setCurrentStep(-1) // Reset current step
    setIsGenerating(false) // Reset generating state
    setIsPaused(true) // Pause the animation
    if (animationIntervalId) {
      clearInterval(animationIntervalId) // Clear any existing animation interval
      setAnimationIntervalId(null) // Reset interval ID
    }
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

  const generateConvexHullSteps = () => {
    if (points.length < 3) {
      alert('At least 3 points are required to form a convex hull')
      return
    }

    setIsGenerating(true)
    const sortedPoints = [...points].sort(compare)
    const n = sortedPoints.length
    const p1 = sortedPoints[0],
      p2 = sortedPoints[n - 1]

    let up: Point[] = [],
      lo: Point[] = [],
      animateSteps: Point[][] = []
    up.push(p1)
    lo.push(p1)

    // Record initial points
    animateSteps.push([...up, ...lo]) // Record initial step

    for (let i = 1; i < n; i++) {
      if (i === n - 1 || orientation(p1, sortedPoints[i], p2) !== -1) {
        while (
          up.length >= 2 &&
          orientation(up[up.length - 2], up[up.length - 1], sortedPoints[i]) ===
            -1
        ) {
          up.pop()
          animateSteps.push([...up, ...lo]) // Record the step after popping
        }
        up.push(sortedPoints[i])
      }
      if (i === n - 1 || orientation(p1, sortedPoints[i], p2) !== 1) {
        while (
          lo.length >= 2 &&
          orientation(lo[lo.length - 2], lo[lo.length - 1], sortedPoints[i]) ===
            1
        ) {
          lo.pop()
          animateSteps.push([...up, ...lo]) // Record the step after popping
        }
        lo.push(sortedPoints[i])
      }
      // Record the current state after adding points
      animateSteps.push([...up, ...lo])
    }

    const result = [...up.slice(0, up.length - 1), ...lo.reverse()]
    setHull(result)
    setAnimationSteps(animateSteps)
    setCurrentStep(0) // Reset current step to the first step
    setIsGenerating(false) // Reset generating state after hull generation
  }

  const stepForward = () => {
    if (currentStep < animationSteps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    } else {
      setCurrentStep(animationSteps.length - 1) // Stop at the last step
    }
  }

  const stepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleStartPause = () => {
    setIsPaused((prev) => !prev)
  }

  return (
    <div className="flex flex-col items-center p-4 dark:bg-gray-900 dark:text-white">
      <h1 className="text-2xl font-bold mb-4">Convex Hull Visualizer</h1>
      <div className="flex gap-4 mb-4">
        <Button onClick={createRandomPoints} variant="outline">
          Random Points
        </Button>
        <Button
          onClick={generateConvexHullSteps}
          variant="outline"
          disabled={isGenerating}
        >
          Generate
        </Button>
        <Button onClick={handleStartPause} variant="outline">
          {!isPaused ? 'Pause' : 'Start/Resume'}
        </Button>
        <Button onClick={clearBoard} variant="outline">
          Clear
        </Button>
        <Button
          onClick={stepBackward}
          disabled={currentStep <= 0}
          variant="outline"
        >
          Step Backward
        </Button>
        <Button
          onClick={stepForward}
          disabled={currentStep >= animationSteps.length - 1}
          variant="outline"
        >
          Step Forward
        </Button>
      </div>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border border-gray-300 dark:border-gray-700 mb-4 cursor-crosshair"
        onClick={addPoint}
      />
    </div>
  )
}
