import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { PlayIcon, PauseIcon } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

const directionTypeOptions = [
  { value: 'directed', label: 'Directed' },
  { value: 'undirected', label: 'Undirected' },
]

interface ControlPanelProps {
  totalNodes: number
  setTotalNodes: (value: number) => void
  isAnimating: boolean
  animationSpeed: number
  generateRandomTree: () => void
  generateRandomGraph: () => void
  toggleAnimation: () => void
  stepForward: () => void
  stepBackward: () => void
  resetVisualization: () => void
  setAnimationSpeed: (value: number) => void
  selectionMode: 'start' | 'end' | null
  setSelectionMode: (mode: 'start' | 'end') => void
  nodeSelectShow?: boolean
  directionType?: string
  setDirectionType?: (value: string) => void
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
  nodeSelectShow = true,
  directionType,
  setDirectionType,
}: ControlPanelProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 p-4">
      <Button onClick={generateRandomGraph}>Generate Random Graph</Button>
      <Button onClick={generateRandomTree}>Generate Random Tree</Button>
      <Input
        type="number"
        value={totalNodes}
        onChange={(e) => setTotalNodes(Number(e.target.value))}
      />
      {nodeSelectShow && (
        <>
          <Button
            onClick={() => setSelectionMode('start')}
            disabled={selectionMode === 'start'}
          >
            Select Start Node
          </Button>
          <Button
            onClick={() => setSelectionMode('end')}
            disabled={selectionMode === 'end'}
          >
            Select End Node
          </Button>
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
      <div className="flex items-center space-x-2 col-span-1 md:col-span-2">
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
