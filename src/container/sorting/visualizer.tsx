import { useEffect } from 'react'
import useSorting from './useSorting'
import ControlPanel from './control-panel.tsx'
import ArrayBar from './array-bar.tsx'

const springAnim = {
  type: 'spring',
  damping: 20,
  stiffness: 300,
}

const Visualizer = () => {
  const {
    arr,
    steps,
    currentStep,
    isPaused,
    method,
    createArray,
    handleAlgorithmSelection,
    sortFunc,
    nextStep,
    prevStep,
    resetSteps,
    pauseSorting,
    resumeSorting,
  } = useSorting()

  useEffect(() => {
    createArray()
    window.addEventListener('resize', () => {
      createArray()
    })
    return () =>
      window.removeEventListener('resize', () => {
        createArray()
      })
  }, [])

  const previousArray = steps[currentStep - 1] || arr

  return (
    <div>
      <div className="bg-gray-100 dark:bg-black p-4">
        <div className="flex justify-between items-center">
          <a
            className="text-xl font-bold text-gray-900 dark:text-gray-100"
            href="#"
          >
            {method}
          </a>
          <ControlPanel
            currentStep={currentStep}
            steps={steps}
            isPaused={isPaused}
            method={method}
            createArray={createArray}
            handleAlgorithmSelection={handleAlgorithmSelection}
            sortFunc={sortFunc}
            nextStep={nextStep}
            prevStep={prevStep}
            resetSteps={resetSteps}
            pauseSorting={pauseSorting}
            resumeSorting={resumeSorting}
          />
        </div>
      </div>
      <div className="flex justify-center items-end mt-8 space-x-1">
        {(steps[currentStep] || arr).map((element, index) => {
          const hasChanged = previousArray[index]?.value !== element.value
          return (
            <ArrayBar
              key={element.id}
              element={element}
              springAnim={springAnim}
              hasChanged={hasChanged}
            />
          )
        })}
      </div>
    </div>
  )
}

export default Visualizer
