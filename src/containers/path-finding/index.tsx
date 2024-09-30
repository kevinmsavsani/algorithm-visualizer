'use client'

import React, { useState, useEffect, useCallback } from 'react'
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
} from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  dijkstra,
  getNodeClassName,
  getNodesInShortestPathOrder,
  toggleWall,
} from './utils'
import { cloneDeep } from 'lodash'

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
      setStartNode({ row, col })
    } else if (currentTool === 'end') {
      setEndNode({ row, col })
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

  const generateSteps = () => {
    if (isVisualized) return
    const start = grid[startNode.row][startNode.col]
    const end = grid[endNode.row][endNode.col]
    const output = dijkstra(cloneDeep(grid), start, end)
    const shortestPath = getNodesInShortestPathOrder(output[output.length - 1])
    setVisitedNodesInOrder(output)
    setNodesInShortestPath(shortestPath)
    setTotalVisitedNodes(output.length)
    setShortestPathLength(shortestPath.length)
    setIsVisualized(true)
  }

  const visualizeStep = useCallback(() => {
      if (currentStep >= visitedNodesInOrder.length + nodesInShortestPath.length) {
        setIsRunning(false);
        setIsPaused(true);
        if (animationInterval) {
          clearInterval(animationInterval);
        }
        return;
      }
  
      setGrid((prevGrid) => {
        const newGrid = prevGrid.slice();
        if (currentStep < visitedNodesInOrder.length) {
          const { row, col } = visitedNodesInOrder[currentStep];
          newGrid[row][col] = {
            ...newGrid[row][col],
            isVisited: true,
          };
        } else {
          const pathIndex = currentStep - visitedNodesInOrder.length;
          const node = nodesInShortestPath[pathIndex];
          newGrid[node.row][node.col] = {
            ...newGrid[node.row][node.col],
            isPath: true,
          };
        }
        return newGrid;
      });
  
      setCurrentStep((prev) => prev + 1);
    }, [currentStep, visitedNodesInOrder, nodesInShortestPath, animationInterval]);
  
    useEffect(() => {
      if (isRunning && !isPaused) {
        const interval = setInterval(visualizeStep, 100 - animationSpeed);
        setAnimationInterval(interval);
      } else if (animationInterval) {
        clearInterval(animationInterval);
      }
      return () => {
        if (animationInterval) {
          clearInterval(animationInterval);
        }
      };
    }, [isRunning, isPaused, animationSpeed]);

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

  const handleReset = () => {
    setIsRunning(false)
    setIsPaused(false)
    setIsVisualized(false)
    if (animationInterval) {
      clearInterval(animationInterval)
    }
    initializeGrid()
  }

  const handleSpeedChange = (value: number[]) => {
    setAnimationSpeed(value[0])
    if (isRunning && !isPaused) {
      if (animationInterval) {
        clearInterval(animationInterval)
      }
      const newInterval = setInterval(visualizeStep, 5000 - value[0] * 10)
      setAnimationInterval(newInterval)
    }
  }

  return (
    <div className="flex flex-col items-center p-4">
      <div className="flex w-full justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">Pathfinding Visualizer</h1>
        <div className="flex mb-4 space-x-2">
          <Tabs defaultValue="wall">
            <TabsList>
              <TabsTrigger value="wall" onClick={() => setCurrentTool('wall')}>
                Wall
              </TabsTrigger>
              <TabsTrigger
                value="start"
                onClick={() => setCurrentTool('start')}
              >
                Start
              </TabsTrigger>
              <TabsTrigger value="end" onClick={() => setCurrentTool('end')}>
                End
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button onClick={generateSteps} disabled={isVisualized}>
            Generate Steps
          </Button>
          <Button onClick={handleStartPause}>
            {isRunning && !isPaused ? (
              <Pause className="w-4 h-4 mr-2" />
            ) : (
              <Play className="w-4 h-4 mr-2" />
            )}
            {isRunning && !isPaused ? 'Pause' : 'Start/Resume'}
          </Button>
          <Button
            onClick={handleStepForward}
            disabled={
              !isVisualized ||
              currentStep >=
                visitedNodesInOrder.length + nodesInShortestPath.length
            }
          >
            <SkipForward className="w-4 h-4 mr-2" />
            Step Forward
          </Button>
          <Button
            onClick={handleStepBackward}
            disabled={!isVisualized || currentStep <= 0}
          >
            <SkipBack className="w-4 h-4 mr-2" />
            Step Backward
          </Button>
          <Button onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>
      <div className="mb-4 flex items-center space-x-4">
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
