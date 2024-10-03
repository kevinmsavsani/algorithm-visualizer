'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
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

interface UseAlgorithmProps {
  startNode: { row: number; col: number }
  endNode: { row: number; col: number }
  GRID_ROWS: number
  GRID_COLS: number
  algorithmMethod: (grid: Node[][]) => { row: number; col: number }[]
}

export const useAlgorithm = ({
  startNode,
  endNode,
  GRID_ROWS,
  GRID_COLS,
  algorithmMethod,
}: UseAlgorithmProps) => {
  const [grid, setGrid] = useState<Node[][]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [visitedNodesInOrder, setVisitedNodesInOrder] = useState<{ row: number; col: number }[]>([])
  const [nodesInShortestPath, setNodesInShortestPath] = useState<Node[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [animationSpeed, setAnimationSpeed] = useState(100)
  const [totalVisitedNodes, setTotalVisitedNodes] = useState(0)
  const [shortestPathLength, setShortestPathLength] = useState(0)
  const [isVisualized, setIsVisualized] = useState(false)
  const [animationInterval, setAnimationInterval] = useState<NodeJS.Timeout | null>(null)
  
  const currentStepRef = useRef(0)
  const gridRef = useRef(grid)

  const createNode = (row: number, col: number, preserveWalls: boolean = false, oldNode?: Node): Node => {
    return {
      row,
      col,
      isStart: row === startNode.row && col === startNode.col,
      isEnd: row === endNode.row && col === endNode.col,
      isWall: preserveWalls && oldNode ? oldNode.isWall : false,
      isVisited: false,
      isPath: false,
      distance: Infinity,
      previousNode: null,
    }
  }

  const initializeGrid = useCallback((preserveWalls: boolean = false) => {
    const newGrid = []
    for (let row = 0; row < GRID_ROWS; row++) {
      const currentRow = []
      for (let col = 0; col < GRID_COLS; col++) {
        const oldNode = preserveWalls && gridRef.current[row] ? gridRef.current[row][col] : undefined
        currentRow.push(createNode(row, col, preserveWalls, oldNode))
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
  }, [startNode, endNode, GRID_ROWS, GRID_COLS])

  useEffect(() => {
    // When start/end nodes change, preserve the walls
    if (gridRef.current.length > 0) {
      initializeGrid(true)
    } else {
      initializeGrid(false)
    }
  }, [initializeGrid])

  useEffect(() => {
    gridRef.current = grid
  }, [grid])

  const getNodesInShortestPathOrder = (finishNode: Node) => {
    const nodesInShortestPathOrder = []
    let currentNode: Node | null = finishNode
    while (currentNode !== null) {
      nodesInShortestPathOrder.unshift(currentNode)
      currentNode = currentNode.previousNode
    }
    return nodesInShortestPathOrder
  }

  const toggleWall = (oldGrid: Node[][], row: number, col: number) => {
    const newGrid = oldGrid.slice()
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
    const output = algorithmMethod(cloneDeep(grid))
    const shortestPath = getNodesInShortestPathOrder(output[output.length - 1])
    setVisitedNodesInOrder(output)
    setNodesInShortestPath(shortestPath)
    setTotalVisitedNodes(output.length)
    setShortestPathLength(shortestPath.length)
    setIsVisualized(true)
  }

  const visualizeStep = useCallback(() => {
    const currentStep = currentStepRef.current
    if (currentStep >= visitedNodesInOrder.length + nodesInShortestPath.length) {
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
      const interval = setInterval(visualizeStep, animationSpeed)
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

  return {
    grid,
    setGrid,
    isRunning,
    setIsRunning,
    isPaused,
    setIsPaused,
    currentStep,
    setCurrentStep,
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
  }
}