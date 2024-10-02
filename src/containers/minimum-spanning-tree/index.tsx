'use client'

import { useEffect, useState } from 'react'
import { ControlPanel } from '../../components/graph/control-panel'
import Graph from '../../components/graph/graph'
import { useAlgorithm } from '../../components/graph/useAlgorithm'
import { boruvka, kruskal, prim, reverseDelete } from './algorithm'
import { Edge } from '@/types'
import AlgorithmSelect, { Option } from '../../components/algorithm-select'

export default function MinimumSpaningTreeVisualization() {
  const [totalNodes, setTotalNodes] = useState(10)
  const [result, setResult] = useState<Edge[]>([])
  const options = [
    { value: 'kruskal', label: 'Kruskal', method: kruskal },
    { value: 'prim', label: 'Prim', method: prim },
    { value: 'boruvka', label: 'Boruvka', method: boruvka },
    { value: 'reverse-delete', label: 'Reverse Delete', method: reverseDelete },
  ]
  const [algorithm, setAlgorithm] = useState<Option>(options[0])
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
    setResult(algorithm.method(graph))
  }, [graph, algorithm])

  return (
    <div className="flex flex-col items-center space-y-4 p-4 dark:bg-black dark:text-white">
      <AlgorithmSelect
        value={algorithm}
        onValueChange={setAlgorithm}
        options={options}
      />

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
