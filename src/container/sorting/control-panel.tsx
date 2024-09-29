import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const ControlPanel = ({
  currentStep,
  steps,
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
}) => (
  <div className="flex justify-center mt-4 space-x-4">
    <Button
      className="bg-gray-500 text-white"
      onClick={prevStep}
      disabled={currentStep === 0}
    >
      Previous
    </Button>
    <Button
      className="bg-gray-500 text-white"
      onClick={resetSteps}
      disabled={currentStep === 0}
    >
      Reset
    </Button>
    <Button
      className="bg-gray-500 text-white"
      onClick={nextStep}
      disabled={currentStep === steps.length - 1}
    >
      Next
    </Button>
    <Button
      className="bg-gray-500 text-white"
      onClick={() => {
        isPaused ? resumeSorting() : pauseSorting()
      }}
    >
      {isPaused ? 'Resume' : 'Pause'}
    </Button>
    <Button
      className="bg-blue-500 text-white"
      onClick={() => {
        createArray(method)
      }}
    >
      Randomize
    </Button>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-blue-500 text-white">{method}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => handleAlgorithmSelection('Bubble Sort')}
        >
          Bubble Sort
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleAlgorithmSelection('Selection Sort')}
        >
          Selection Sort
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleAlgorithmSelection('Merge Sort')}
        >
          Merge Sort
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleAlgorithmSelection('Quick Sort')}
        >
          Quick Sort
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    <Button className="bg-green-500 text-white" onClick={sortFunc}>
      Sort
    </Button>
  </div>
)

export default ControlPanel
