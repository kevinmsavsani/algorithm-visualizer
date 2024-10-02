import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-2">
        <Label htmlFor="totalPoints">Total Points:</Label>
        <Input
          id="totalPoints"
          type="number"
          value={totalPoints}
          onChange={(e) => setTotalPoints(Number(e.target.value))}
          min={3}
          max={100}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Label htmlFor="animationSpeed">Animation Speed:</Label>
        <Input
          id="animationSpeed"
          type="range"
          min={1}
          max={10}
          value={animationSpeed}
          onChange={(e) => setAnimationSpeed(Number(e.target.value))}
        />
      </div>
      <div className="flex space-x-2">
        <Button onClick={generateRandomPoints}>Generate Random Points</Button>
        <Button onClick={toggleAnimation}>{isAnimating ? 'Pause' : 'Play'}</Button>
        <Button onClick={stepBackward}>Step Backward</Button>
        <Button onClick={stepForward}>Step Forward</Button>
        <Button onClick={resetVisualization}>Reset</Button>
      </div>
      <div>
        Step: {currentStep + 1} / {totalSteps}
      </div>
    </div>
  )
}