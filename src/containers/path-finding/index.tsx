'use client'

import React from 'react'
import { useParams } from 'react-router-dom'
import config from '@/lib/config'
import { useAlgorithm } from './usePathFinding'
import Canvas from './canvas'
import { ControlPanel } from '@/components/graph/control-panel'

const modes = [
  { value: 'wall', label: 'Wall' },
  { value: 'start', label: 'Start' },
  { value: 'end', label: 'End' },
]

export default function PathfindingVisualizer() {
  const { algorithm } = useParams<{ algorithm: string; topic: string }>()

  const algorithmOption = config
    ?.find((option) => option.value === 'path-finding')
    ?.algorithms.find((option) => option.value === algorithm)

  const {
    grid,
    isAnimating,
    animationSpeed,
    setAnimationSpeed,
    toggleAnimation,
    stepForward,
    stepBackward,
    resetVisualization,
    handleMouseDown,
    handleMouseEnter,
    handleMouseUp,
    selectedMode,
    setSelectedMode,
  } = useAlgorithm({
    algorithmMethod: algorithmOption?.method || (() => [])
  })


  return (
    <div className="flex flex-col items-center p-4">
      <ControlPanel
        isAnimating={isAnimating}
        animationSpeed={animationSpeed}
        stepForward={stepForward}
        stepBackward={stepBackward}
        resetVisualization={resetVisualization}
        modes={modes}
        selectionMode={selectedMode}
        setSelectionMode={setSelectedMode}
        toggleAnimation={toggleAnimation}
        setAnimationSpeed={setAnimationSpeed}
      />
      <Canvas
        grid={grid}
        GRID_COLS={30}
        onMouseDown={handleMouseDown}
        onMouseEnter={handleMouseEnter}
        onMouseUp={handleMouseUp}
      />
    </div>
  )
}