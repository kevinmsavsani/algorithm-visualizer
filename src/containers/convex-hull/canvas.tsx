import React, { useRef, useEffect } from 'react'
import { Point } from '@/types'

interface ConvexHullCanvasProps {
  points: Point[]
  steps: Point[][]
  hull: Point[]
  currentStep: number
  addPoint: (x: number, y: number) => void
  removePoint: (index: number) => void
}

const ConvexHullCanvas: React.FC<ConvexHullCanvasProps> = ({
  points,
  steps,
  hull,
  currentStep,
  addPoint,
  removePoint,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set colors based on dark mode
    const isDarkMode = document.documentElement.classList.contains('dark')
    const pointColor = isDarkMode ? '#90cdf4' : '#3182ce' // blue-300 for dark, blue-600 for light
    const hullColor = isDarkMode ? '#f56565' : '#e53e3e' // red-500 for both
    const edgeColor = isDarkMode ? '#68d391' : '#38a169' // green-400 for dark, green-600 for light
    const textColor = isDarkMode ? '#f7fafc' : '#1a202c' // gray-100 for dark, gray-900 for light
    const currentPointColor = isDarkMode ? '#faf089' : '#d69e2e' // yellow-300 for dark, yellow-600 for light

    // Draw all points
    points.forEach((point, index) => {
      ctx.beginPath()
      ctx.arc(point.x, point.y, 8, 0, 2 * Math.PI) // Increased point size
      ctx.fillStyle = currentStep === steps.length - 1 && hull.some(p => p.x === point.x && p.y === point.y) 
        ? hullColor 
        : pointColor
      ctx.fill()
      ctx.closePath()

      // Draw point index
      ctx.fillStyle = textColor
      ctx.font = '14px Arial' // Increased font size
      ctx.fillText(index.toString(), point.x + 15, point.y - 15)
    })

    // Draw current step of the convex hull
    if (steps.length > 0 && currentStep < steps.length && currentStep > 0) {
      const currentHull = steps[currentStep]
      ctx.beginPath()
      ctx.moveTo(currentHull[0].x, currentHull[0].y)
      for (let i = 1; i < currentHull.length; i++) {
        ctx.lineTo(currentHull[i].x, currentHull[i].y)
      }
      if (currentStep < steps.length - 1) {
        // Close the path only if it's not the final step
        ctx.lineTo(currentHull[0].x, currentHull[0].y)
      }
      ctx.strokeStyle = edgeColor
      ctx.lineWidth = 3 // Increased line width
      ctx.stroke()
      ctx.closePath()

      // Highlight the current point being considered
      if (currentStep < steps.length - 1) {
        const currentPoint = currentHull[currentHull.length - 1]
        ctx.beginPath()
        ctx.arc(currentPoint.x, currentPoint.y, 10, 0, 2 * Math.PI) // Increased size for highlight
        ctx.fillStyle = currentPointColor
        ctx.fill()
        ctx.closePath()
      }
    }

    // Draw the final hull
    if (currentStep === steps.length - 1) {
      ctx.beginPath()
      ctx.moveTo(hull[0].x, hull[0].y)
      for (let i = 1; i <= hull.length; i++) {
        ctx.lineTo(hull[i % hull.length].x, hull[i % hull.length].y)
      }
      ctx.strokeStyle = hullColor
      ctx.lineWidth = 4 // Increased line width for final hull
      ctx.stroke()
      ctx.closePath()
    }
  }, [points, steps, hull, currentStep])

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    addPoint(x, y)
  }

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      onClick={handleCanvasClick}
      className="border border-gray-300 dark:border-gray-700"
    />
  )
}

export default ConvexHullCanvas