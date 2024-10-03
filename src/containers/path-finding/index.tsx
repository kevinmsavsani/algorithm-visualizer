'use client'

import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import config from '@/lib/config'
import { useAlgorithm } from './usePathFinding'
import Canvas from './canvas'
import { ControlPanel } from '@/components/graph/control-panel'

const GRID_ROWS = 20
const GRID_COLS = 30
const modes = [
  { value: 'wall', label: 'Wall' },
  { value: 'start', label: 'Start' },
  { value: 'end', label: 'End' },
]

export default function PathfindingVisualizer() {
  const { algorithm } = useParams<{ algorithm: string; topic: string }>()
  const [mouseIsPressed, setMouseIsPressed] = useState(false)
  const [startNode, setStartNode] = useState<{ row: number; col: number }>({
    row: 10,
    col: 10,
  })
  const [endNode, setEndNode] = useState<{ row: number; col: number }>({
    row: 10,
    col: 20,
  })
  const [currentMode, setCurrentMode] = useState<'wall' | 'start' | 'end'>(
    'wall',
  )

  const algorithmOption = config
    ?.find((option) => option.value === 'path-finding')
    ?.algorithms.find((option) => option.value === algorithm)

  const {
    grid,
    setGrid,
    isRunning,
    setIsRunning,
    isPaused,
    setIsPaused,
    currentStep,
    animationSpeed,
    setAnimationSpeed,
    totalVisitedNodes,
    shortestPathLength,
    isVisualized,
    visitedNodesInOrder,
    nodesInShortestPath,
    initializeGrid,
    generateSteps,
    visualizeStep,
    toggleWall
  } = useAlgorithm({
    startNode,
    endNode,
    GRID_ROWS,
    GRID_COLS,
    algorithmMethod: algorithmOption?.method || (() => [])
  })

  const handleMouseDown = (row: number, col: number) => {
    if (isRunning) return
    if (currentMode === 'wall') {
      const newGrid = toggleWall(grid, row, col)
      setGrid(newGrid)
    } else if (currentMode === 'start') {
      const newGrid = [...grid]
      newGrid[startNode.row][startNode.col].isStart = false
      setStartNode({ row, col })
      newGrid[row][col].isStart = true
      setGrid(newGrid)
      setCurrentMode('wall')
    } else if (currentMode === 'end') {
      const newGrid = [...grid]
      newGrid[endNode.row][endNode.col].isEnd = false
      setEndNode({ row, col })
      newGrid[row][col].isEnd = true
      setGrid(newGrid)
      setCurrentMode('wall')
    }
    setMouseIsPressed(true)
  }

  const handleMouseEnter = (row: number, col: number) => {
    if (!mouseIsPressed || isRunning) return
    if (currentMode === 'wall') {
      const newGrid = toggleWall(grid, row, col)
      setGrid(newGrid)
    }
  }

  const handleMouseUp = () => {
    setMouseIsPressed(false)
  }

  const handleReset = () => {
    setIsRunning(false)
    setIsPaused(false)
    initializeGrid()
  }

  const handleStartPause = () => {
    if (!isVisualized) {
      generateSteps()
    }
    if (isRunning) {
      setIsPaused(true)
      setIsRunning(false)
    } else {
      setIsPaused(false)
      setIsRunning(true)
    }
  }

  const handleStepForward = () => {
    if (currentStep < visitedNodesInOrder.length + nodesInShortestPath.length) {
      setIsPaused(true)
      setIsRunning(false)
      visualizeStep()
    }
  }

  const handleStepBackward = () => {
    if (currentStep > 0) {
      setIsPaused(true)
      setIsRunning(false)
      setGrid((prevGrid) => {
        const newGrid = prevGrid.slice()
        if (currentStep <= visitedNodesInOrder.length) {
          const { row, col } = visitedNodesInOrder[currentStep - 1]
          newGrid[row][col] = {
            ...newGrid[row][col],
            isVisited: false,
          }
        } else {
          const pathIndex = currentStep - visitedNodesInOrder.length - 1
          const node = nodesInShortestPath[pathIndex]
          newGrid[node.row][node.col] = {
            ...newGrid[node.row][node.col],
            isPath: false,
          }
        }
        return newGrid
      })
    }
  }

  return (
    <div className="flex flex-col items-center p-4">
      <ControlPanel
        isAnimating={isRunning}
        animationSpeed={animationSpeed}
        onStartPause={handleStartPause}
        stepForward={handleStepForward}
        stepBackward={handleStepBackward}
        resetVisualization={handleReset}
        modes={modes}
        selectionMode={currentMode}
        setSelectionMode={setCurrentMode}
        toggleAnimation={handleStartPause}
        setAnimationSpeed={setAnimationSpeed}
      />
      <Canvas
        grid={grid}
        GRID_COLS={GRID_COLS}
        onMouseDown={handleMouseDown}
        onMouseEnter={handleMouseEnter}
        onMouseUp={handleMouseUp}
      />
    </div>
  )
}