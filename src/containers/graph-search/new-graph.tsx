import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import React from 'react'
import { CELL_SIZE, COL_SIZE, ROW_SIZE } from '@/components/graph/useAlgorithm'
import { Edge } from '@/types'

interface NewGraphProps {
  graph: any
  result: number[]
  currentStep: number
  isAllowClick?: boolean
  setStartNode?: (id: number) => void
  selectionMode?: string | null
  setSelectionMode?: (mode: string | null) => void
  selectedNode?: number | null
  setSelectedNode?: (id: number | null) => void
  setEndNode?: (id: number) => void
  startNode?: number | null
  endNode?: number | null
  setGraph?: (graph: any) => void
  resetVisualization?: () => void
}

const NewGraph: React.FC<NewGraphProps> = ({
  graph,
  isAllowClick = true,
  setStartNode,
  selectionMode,
  setSelectionMode,
  selectedNode,
  setSelectedNode,
  setEndNode,
  currentStep,
  result,
  startNode,
  endNode,
  setGraph,
  resetVisualization,
}) => {
  const handleGridClick = (x: number, y: number) => {
    const existingNode = graph.nodes.find(
      (node) => node.x === x && node.y === y,
    )
    if (existingNode) {
      if (selectionMode === 'start') {
        setStartNode(existingNode.id)
        setSelectionMode(null)
      } else if (selectionMode === 'end') {
        setEndNode(existingNode.id)
        setSelectionMode(null)
      } else if (selectedNode === null) {
        setSelectedNode(existingNode.id)
      } else {
        setGraph((prevGraph) => ({
          ...prevGraph,
          edges: [
            ...prevGraph.edges,
            {
              source: selectedNode,
              target: existingNode.id,
              weight: Math.floor(Math.random() * 10),
            },
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

  const getEdgeColor = (edge: Edge) => {
    if (currentStep >= 0 && currentStep < result.length - 1) {
      const currentNode = result[currentStep]
      const nextNode = result[currentStep + 1]
      if (
        (edge.source === currentNode && edge.target === nextNode) ||
        (edge.source === nextNode && edge.target === currentNode)
      ) {
        return 'stroke-blue dark:stroke-blue-300'
      }
    }
    if (currentStep === result.length - 1) {
      for (let i = 0; i < result.length - 1; i++) {
        const node = result[i]
        const nextNode = result[i + 1]
        if (
          (edge.source === node && edge.target === nextNode) ||
          (edge.source === nextNode && edge.target === node)
        ) {
          return 'stroke-green dark:stroke-green-300'
        }
      }
    }
    return 'stroke-black dark:stroke-gray-400'
  }

  return (
    <>
      <svg
        width="100%"
        height="auto"
        viewBox={`0 0 ${COL_SIZE * CELL_SIZE} ${ROW_SIZE * CELL_SIZE}`}
        className="border border-gray-300 dark:border-gray-700 w-full sm:w-3/5 lg:w-1/2"
      >
        <g>
          {/* Grid */}
          {Array.from({ length: ROW_SIZE + 1 }).map((_, i) => (
            <line
              key={`h-line-${i}`}
              x1={0}
              y1={i * CELL_SIZE}
              x2={COL_SIZE * CELL_SIZE}
              y2={i * CELL_SIZE}
              stroke="lightgray"
              strokeWidth="1"
              className="dark:stroke-gray-600"
            />
          ))}
          {Array.from({ length: COL_SIZE + 1 }).map((_, i) => (
            <line
              key={`v-line-${i}`}
              x1={i * CELL_SIZE}
              y1={0}
              x2={i * CELL_SIZE}
              y2={ROW_SIZE * CELL_SIZE}
              stroke="lightgray"
              strokeWidth="1"
              className="dark:stroke-gray-600"
            />
          ))}
          {/* Edges */}
          {graph.edges.map((edge, index) => {
            const sourceNode = graph.nodes.find((n) => n.id === edge.source)
            const targetNode = graph.nodes.find((n) => n.id === edge.target)
            if (sourceNode && targetNode) {
              const midX = (sourceNode.x + targetNode.x) / 2 + CELL_SIZE / 2
              const midY = (sourceNode.y + targetNode.y) / 2 + CELL_SIZE / 2
              return (
                <g key={`edge-${index}`}>
                  <line
                    x1={sourceNode.x + CELL_SIZE / 2}
                    y1={sourceNode.y + CELL_SIZE / 2}
                    x2={targetNode.x + CELL_SIZE / 2}
                    y2={targetNode.y + CELL_SIZE / 2}
                    strokeWidth="2"
                    className={cn(`${getEdgeColor(edge)}`)}
                  />
                  <circle
                    cx={midX}
                    cy={midY}
                    r="8"
                    stroke={getEdgeColor(edge)}
                    strokeWidth="1"
                    className="fill-gray-800 dark:fill-yellow-500"
                  />
                  <text
                    x={midX}
                    y={midY}
                    textAnchor="middle"
                    dy=".3em"
                    fontSize="10"
                    className="dark:fill-black fill-white"
                  >
                    {edge.weight}
                  </text>
                </g>
              )
            }
            return null
          })}

          {/* Nodes */}
          <AnimatePresence>
            {graph.nodes.map((node) => {
              const isVisited = result
                .slice(0, currentStep + 1)
                .includes(node.id)
              const isCurrent =
                currentStep >= 0 && result[currentStep] === node.id
              const isStart = node.id === startNode
              const isEnd = node.id === endNode
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
                    fill={
                      isStart
                        ? 'green'
                        : isEnd
                          ? 'red'
                          : isCurrent
                            ? 'purple'
                            : isVisited
                              ? 'lightblue'
                              : 'white'
                    }
                    stroke={isStart || isEnd ? 'gold' : 'black'}
                    strokeWidth={isStart || isEnd ? '4' : '2'}
                  />
                  <text
                    x={node.x + CELL_SIZE / 2}
                    y={node.y + CELL_SIZE / 2}
                    textAnchor="middle"
                    dy=".3em"
                    fontSize="12"
                    fill={isStart || isEnd ? 'white' : 'black'}
                    className="dark:fill-black"
                  >
                    {node.id}
                  </text>
                </motion.g>
              )
            })}
          </AnimatePresence>
          {/* Clickable areas for adding nodes */}
          {Array.from({ length: COL_SIZE }).map((_, row) =>
            Array.from({ length: COL_SIZE }).map((_, col) => (
              <rect
                key={`cell-${row}-${col}`}
                x={col * CELL_SIZE}
                y={row * CELL_SIZE}
                width={CELL_SIZE}
                height={CELL_SIZE}
                fill="transparent"
                onClick={() =>
                  isAllowClick ? handleGridClick(col * CELL_SIZE, row * CELL_SIZE): ''
                }
                style={{ cursor: 'pointer' }}
              />
            )),
          )}
        </g>
      </svg>
      <div className="mt-4 text-center">
        <div className="mb-2">Traversal Order: {result.join(' -> ')}</div>
        <div>
          Current Step: {currentStep >= 0 ? currentStep + 1 : 0} /{' '}
          {result.length}
        </div>
        <div>Start Node: {startNode !== null ? startNode : 'Not selected'}</div>
        <div>End Node: {endNode !== null ? endNode : 'Not selected'}</div>
      </div>
    </>
  )
}

export default NewGraph
