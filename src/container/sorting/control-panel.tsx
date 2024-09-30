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
    <Button variant="outline" onClick={prevStep} disabled={currentStep === 0}>
      Previous
    </Button>
    <Button variant="outline" onClick={resetSteps} disabled={currentStep === 0}>
      Reset
    </Button>
    <Button
      variant="outline"
      onClick={nextStep}
      disabled={currentStep === steps.length - 1}
    >
      Next
    </Button>
    <Button
      variant="outline"
      onClick={() => {
        isPaused ? resumeSorting() : pauseSorting()
      }}
    >
      {isPaused ? 'Resume' : 'Pause'}
    </Button>
    <Button
      variant="outline"
      onClick={() => {
        createArray(method)
      }}
    >
      Randomize
    </Button>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{method}</Button>
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
    <Button variant="outline" onClick={sortFunc}>
      Sort
    </Button>
  </div>
)

export default ControlPanel
