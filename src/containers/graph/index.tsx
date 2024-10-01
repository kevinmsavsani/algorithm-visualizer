'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { motion, AnimatePresence } from 'framer-motion'
import { PlayIcon, PauseIcon } from 'lucide-react'
import { aStar, bellmanFord, bfs, dfs, dijkstra, floydWarshall, kruskal, prim, topologicalSort } from './algorithm'

interface Node {
  id: number
  x: number
  y: number
}

interface Edge {
  source: number
  target: number
}

interface Graph {
  nodes: Node[]
  edges: Edge[]
}

const GRID_SIZE = 10
const CELL_SIZE = 60

const GraphVisualization: React.FC = () => {
  const [graph, setGraph] = useState<Graph>({ nodes: [], edges: [] })
  const [algorithm, setAlgorithm] = useState<string>('bfs')
  const [traversalOrder, setTraversalOrder] = useState<number[]>([])
  const [currentStep, setCurrentStep] = useState<number>(-1)
  const [isAnimating, setIsAnimating] = useState<boolean>(false)
  const [animationSpeed, setAnimationSpeed] = useState<number>(500)
  const [totalNodes, setTotalNodes] = useState<number>(10)
  const [selectedNode, setSelectedNode] = useState<number | null>(null)
  const [stepsGenerated, setStepsGenerated] = useState<boolean>(false)
  const animationRef = useRef<NodeJS.Timeout | null>(null)

  const generateRandomGraph = () => {
    const nodes: Node[] = Array.from({ length: totalNodes }, (_, i) => ({
      id: i,
      x: Math.floor(Math.random() * GRID_SIZE) * CELL_SIZE,
      y: Math.floor(Math.random() * GRID_SIZE) * CELL_SIZE,
    }))

    const edges: Edge[] = []
    for (let i = 0; i < totalNodes; i++) {
      const numEdges = Math.floor(Math.random() * 3) + 1 // 1 to 3 edges per node
      for (let j = 0; j < numEdges; j++) {
        let target
        do {
          target = Math.floor(Math.random() * totalNodes)
        } while (target === i)
        edges.push({ source: i, target })
      }
    }

    setGraph({ nodes, edges })
    resetVisualization()
  }

  const generateRandomTree = () => {
    const nodes: Node[] = Array.from({ length: totalNodes }, (_, i) => ({
      id: i,
      x: 0,
      y: 0,
    }))

    const edges: Edge[] = []
    for (let i = 1; i < totalNodes; i++) {
      const parent = Math.floor(Math.random() * i)
      edges.push({ source: parent, target: i })
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

    assignCoordinates(root, 0, 0, GRID_SIZE)

    setGraph({ nodes, edges })
    resetVisualization()
  }

  const generateSteps = () => {
    const startNode = graph.nodes[0]?.id ?? 0
    const order = (() => {
      switch (algorithm) {
        case 'bfs':
          return bfs(graph, startNode)
        case 'dfs':
          return dfs(graph, startNode)
        case 'dijkstra':  
          return dijkstra(graph, startNode)
        case 'astar':
          return aStar(graph, startNode)
        case 'prim':
          return prim(graph, startNode)
        case 'kruskal':
          return kruskal(graph, startNode)
        case 'bellman-ford':
          return bellmanFord(graph, startNode)
        case 'floyd-warshall':
          return floydWarshall(graph, startNode)
        case 'topological-sort':
          return topologicalSort(graph, startNode)
        default:
          throw new Error(`Unknown algorithm: ${algorithm}`)
      }
    })()
    setTraversalOrder(order)
    setCurrentStep(-1)
    setStepsGenerated(true)
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
    setTraversalOrder([])
    setCurrentStep(-1)
    setStepsGenerated(false)
  }

  const stepForward = () => {
    if (currentStep < traversalOrder.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const stepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleGridClick = (x: number, y: number) => {
    const existingNode = graph.nodes.find(
      (node) => node.x === x && node.y === y,
    )
    if (existingNode) {
      if (selectedNode === null) {
        setSelectedNode(existingNode.id)
      } else {
        setGraph((prevGraph) => ({
          ...prevGraph,
          edges: [
            ...prevGraph.edges,
            { source: selectedNode, target: existingNode.id },
          ],
        }))
        setSelectedNode(null)
      }
    } else {
      const newNode: Node = { id: graph.nodes.length, x, y }
      setGraph((prevGraph) => ({
        ...prevGraph,
        nodes: [...prevGraph.nodes, newNode],
      }))
    }
    resetVisualization()
  }

  useEffect(() => {
    if (isAnimating && currentStep < traversalOrder.length - 1) {
      animationRef.current = setTimeout(() => {
        setCurrentStep((step) => step + 1)
      }, animationSpeed)
    } else if (currentStep >= traversalOrder.length - 1) {
      setIsAnimating(false)
    }

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current)
      }
    }
  }, [isAnimating, currentStep, traversalOrder.length, animationSpeed])

  return (
    <div className="flex flex-col items-center space-y-4 p-4 dark:bg-black dark:text-white">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 p-4">
        <Button onClick={generateRandomGraph}>Generate Random Graph</Button>
        <Button onClick={generateRandomTree}>Generate Random Tree</Button>
        <Input
          type="number"
          value={totalNodes}
          onChange={(e) => setTotalNodes(Number(e.target.value))}
        />
        <Select value={algorithm} onValueChange={setAlgorithm}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Select algorithm" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bfs">Breadth-First Search</SelectItem>
            <SelectItem value="dfs">Depth-First Search</SelectItem>
            <SelectItem value="dijkstra">Dijkstra</SelectItem>
            <SelectItem value="astar">A*</SelectItem>
            <SelectItem value="prim">Prim's</SelectItem>
            <SelectItem value="kruskal">Kruskal</SelectItem>
            <SelectItem value="bellman-ford">Bellman-Ford</SelectItem>
            <SelectItem value="floyd-warshall">Floyd-Warshall</SelectItem>
            <SelectItem value="topological-sort">Topological Sort</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={generateSteps} disabled={graph.nodes.length === 0}>
          Generate Steps
        </Button>
        <div className="flex items-center space-x-2 col-span-1 md:col-span-2">
          <Label htmlFor="speed">Animation Speed:</Label>
          <Slider
            id="speed"
            min={100}
            max={2000}
            step={100}
            value={[animationSpeed]}
            onValueChange={(value) => setAnimationSpeed(value[0])}
            className="w-full md:w-[200px]"
          />
          <span>{animationSpeed}ms</span>
        </div>

        <Button onClick={toggleAnimation} disabled={!stepsGenerated}>
          {isAnimating ? (
            <PauseIcon className="mr-2 h-4 w-4" />
          ) : (
            <PlayIcon className="mr-2 h-4 w-4" />
          )}
          {isAnimating ? 'Pause' : 'Start'}
        </Button>
        <Button onClick={resetVisualization}>Reset</Button>
        <Button
          onClick={stepBackward}
          disabled={!stepsGenerated || currentStep <= 0}
        >
          Step Back
        </Button>
        <Button
          onClick={stepForward}
          disabled={!stepsGenerated || currentStep >= traversalOrder.length - 1}
        >
          Step Forward
        </Button>
      </div>
      <svg
        width="100%"
        height="auto"
        viewBox={`0 0 ${GRID_SIZE * CELL_SIZE} ${GRID_SIZE * CELL_SIZE}`}
        className="border border-gray-300 dark:border-gray-700 w-full sm:w-3/5 lg:w-1/2"
      >
        <g>
          {/* Grid */}
          {Array.from({ length: GRID_SIZE }).map((_, i) => (
            <React.Fragment key={`grid-${i}`}>
              <line
                x1={0}
                y1={i * CELL_SIZE}
                x2={GRID_SIZE * CELL_SIZE}
                y2={i * CELL_SIZE}
                stroke="lightgray"
                strokeWidth="1"
                className="dark:stroke-gray-600"
              />
              <line
                x1={i * CELL_SIZE}
                y1={0}
                x2={i * CELL_SIZE}
                y2={GRID_SIZE * CELL_SIZE}
                stroke="lightgray"
                strokeWidth="1"
                className="dark:stroke-gray-600"
              />
            </React.Fragment>
          ))}
          {/* Edges */}
          {graph.edges.map((edge, index) => {
            const sourceNode = graph.nodes.find((n) => n.id === edge.source)
            const targetNode = graph.nodes.find((n) => n.id === edge.target)
            if (sourceNode && targetNode) {
              return (
                <line
                  key={`edge-${index}`}
                  x1={sourceNode.x + CELL_SIZE / 2}
                  y1={sourceNode.y + CELL_SIZE / 2}
                  x2={targetNode.x + CELL_SIZE / 2}
                  y2={targetNode.y + CELL_SIZE / 2}
                  stroke="black"
                  strokeWidth="2"
                  className="dark:stroke-white"
                />
              )
            }
            return null
          })}
          {/* Nodes */}
          <AnimatePresence>
            {graph.nodes.map((node) => {
              const isVisited = traversalOrder
                .slice(0, currentStep + 1)
                .includes(node.id)
              const isCurrent =
                currentStep >= 0 && traversalOrder[currentStep] === node.id
              return (
                <motion.g
                  key={`node-${node.id}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <circle
                    cx={node.x + CELL_SIZE / 2}
                    cy={node.y + CELL_SIZE / 2}
                    r={CELL_SIZE / 3}
                    fill={isCurrent ? 'red' : isVisited ? 'lightblue' : 'white'}
                    stroke="black"
                    strokeWidth="2"
                  />
                  <text
                    x={node.x + CELL_SIZE / 2}
                    y={node.y + CELL_SIZE / 2}
                    textAnchor="middle"
                    dy=".3em"
                    fontSize="12"
                    className="dark:text-black"
                  >
                    {node.id}
                  </text>
                </motion.g>
              )
            })}
          </AnimatePresence>
          {/* Clickable areas for adding nodes */}
          {Array.from({ length: GRID_SIZE }).map((_, row) =>
            Array.from({ length: GRID_SIZE }).map((_, col) => (
              <rect
                key={`cell-${row}-${col}`}
                x={col * CELL_SIZE}
                y={row * CELL_SIZE}
                width={CELL_SIZE}
                height={CELL_SIZE}
                fill="transparent"
                onClick={() =>
                  handleGridClick(col * CELL_SIZE, row * CELL_SIZE)
                }
                style={{ cursor: 'pointer' }}
              />
            )),
          )}
        </g>
      </svg>
      <div className="mt-4 text-center">
        <div className="mb-2">
          Traversal Order: {traversalOrder.join(' -> ')}
        </div>
        <div>
          Current Step: {currentStep >= 0 ? currentStep + 1 : 0} /{' '}
          {traversalOrder.length}
        </div>
      </div>
    </div>
  )
}

export default GraphVisualization
