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
  RotateCcw,
} from 'lucide-react'

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
const GRID_COLS = 50

export default function EnhancedPathfindingVisualizer() {
  const [grid, setGrid] = useState<Node[][]>([])
  const [mouseIsPressed, setMouseIsPressed] = useState(false)
  const [startNode, setStartNode] = useState<{ row: number; col: number }>({
    row: 10,
    col: 15,
  })
  const [endNode, setEndNode] = useState<{ row: number; col: number }>({
    row: 10,
    col: 35,
  })
  const [currentTool, setCurrentTool] = useState<'wall' | 'start' | 'end'>(
    'wall',
  )
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [visitedNodesInOrder, setVisitedNodesInOrder] = useState<Node[]>([])
  const [nodesInShortestPath, setNodesInShortestPath] = useState<Node[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [animationSpeed, setAnimationSpeed] = useState(50)
  const [totalVisitedNodes, setTotalVisitedNodes] = useState(0)
  const [shortestPathLength, setShortestPathLength] = useState(0)

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

  const visualizeDijkstra = () => {
    if (isRunning) return
    const start = grid[startNode.row][startNode.col]
    const end = grid[endNode.row][endNode.col]
    const visitedNodesInOrder = dijkstra(grid, start, end)
    const shortestPath = getNodesInShortestPathOrder(end)
    setVisitedNodesInOrder(visitedNodesInOrder)
    setNodesInShortestPath(shortestPath)
    setTotalVisitedNodes(visitedNodesInOrder.length)
    setShortestPathLength(shortestPath.length)
    setIsRunning(true)
    animateAlgorithm()
  }

  const animateAlgorithm = useCallback(() => {
    if (
      currentStep >=
      visitedNodesInOrder.length + nodesInShortestPath.length
    ) {
      setIsRunning(false)
      return
    }

    if (!isPaused) {
      if (currentStep < visitedNodesInOrder.length) {
        const node = visitedNodesInOrder[currentStep]
        setGrid((prevGrid) => {
          const newGrid = prevGrid.slice()
          const newNode = {
            ...newGrid[node.row][node.col],
            isVisited: true,
          }
          newGrid[node.row][node.col] = newNode
          return newGrid
        })
      } else {
        const pathIndex = currentStep - visitedNodesInOrder.length
        const node = nodesInShortestPath[pathIndex]
        setGrid((prevGrid) => {
          const newGrid = prevGrid.slice()
          const newNode = {
            ...newGrid[node.row][node.col],
            isPath: true,
          }
          newGrid[node.row][node.col] = newNode
          return newGrid
        })
      }
      setCurrentStep((prev) => prev + 1)
    }

    setTimeout(animateAlgorithm, 1000 - animationSpeed * 10)
  }, [
    currentStep,
    visitedNodesInOrder,
    nodesInShortestPath,
    isPaused,
    animationSpeed,
  ])

  useEffect(() => {
    if (isRunning) {
      animateAlgorithm()
    }
  }, [isRunning, animateAlgorithm])

  const dijkstra = (grid: Node[][], startNode: Node, endNode: Node) => {
    const visitedNodesInOrder = []
    startNode.distance = 0
    const unvisitedNodes = getAllNodes(grid)
    while (unvisitedNodes.length) {
      sortNodesByDistance(unvisitedNodes)
      const closestNode = unvisitedNodes.shift()!
      if (closestNode.isWall) continue
      if (closestNode.distance === Infinity) return visitedNodesInOrder
      closestNode.isVisited = true
      visitedNodesInOrder.push(closestNode)
      if (closestNode === endNode) return visitedNodesInOrder
      updateUnvisitedNeighbors(closestNode, grid)
    }
    return visitedNodesInOrder
  }

  const sortNodesByDistance = (unvisitedNodes: Node[]) => {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance)
  }

  const updateUnvisitedNeighbors = (node: Node, grid: Node[][]) => {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid)
    for (const neighbor of unvisitedNeighbors) {
      neighbor.distance = node.distance + 1
      neighbor.previousNode = node
    }
  }

  const getUnvisitedNeighbors = (node: Node, grid: Node[][]) => {
    const neighbors = []
    const { row, col } = node
    if (row > 0) neighbors.push(grid[row - 1][col])
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col])
    if (col > 0) neighbors.push(grid[row][col - 1])
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1])
    return neighbors.filter((neighbor) => !neighbor.isVisited)
  }

  const getAllNodes = (grid: Node[][]) => {
    const nodes = []
    for (const row of grid) {
      for (const node of row) {
        nodes.push(node)
      }
    }
    return nodes
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

  const handlePauseResume = () => {
    setIsPaused(!isPaused)
  }

  const handleStepForward = () => {
    if (currentStep < visitedNodesInOrder.length + nodesInShortestPath.length) {
      setIsPaused(true)
      setCurrentStep((prev) => prev + 1)
      animateAlgorithm()
    }
  }

  const handleReset = () => {
    setIsRunning(false)
    setIsPaused(false)
    initializeGrid()
  }

  const handleSpeedChange = (value: number[]) => {
    setAnimationSpeed(100 - value[0])
  }

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">
        Enhanced Pathfinding Visualizer
      </h1>
      <div className="mb-4 space-x-2">
        <Button
          onClick={() => setCurrentTool('wall')}
          variant={currentTool === 'wall' ? 'default' : 'outline'}
        >
          Wall
        </Button>
        <Button
          onClick={() => setCurrentTool('start')}
          variant={currentTool === 'start' ? 'default' : 'outline'}
        >
          <PlaneTakeoff className="w-4 h-4 mr-2" />
          Start
        </Button>
        <Button
          onClick={() => setCurrentTool('end')}
          variant={currentTool === 'end' ? 'default' : 'outline'}
        >
          <Target className="w-4 h-4 mr-2" />
          End
        </Button>
        <Button onClick={visualizeDijkstra} disabled={isRunning}>
          Visualize Dijkstra's Algorithm
        </Button>
        <Button onClick={handlePauseResume} disabled={!isRunning}>
          {isPaused ? (
            <Play className="w-4 h-4 mr-2" />
          ) : (
            <Pause className="w-4 h-4 mr-2" />
          )}
          {isPaused ? 'Resume' : 'Pause'}
        </Button>
        <Button
          onClick={handleStepForward}
          disabled={
            !isRunning ||
            currentStep >=
              visitedNodesInOrder.length + nodesInShortestPath.length
          }
        >
          <SkipForward className="w-4 h-4 mr-2" />
          Step Forward
        </Button>
        <Button onClick={handleReset}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
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
