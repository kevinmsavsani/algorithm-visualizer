'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ControlPanel } from '../../components/graph/control-panel'
import Graph from '../../components/graph/graph'
import { useAlgorithm } from '../../components/graph/useAlgorithm'
import { Edge } from '@/types'
import config from '@/lib/config'

export default function MinimumSpaningTreeVisualization() {
  const { algorithm } = useParams<{ algorithm: string; topic: string }>()
  const [totalNodes, setTotalNodes] = useState(10)
  const [result, setResult] = useState<Edge[]>([])

  const algorithmOption = config
    ?.find((option) => option.value === 'minimum-spanning-tree')
    ?.algorithms.find((option) => option.value === algorithm)

  const {
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
    setResult(algorithmOption.method(graph))
  }, [graph, algorithm])

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
        nodeSelectShow={false}
      />
      <Graph
        graph={graph}
        result={result}
        currentStep={currentStep}
        isAllowClick={false}
      />
    </div>
  )
}
