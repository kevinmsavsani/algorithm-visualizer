import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { CELL_SIZE, COL_SIZE, ROW_SIZE } from './useAlgorithm'
import { Edge, GraphProps } from '@/types'

export function Graph({ graph, result, currentStep }: GraphProps) {
  const getEdgeColor = (edge: Edge) => {
    if (
      result
        .slice(0, currentStep + 1)
        .some(
          (e) =>
            (e.source === edge.source && e.target === edge.target) ||
            (e.source === edge.target && e.target === edge.source),
        )
    ) {
      return 'stroke-blue-500 dark:stroke-blue-300'
    }
    return 'stroke-gray-300 dark:stroke-gray-600'
  }

  return (
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
                  className={cn(getEdgeColor(edge))}
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
          {graph.nodes.map((node) => (
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
                fill="white"
                stroke="black"
                strokeWidth="2"
              />
              <text
                x={node.x + CELL_SIZE / 2}
                y={node.y + CELL_SIZE / 2}
                textAnchor="middle"
                dy=".3em"
                fontSize="12"
                fill="black"
                className="dark:fill-black"
              >
                {node.id}
              </text>
            </motion.g>
          ))}
        </AnimatePresence>
      </g>
    </svg>
  )
}
