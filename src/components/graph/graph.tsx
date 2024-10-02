import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import React from 'react'
import { CELL_SIZE, COL_SIZE, ROW_SIZE } from '@/components/graph/useAlgorithm'
import { Edge } from '@/types'

interface GraphProps {
  graph: any
  result: Edge[]
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

const Graph: React.FC<GraphProps> = ({
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
      const currentEdge = result[currentStep]
      if (
        edge.source === currentEdge.source &&
        edge.target === currentEdge.target
      ) {
        return 'stroke-blue-300 dark:stroke-green-300'
      }
    }
    if (currentStep === result.length - 1) {
      if (
        result.some(
          (e) =>
            (e.source === edge.source && e.target === edge.target) ||
            (e.source === edge.target && e.target === edge.source),
        )
      ) {
        return 'stroke-green-300 dark:stroke-green-300'
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
        className="border border-gray-300 dark:border-gray-700 w-full sm:w-4/5 lg:w-3/4"
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
                    className={`${getEdgeColor(edge)}`}
                  />
                  <circle
                    cx={midX}
                    cy={midY}
                    r="8"
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
              const isVisited = result.some(
                (edge) => edge.source === node.id || edge.target === node.id,
              )
              const isCurrent =
                currentStep >= 0 &&
                (result[currentStep].source === node.id ||
                  result[currentStep].target === node.id)
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
                          : isCurrent && currentStep < result.length - 1
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
                  isAllowClick
                    ? handleGridClick(col * CELL_SIZE, row * CELL_SIZE)
                    : ''
                }
                style={{ cursor: 'pointer' }}
              />
            )),
          )}
        </g>
      </svg>
      {isAllowClick && (
        <div className="mt-4 text-center">
          <div className="mb-2 text-black dark:text-white">
            Traversal Order:{' '}
            <span className="text-blue-600 dark:text-blue-300">
              {result
                .map((edge) => `${edge.source} -> ${edge.target}`)
                .join(' -> ')}
            </span>
          </div>
          <div className="text-black dark:text-white">
            Current Step:{' '}
            <span className="text-blue-600 dark:text-blue-300">
              {currentStep >= 0 ? currentStep + 1 : 0}
            </span>{' '}
            /{' '}
            <span className="text-blue-600 dark:text-blue-300">
              {result.length}
            </span>
          </div>
          <div className="text-black dark:text-white">
            Start Node:{' '}
            <span className="text-blue-600 dark:text-blue-300">
              {startNode !== null ? startNode : 'Not selected'}
            </span>
          </div>
          <div className="text-black dark:text-white">
            End Node:{' '}
            <span className="text-blue-600 dark:text-blue-300">
              {endNode !== null ? endNode : 'Not selected'}
            </span>
          </div>
        </div>
      )}
    </>
  )
}

export default Graph
