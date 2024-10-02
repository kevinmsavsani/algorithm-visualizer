import { useState, useEffect, useCallback } from 'react'
import { Point } from '@/types'

export function useConvexHull(totalPoints: number, algorithmMethod: (points: Point[]) => { steps: Point[][], hull: Point[] }) {
  const [points, setPoints] = useState<Point[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState<Point[][]>([])
  const [hull, setHull] = useState<Point[]>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState(5)

  const generateRandomPoints = useCallback(() => {
    const newPoints: Point[] = []
    for (let i = 0; i < totalPoints; i++) {
      newPoints.push({
        x: Math.random() * 800,
        y: Math.random() * 600,
      })
    }
    setPoints(newPoints)
    setCurrentStep(0)
  }, [totalPoints])

  useEffect(() => {
    generateRandomPoints()
  }, [totalPoints, generateRandomPoints])

  useEffect(() => {
    if (algorithmMethod && points.length > 0) {
      const { steps: newSteps, hull: newHull } = algorithmMethod(points)
      setSteps(newSteps)
      setHull(newHull)
      setCurrentStep(0)
    }
  }, [points, algorithmMethod])

  const toggleAnimation = () => setIsAnimating(!isAnimating)

  const stepForward = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const stepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const resetVisualization = () => {
    setCurrentStep(0)
    setIsAnimating(false)
  }

  const addPoint = (x: number, y: number) => {
    setPoints([...points, { x, y }])
  }

  const removePoint = (index: number) => {
    setPoints(points.filter((_, i) => i !== index))
  }

  useEffect(() => {
    let intervalId: NodeJS.Timeout
    if (isAnimating) {
      intervalId = setInterval(() => {
        setCurrentStep((prevStep) => {
          if (prevStep < steps.length - 1) {
            return prevStep + 1
          }
          setIsAnimating(false)
          return prevStep
        })
      }, animationSpeed)
    }
    return () => clearInterval(intervalId)
  }, [isAnimating, steps.length, animationSpeed])

  return {
    points,
    currentStep,
    steps,
    hull,
    isAnimating,
    generateRandomPoints,
    toggleAnimation,
    stepForward,
    stepBackward,
    resetVisualization,
    setAnimationSpeed,
    animationSpeed,
    addPoint,
    removePoint,
  }
}
