import { useState } from 'react'
import { ControlPanel } from './control-panel'
import { useConvexHull } from './useConvexHull'
import ConvexHullCanvas from './canvas'
import config from '@/lib/config'
import { useParams } from 'react-router-dom'

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
  } = useConvexHull(totalPoints, convexHullOption?.method)

  return (
    <div className="flex flex-col items-center space-y-4 p-4 dark:bg-black dark:text-white">
      <ControlPanel
        totalPoints={totalPoints}
        animationSpeed={animationSpeed}
        setTotalPoints={setTotalPoints}
        isAnimating={isAnimating}
        generateRandomPoints={generateRandomPoints}
        toggleAnimation={toggleAnimation}
        stepForward={stepForward}
        stepBackward={stepBackward}
        resetVisualization={resetVisualization}
        setAnimationSpeed={setAnimationSpeed}
        currentStep={currentStep}
        totalSteps={steps.length}
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