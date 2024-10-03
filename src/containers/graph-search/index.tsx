'use client'

import { useEffect, useState } from 'react'
import { ControlPanel } from '../../components/graph/control-panel'
import { useAlgorithm } from '../../components/graph/useAlgorithm'
import { Edge } from '@/types'
import Graph from '@/components/graph/graph'
import { useParams } from 'react-router-dom'
import config from '@/lib/config'

const modes = [
  { value: 'add', label: 'Add' },
  { value: 'start', label: 'Start' },
  { value: 'end', label: 'End' },
]

export default function GraphSearchVisualization() {
  const { algorithm } = useParams<{ algorithm: string; topic: string }>()
  const [totalNodes, setTotalNodes] = useState(10)
  const [result, setResult] = useState<Edge[]>([])
  const [selectedNode, setSelectedNode] = useState<number | null>(null)
  const [startNode, setStartNode] = useState<number | null>(null)
  const [endNode, setEndNode] = useState<number | null>(null)

  const algorithmOption = config
    ?.find((option) => option.value === 'graph-search')
    ?.algorithms.find((option) => option.value === algorithm)

  const {
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
    setAnimationSpeed,
    animationSpeed,
    setSelectionMode,
    selectionMode,
  } = useAlgorithm(totalNodes, result.length)

  useEffect(() => {
    setResult(algorithmOption.method(graph, startNode, endNode))
  }, [graph, startNode, endNode, algorithm])

  return (
    <div className="flex flex-col items-center space-y-4 p-4 dark:bg-black dark:text-white">
      <ControlPanel
        totalNodes={totalNodes}
        animationSpeed={animationSpeed}
        setTotalNodes={setTotalNodes}
        isAnimating={isAnimating}
        generateRandomTree={generateRandomTree}
        generateRandomGraph={generateRandomGraph}
        toggleAnimation={toggleAnimation}
        stepForward={stepForward}
        stepBackward={stepBackward}
        resetVisualization={resetVisualization}
        setAnimationSpeed={setAnimationSpeed}
        selectionMode={selectionMode}
        setSelectionMode={setSelectionMode}
        modes={modes}
      />
      <Graph
        graph={graph}
        result={result}
        isAllowClick
        currentStep={currentStep}
        selectionMode={selectionMode}
        setSelectedNode={setSelectedNode}
        setSelectionMode={setSelectionMode}
        selectedNode={selectedNode}
        setStartNode={setStartNode}
        setEndNode={setEndNode}
        startNode={startNode}
        endNode={endNode}
        setGraph={setGraph}
        resetVisualization={resetVisualization}
      />
    </div>
  )
}
