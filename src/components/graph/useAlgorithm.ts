import { Edge, Graph, Node } from '@/types'
import { useState, useEffect, useCallback, useRef } from 'react'

export const ROW_SIZE = 10
export const COL_SIZE = 20
export const CELL_SIZE = 60

export function useAlgorithm(totalNodes: number, resultSize: number) {
  const [graph, setGraph] = useState<Graph>({ nodes: [], edges: [] })
  const [currentStep, setCurrentStep] = useState<number>(-1)
  const [selectionMode, setSelectionMode] = useState<'start' | 'end' | 'add'>('add')
  const [isAnimating, setIsAnimating] = useState<boolean>(false)
  const [animationSpeed, setAnimationSpeed] = useState<number>(500)
  const [directionType, setDirectionType] = useState<string>('undirected')
  const animationRef = useRef<NodeJS.Timeout | null>(null)

  const generateRandomGraph = useCallback(() => {
    const nodes: Node[] = []
    const a = ((COL_SIZE - 2) * CELL_SIZE) / 2 // Semi-major axis
    const b = ((ROW_SIZE - 2) * CELL_SIZE) / 2 // Semi-minor axis
    const centerX = a
    const centerY = b
  
    for (let i = 0; i < totalNodes; i++) {
      const angle = (2 * Math.PI * i) / totalNodes
      let x = centerX + a * Math.cos(angle)
      let y = centerY + b * Math.sin(angle)
  
      // Snap to nearest grid point
      x = Math.round(x / CELL_SIZE) * CELL_SIZE
      y = Math.round(y / CELL_SIZE) * CELL_SIZE
  
      nodes.push({ id: i, x, y })
    }
  
    const edges: Edge[] = []
    for (let i = 0; i < totalNodes; i++) {
      const numEdges = Math.floor(Math.random() * 2) + 1 // 1 to 3 edges per node
      for (let j = 0; j < numEdges; j++) {
        let target
        do {
          target = Math.floor(Math.random() * totalNodes)
        } while (target === i)
        edges.push({
          source: i,
          target,
          weight: Math.floor(Math.random() * 100) + 1,
        })
      }
    }
  
    setGraph({ nodes, edges })
    resetVisualization()
  }, [totalNodes])

  const generateRandomTree = () => {
    const nodes: Node[] = Array.from({ length: totalNodes }, (_, i) => ({
      id: i,
      x: 0,
      y: 0,
    }))

    const edges: Edge[] = []
    for (let i = 1; i < totalNodes; i++) {
      const parent = Math.floor(Math.random() * i)
      edges.push({ source: parent, target: i, weight: Math.floor(Math.random() * 10) })
    }

    const root = 0
    const assignCoordinates = (
      nodeId: number,
      depth: number,
      leftBound: number,
      rightBound: number,
    ) => {
      const node = nodes[nodeId]
      node.x = Math.floor((leftBound + rightBound) / 2) * CELL_SIZE
      node.y = depth * CELL_SIZE

      const children = edges
        .filter((e) => e.source === nodeId)
        .map((e) => e.target)
      const width = (rightBound - leftBound) / children.length
      children.forEach((childId, i) => {
        const childLeftBound = leftBound + i * width
        const childRightBound = childLeftBound + width
        assignCoordinates(childId, depth + 1, childLeftBound, childRightBound)
      })
    }

    assignCoordinates(root, 0, 0, COL_SIZE)

    setGraph({ nodes, edges })
    resetVisualization()
  }

  const toggleAnimation = () => {
    if (isAnimating) {
      stopAnimation()
    } else {
      if (currentStep === -1) {
        setCurrentStep(0)
      }
      setIsAnimating(true)
    }
  }

  const stopAnimation = useCallback(() => {
    if (animationRef.current) {
      clearTimeout(animationRef.current)
    }
    setIsAnimating(false)
  }, [])

  const resetVisualization = () => {
    stopAnimation()
    setCurrentStep(-1)
  }

  const stepForward = () => {
    if (currentStep < resultSize - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const stepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  useEffect(() => {
    if (isAnimating && currentStep < resultSize - 1) {
      animationRef.current = setTimeout(() => {
        setCurrentStep((step) => step + 1)
      }, animationSpeed)
    } else if (currentStep >= resultSize - 1) {
      setIsAnimating(false)
    }

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current)
      }
    }
  }, [isAnimating, currentStep, resultSize, animationSpeed])

  return {
    setGraph,
    graph,
    currentStep,
    isAnimating,
    generateRandomTree,
    generateRandomGraph,
    toggleAnimation,
    stepForward,
    stepBackward,
    resetVisualization,
    animationSpeed,
    setAnimationSpeed,
    selectionMode,
    setSelectionMode,
    directionType,
    setDirectionType,
  }
}
