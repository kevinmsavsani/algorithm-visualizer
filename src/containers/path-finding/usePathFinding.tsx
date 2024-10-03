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

const GRID_ROWS = 20
const GRID_COLS = 30

interface UseAlgorithmProps {
  algorithmMethod: (grid: Node[][]) => { row: number; col: number }[]
}

export const useAlgorithm = ({ algorithmMethod }: UseAlgorithmProps) => {
  const [mouseIsPressed, setMouseIsPressed] = useState(false)
  const [selectedMode, setSelectedMode] = useState<'wall' | 'start' | 'end'>(
    'wall',
  )
  const [grid, setGrid] = useState<Node[][]>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [visitedNodesInOrder, setVisitedNodesInOrder] = useState<
    { row: number; col: number }[]
  >([])
  const [nodesInShortestPath, setNodesInShortestPath] = useState<Node[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [animationSpeed, setAnimationSpeed] = useState(100)
  const [totalVisitedNodes, setTotalVisitedNodes] = useState(0)
  const [shortestPathLength, setShortestPathLength] = useState(0)
  const [isVisualized, setIsVisualized] = useState(false)
  const [animationInterval, setAnimationInterval] =
    useState<NodeJS.Timeout | null>(null)
  const [startNode, setStartNode] = useState<{ row: number; col: number }>({
    row: 10,
    col: 10,
  })
  const [endNode, setEndNode] = useState<{ row: number; col: number }>({
    row: 10,
    col: 20,
  })
  const currentStepRef = useRef(0)
  const gridRef = useRef(grid)

  const createNode = (
    row: number,
    col: number,
    preserveWalls: boolean = false,
    oldNode?: Node,
  ): Node => {
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

  const initializeGrid = useCallback(
    (preserveWalls: boolean = false) => {
      const newGrid = []
      for (let row = 0; row < GRID_ROWS; row++) {
        const currentRow = []
        for (let col = 0; col < GRID_COLS; col++) {
          const oldNode =
            preserveWalls && gridRef.current[row]
              ? gridRef.current[row][col]
              : undefined
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
    },
    [startNode, endNode, GRID_ROWS, GRID_COLS],
  )

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
    if (
      currentStep >=
      visitedNodesInOrder.length + nodesInShortestPath.length
    ) {
      setIsAnimating(false)
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
    if (isAnimating && !isPaused) {
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
  }, [isAnimating, isPaused, animationSpeed])

  const resetVisualization = () => {
    setIsAnimating(false)
    setIsPaused(false)
    initializeGrid()
  }

  const toggleAnimation = () => {
    if (!isVisualized) {
      generateSteps()
    }
    if (isAnimating) {
      setIsPaused(true)
      setIsAnimating(false)
    } else {
      setIsPaused(false)
      setIsAnimating(true)
    }
  }

  const stepForward = () => {
    if (currentStep < visitedNodesInOrder.length + nodesInShortestPath.length) {
      setIsPaused(true)
      setIsAnimating(false)
      visualizeStep()
    }
  }

  const stepBackward = () => {
    if (currentStep > 0) {
      setIsPaused(true)
      setIsAnimating(false)
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

  const handleMouseDown = (row: number, col: number) => {
    if (isAnimating) return
    if (selectedMode === 'wall') {
      const newGrid = toggleWall(grid, row, col)
      setGrid(newGrid)
    } else if (selectedMode === 'start') {
      const newGrid = [...grid]
      newGrid[startNode.row][startNode.col].isStart = false
      setStartNode({ row, col })
      newGrid[row][col].isStart = true
      setGrid(newGrid)
      setSelectedMode('wall')
    } else if (selectedMode === 'end') {
      const newGrid = [...grid]
      newGrid[endNode.row][endNode.col].isEnd = false
      setEndNode({ row, col })
      newGrid[row][col].isEnd = true
      setGrid(newGrid)
      setSelectedMode('wall')
    }
    setMouseIsPressed(true)
  }

  const handleMouseEnter = (row: number, col: number) => {
    if (!mouseIsPressed || isAnimating) return
    if (selectedMode === 'wall') {
      const newGrid = toggleWall(grid, row, col)
      setGrid(newGrid)
    }
  }

  const handleMouseUp = () => {
    setMouseIsPressed(false)
  }

  return {
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
    totalVisitedNodes,
    shortestPathLength,
  }
}
