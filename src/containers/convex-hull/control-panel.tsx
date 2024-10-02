import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PauseIcon, PlayIcon } from 'lucide-react'
import { Slider } from '@/components/ui/slider'

interface ControlPanelProps {
  totalPoints: number
  animationSpeed: number
  setTotalPoints: (value: number) => void
  isAnimating: boolean
  generateRandomPoints: () => void
  toggleAnimation: () => void
  stepForward: () => void
  stepBackward: () => void
  resetVisualization: () => void
  setAnimationSpeed: (value: number) => void
  currentStep: number
  totalSteps: number
}

export function ControlPanel({
  totalPoints,
  animationSpeed,
  setTotalPoints,
  isAnimating,
  generateRandomPoints,
  toggleAnimation,
  stepForward,
  stepBackward,
  resetVisualization,
  setAnimationSpeed,
  currentStep,
  totalSteps,
}: ControlPanelProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 p-4">
      <Button onClick={generateRandomPoints}>Generate Random Points</Button>
      <Input
        type="number"
        value={totalPoints}
        onChange={(e) => setTotalPoints(Number(e.target.value))}
      />
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
      <div className="flex items-center space-x-2 col-span-1 xl:col-span-2">
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
      <div className='flex items-center justify-center'>
        Step: {currentStep + 1} / {totalSteps}
      </div>
    </div>
  )
}
