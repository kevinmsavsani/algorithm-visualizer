import useSorting from './useSorting.ts'
import ArrayBar from './array-bar.tsx'
import config from '@/lib/config/index.ts'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { ControlPanel } from '@/components/graph/control-panel.tsx'

const springAnim = {
  type: 'spring',
  damping: 20,
  stiffness: 300,
}

const Sorting = () => {
  const { algorithm } = useParams<{ algorithm: string; topic: string }>()

  const algorithmOption = config
    ?.find((option) => option.value === 'sorting')
    ?.algorithms.find((option) => option.value === algorithm)

  const {
    arr,
    steps,
    currentStep,
    isPaused,
    createArray,
    nextStep,
    prevStep,
    resetSteps,
    toggleSorting,
    setSteps,
    setCurrentStep,
    setIsPaused,
    setAnimationSpeed,
    animationSpeed,
  } = useSorting()

  useEffect(() => {
    if (!arr.length) return
    let sortedSteps = []
    sortedSteps = algorithmOption.method(arr)
    setSteps([arr, ...sortedSteps])
    setCurrentStep(0)
    setIsPaused(true)
  }, [arr, algorithm])

  return (
    <div>
      <ControlPanel
        animationSpeed={animationSpeed}
        isAnimating={!isPaused}
        generateRandomGraph={() => {
          createArray()
        }}
        toggleAnimation={toggleSorting}
        stepForward={nextStep}
        stepBackward={prevStep}
        resetVisualization={resetSteps}
        setAnimationSpeed={setAnimationSpeed}
        buttonLabel='Generate Random Array'
      />
      <ArrayBar
        springAnim={springAnim}
        currentStep={currentStep}
        steps={steps}
        arr={arr}
      />
    </div>
  )
}

export default Sorting
