import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { PlayIcon, PauseIcon } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import TabsComponent from './tabs'

const directionTypeOptions = [
  { value: 'directed', label: 'Directed' },
  { value: 'undirected', label: 'Undirected' },
]

interface ControlPanelProps {
  totalNodes?: number
  setTotalNodes?: (value: number) => void
  isAnimating: boolean
  animationSpeed: number
  generateRandomTree?: () => void
  generateRandomGraph?: () => void
  toggleAnimation: () => void
  stepForward: () => void
  stepBackward: () => void
  resetVisualization: () => void
  setAnimationSpeed: (value: number) => void
  selectionMode?: string
  setSelectionMode?: (mode: string) => void
  directionType?: string
  setDirectionType?: (value: string) => void
  modes?: { value: string; label: string }[]
  buttonLabel?: string;
}

export function ControlPanel({
  totalNodes,
  animationSpeed,
  setTotalNodes,
  isAnimating,
  generateRandomGraph,
  generateRandomTree,
  toggleAnimation,
  stepForward,
  stepBackward,
  resetVisualization,
  setAnimationSpeed,
  selectionMode,
  setSelectionMode,
  directionType,
  setDirectionType,
  modes,
  buttonLabel = 'Generate Random Graph',
}: ControlPanelProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 p-4">
      {generateRandomGraph && <Button onClick={generateRandomGraph}>{buttonLabel}</Button>}
      {generateRandomTree && <Button onClick={generateRandomTree}>Generate Random Tree</Button>}
      {setTotalNodes && <Input
        type="number"
        value={totalNodes}
        onChange={(e) => setTotalNodes(Number(e.target.value))}
      />}
      {setSelectionMode && (
        <>
          <TabsComponent defaultValue={selectionMode} setCurrentMode={setSelectionMode} modes={modes} />
        </>
      )}
      {setDirectionType && ( 
         <Select value={directionType} onValueChange={setDirectionType}>
         <SelectTrigger className="w-full md:w-[180px]">
           <SelectValue placeholder="Select algorithm" />
         </SelectTrigger>
         <SelectContent>
           {directionTypeOptions.map((option) => (
             <SelectItem key={option.value} value={option.value}>
               {option.label}
             </SelectItem>
           ))}
         </SelectContent>
       </Select>)}
      <Button onClick={toggleAnimation}>
        {isAnimating ? (
          <PauseIcon className="mr-2 h-4 w-4" />
        ) : (
          <PlayIcon className="mr-2 h-4 w-4" />
        )}
        {isAnimating ? 'Pause' : 'Start'}
      </Button>
      <Button onClick={resetVisualization}>Reset</Button>
      <Button onClick={stepBackward}>Step Back</Button>
      <Button onClick={stepForward}>Step Forward</Button>
      <div className="flex items-center space-x-2 col-span-1">
        <Label htmlFor="speed">Animation Speed:</Label>
        <Slider
          id="speed"
          min={100}
          max={2000}
          step={100}
          defaultValue={[500]}
          value={[animationSpeed]}
          onValueChange={(value) => setAnimationSpeed(value[0])}
          className="w-full md:w-[200px]"
        />
        <span>{animationSpeed}ms</span>
      </div>
    </div>
  )
}
