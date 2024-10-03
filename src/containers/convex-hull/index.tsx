import { useEffect, useState } from 'react'
import { useConvexHull } from './useConvexHull'
import ConvexHullCanvas from './canvas'
import config from '@/lib/config'
import { useParams } from 'react-router-dom'
import { ControlPanel } from '@/components/graph/control-panel'

export default function ConvexHullVisualization() {
  const [totalPoints, setTotalPoints] = useState(10)
  const { algorithm } = useParams<{ algorithm: string; topic: string }>()

  const convexHullOption = config
    ?.find((option) => option.value === 'convex-hull')
    ?.algorithms.find((option) => option.value === algorithm)

  const {
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
    setSteps,
    setHull,
  } = useConvexHull(totalPoints)

  useEffect(() => {
    if (convexHullOption?.method && points.length > 0) {
      const { steps: newSteps, hull: newHull } = convexHullOption?.method(points)
      setSteps(newSteps)
      setHull(newHull)
      resetVisualization()
    }
  }, [points, JSON.stringify(convexHullOption)])

  return (
    <div className="flex flex-col items-center space-y-4 p-4 dark:bg-black dark:text-white">
      <ControlPanel
        totalNodes={totalPoints}
        animationSpeed={animationSpeed}
        setTotalNodes={setTotalPoints}
        isAnimating={isAnimating}
        generateRandomGraph={generateRandomPoints}
        toggleAnimation={toggleAnimation}
        stepForward={stepForward}
        stepBackward={stepBackward}
        resetVisualization={resetVisualization}
        setAnimationSpeed={setAnimationSpeed}   
        />
      <ConvexHullCanvas
        points={points}
        steps={steps}
        hull={hull}
        currentStep={currentStep}
        addPoint={addPoint}
        removePoint={removePoint}
      />
    </div>
  )
}