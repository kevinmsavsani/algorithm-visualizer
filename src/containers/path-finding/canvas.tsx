'use client'

import React from 'react'
import { PlaneTakeoff, Target } from 'lucide-react'

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

interface CanvasProps {
  grid: Node[][]
  GRID_COLS: number
  onMouseDown: (row: number, col: number) => void
  onMouseEnter: (row: number, col: number) => void
  onMouseUp: () => void
}

export default function Canvas({
  grid,
  GRID_COLS,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
}: CanvasProps) {
  const getNodeClassName = (node: Node): string => {
    if (node.isStart) return 'bg-green-500'
    if (node.isEnd) return 'bg-red-500'
    if (node.isPath) return 'bg-yellow-300'
    if (node.isVisited) return 'bg-blue-300'
    if (node.isWall) return 'bg-gray-800'
    return 'bg-white'
  }

  return (
    <div
      className="grid gap-[1px] bg-gray-200"
      style={{ gridTemplateColumns: `repeat(${GRID_COLS}, 20px)` }}
    >
      {grid.map((row, rowIdx) =>
        row.map((node, nodeIdx) => (
          <div
            key={`${rowIdx}-${nodeIdx}`}
            className={`w-5 h-5 ${getNodeClassName(node)} border border-gray-300 flex items-center justify-center`}
            onMouseDown={() => onMouseDown(rowIdx, nodeIdx)}
            onMouseEnter={() => onMouseEnter(rowIdx, nodeIdx)}
            onMouseUp={onMouseUp}
          >
            {node.isStart && <PlaneTakeoff className="w-3 h-3 text-white" />}
            {node.isEnd && <Target className="w-3 h-3 text-white" />}
          </div>
        )),
      )}
    </div>
  )
}