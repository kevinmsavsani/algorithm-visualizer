'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import {
  PlaneTakeoff,
  Target,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  ListRestart,
} from 'lucide-react'
import { cloneDeep } from 'lodash'
import TabsComponent from './tabs'
import { useParams } from 'react-router-dom'
import config from '@/lib/config'

interface Node {
  row: number
  col: number
  isStart: boolean
  isEnd: boolean
  isWall: boolean
  isVisited: boolean
  isPath: boolean
  distance: number
  previousNode: Node | null
}

const GRID_ROWS = 20
const GRID_COLS = 30

export default function PathfindingVisualizer() {
  const { algorithm } = useParams<{ algorithm: string; topic: string }>()
  const [grid, setGrid] = useState<Node[][]>([])
  const [mouseIsPressed, setMouseIsPressed] = useState(false)
  const [startNode, setStartNode] = useState<{ row: number; col: number }>({
    row: 10,
    col: 10,
  })
  const [endNode, setEndNode] = useState<{ row: number; col: number }>({
    row: 10,
    col: 20,
  })
  const [currentTool, setCurrentTool] = useState<'wall' | 'start' | 'end'>(
    'wall',
  )
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [visitedNodesInOrder, setVisitedNodesInOrder] = useState<
    { row: number; col: number }[]
  >([])
  const [nodesInShortestPath, setNodesInShortestPath] = useState<Node[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [animationSpeed, setAnimationSpeed] = useState(50)
  const [totalVisitedNodes, setTotalVisitedNodes] = useState(0)
  const [shortestPathLength, setShortestPathLength] = useState(0)
  const [isVisualized, setIsVisualized] = useState(false)
  const [animationInterval, setAnimationInterval] =
    useState<NodeJS.Timeout | null>(null)

    const algorithmOption = config
    ?.find((option) => option.value === 'path-finding')
    ?.algorithms.find((option) => option.value === algorithm)

  const createNode = (row: number, col: number): Node => {
    return {
      row,
      col,
      isStart: row === startNode.row && col === startNode.col,
      isEnd: row === endNode.row && col === endNode.col,
      isWall: false,
      isVisited: false,
      isPath: false,
      distance: Infinity,
      previousNode: null,
    }
  }

  const initializeGrid = useCallback(() => {
    const newGrid = []
    for (let row = 0; row < GRID_ROWS; row++) {
      const currentRow = []
      for (let col = 0; col < GRID_COLS; col++) {
        currentRow.push(createNode(row, col))
      }
      newGrid.push(currentRow)
    }
    setGrid(newGrid)
    setVisitedNodesInOrder([])
    setNodesInShortestPath([])
    setCurrentStep(0)
    setTotalVisitedNodes(0)
    setShortestPathLength(0)
    setIsVisualized(false)
  }, [startNode, endNode])

  useEffect(() => {
    initializeGrid()
  }, [initializeGrid])

  const handleMouseDown = (row: number, col: number) => {
    if (isRunning) return
    if (currentTool === 'wall') {
      const newGrid = toggleWall(grid, row, col)
      setGrid(newGrid)
    } else if (currentTool === 'start') {
      grid[startNode.row][startNode.col].isStart = false
      setStartNode({ row, col })
      grid[row][col].isStart = true
    } else if (currentTool === 'end') {
      grid[endNode.row][endNode.col].isEnd = false
      setEndNode({ row, col })
      grid[row][col].isEnd = true
    }
    setMouseIsPressed(true)
  }

  const handleMouseEnter = (row: number, col: number) => {
    if (!mouseIsPressed || isRunning) return
    if (currentTool === 'wall') {
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
    setIsVisualized(false)
    if (animationInterval) {
      clearInterval(animationInterval)
    }
    initializeGrid()
  }

  const runAlgorithm = () => {
    const clonedGrid = cloneDeep(grid)
    return algorithmOption.method(clonedGrid)
  }

  const getNodesInShortestPathOrder = (finishNode: Node) => {
    const nodesInShortestPathOrder = []
    let currentNode: Node | null = finishNode
    while (currentNode !== null) {
      nodesInShortestPathOrder.unshift(currentNode)
      currentNode = currentNode.previousNode
    }
    return nodesInShortestPathOrder
  }
  
  const getNodeClassName = (node: Node): string => {
    if (node.isStart) return 'bg-green-500'
    if (node.isEnd) return 'bg-red-500'
    if (node.isPath) return 'bg-yellow-300'
    if (node.isVisited) return 'bg-blue-300'
    if (node.isWall) return 'bg-gray-800'
    return 'bg-white'
  }
  
  const toggleWall = (grid: Node[][], row: number, col: number) => {
    const newGrid = grid.slice()
    const node = newGrid[row][col]
    if (!node.isStart && !node.isEnd) {
      const newNode = {
        ...node,
        isWall: !node.isWall,
      }
      newGrid[row][col] = newNode
    }
    return newGrid
  }

  const generateSteps = () => {
    if (isVisualized) return
    const output = runAlgorithm()
    const shortestPath = getNodesInShortestPathOrder(output[output.length - 1])
    setVisitedNodesInOrder(output)
    setNodesInShortestPath(shortestPath)
    setTotalVisitedNodes(output.length)
    setShortestPathLength(shortestPath.length)
    setIsVisualized(true)
  }

  const currentStepRef = useRef(0)
  const gridRef = useRef(grid)

  useEffect(() => {
    gridRef.current = grid
  }, [grid])

  const visualizeStep = useCallback(() => {
    const currentStep = currentStepRef.current
    if (
      currentStep >=
      visitedNodesInOrder.length + nodesInShortestPath.length
    ) {
      setIsRunning(false)
      setIsPaused(true)
      if (animationInterval) {
        clearInterval(animationInterval)
      }
      return
    }

    setGrid((prevGrid) => {
      const newGrid = prevGrid.slice()
      if (currentStep < visitedNodesInOrder.length) {
        const { row, col } = visitedNodesInOrder[currentStep]
        newGrid[row][col] = {
          ...newGrid[row][col],
          isVisited: true,
        }
      } else {
        const pathIndex = currentStep - visitedNodesInOrder.length
        const node = nodesInShortestPath[pathIndex]
        newGrid[node.row][node.col] = {
          ...newGrid[node.row][node.col],
          isPath: true,
        }
      }
      return newGrid
    })

    currentStepRef.current += 1
    setCurrentStep(currentStepRef.current)
  }, [visitedNodesInOrder, nodesInShortestPath, animationInterval])

  useEffect(() => {
    if (isRunning && !isPaused) {
      const interval = setInterval(visualizeStep, 1000 - animationSpeed * 10)
      setAnimationInterval(interval)
    } else if (animationInterval) {
      clearInterval(animationInterval)
    }
    return () => {
      if (animationInterval) {
        clearInterval(animationInterval)
      }
    }
  }, [isRunning, isPaused, animationSpeed])

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
      if (animationInterval) {
        clearInterval(animationInterval)
      }
      visualizeStep()
    }
  }

  const handleStepBackward = () => {
    if (currentStep > 0) {
      setIsPaused(true)
      setIsRunning(false)
      if (animationInterval) {
        clearInterval(animationInterval)
      }
      setCurrentStep((prev) => prev - 1)
      setGrid((prevGrid) => {
        const newGrid = prevGrid.slice()
        let node
        if (currentStep <= visitedNodesInOrder.length) {
          const { row, col } = visitedNodesInOrder[currentStep - 1]
          newGrid[row][col] = {
            ...newGrid[row][col],
            isVisited: false,
          }
        } else {
          const pathIndex = currentStep - visitedNodesInOrder.length - 1
          node = nodesInShortestPath[pathIndex]
          newGrid[node.row][node.col] = {
            ...newGrid[node.row][node.col],
            isPath: false,
          }
        }
        return newGrid
      })
    }
  }

  const handleSpeedChange = (value: number[]) => {
    setAnimationSpeed(value[0])
    if (isRunning && !isPaused) {
      if (animationInterval) {
        clearInterval(animationInterval)
      }
      const newInterval = setInterval(visualizeStep, 1000 - value[0] * 10)
      setAnimationInterval(newInterval)
    }
  }

  return (
    <div className="flex flex-col items-center p-4">
      <div className="flex w-full justify-between items-center">
        <TabsComponent setCurrentTool={setCurrentTool} />
        <Button
          onClick={generateSteps}
          disabled={isVisualized}
          className="rounded-full gap-2"
          size="sm"
        >
          <ListRestart className="w-4 h-4 sm:hidden" />
          <span className="hidden sm:inline">Generate Steps</span>
        </Button>
        <Button
          onClick={handleStartPause}
          className="rounded-full gap-2"
          size="sm"
        >
          {isRunning && !isPaused ? (
            <Pause className="w-4 h-4 sm:hidden" />
          ) : (
            <Play className="w-4 h-4 sm:hidden" />
          )}
          <span className="hidden sm:inline">
            {isRunning && !isPaused ? 'Pause' : 'Start/Resume'}
          </span>
        </Button>
        <Button
          onClick={handleStepForward}
          className="rounded-full gap-2"
          size="sm"
          disabled={
            !isVisualized ||
            currentStep >=
              visitedNodesInOrder.length + nodesInShortestPath.length
          }
        >
          <SkipForward className="w-4 h-4 sm:hidden" />
          <span className="hidden sm:inline">Step Forward</span>
        </Button>
        <Button
          onClick={handleStepBackward}
          className="rounded-full gap-2"
          size="sm"
          disabled={!isVisualized || currentStep <= 0}
        >
          <SkipBack className="w-4 h-4 sm:hidden" />
          <span className="hidden sm:inline">Step Backward</span>
        </Button>
        <Button onClick={handleReset} className="rounded-full gap-2" size="sm">
          <RotateCcw className="w-4 h-4 sm:hidden" />
          <span className="hidden sm:inline">Reset</span>
        </Button>
      </div>
      <div className="m-4 flex items-center space-x-4">
        <span>Animation Speed:</span>
        <Slider
          defaultValue={[50]}
          max={100}
          step={1}
          onValueChange={handleSpeedChange}
          className="w-48"
        />
      </div>
      <div className="mb-4">
        <p>Total Visited Nodes: {totalVisitedNodes}</p>
        <p>Shortest Path Length: {shortestPathLength}</p>
      </div>
      <div
        className="grid gap-[1px] bg-gray-200"
        style={{ gridTemplateColumns: `repeat(${GRID_COLS}, 20px)` }}
      >
        {grid.map((row, rowIdx) =>
          row.map((node, nodeIdx) => (
            <div
              key={`${rowIdx}-${nodeIdx}`}
              className={`w-5 h-5 ${getNodeClassName(node)} border border-gray-300 flex items-center justify-center`}
              onMouseDown={() => handleMouseDown(rowIdx, nodeIdx)}
              onMouseEnter={() => handleMouseEnter(rowIdx, nodeIdx)}
              onMouseUp={handleMouseUp}
            >
              {node.isStart && <PlaneTakeoff className="w-3 h-3 text-white" />}
              {node.isEnd && <Target className="w-3 h-3 text-white" />}
            </div>
          )),
        )}
      </div>
    </div>
  )
}
