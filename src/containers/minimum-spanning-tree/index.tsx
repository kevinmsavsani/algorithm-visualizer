'use client'

import { useEffect, useState } from 'react'
import { ControlPanel } from './control-panel'
import { Graph } from './graph'
import { useAlgorithm } from './useAlgorithm'
import { boruvka, kruskal, prim, reverseDelete } from './algorithm'
import { Edge } from '@/types'
import AlgorithmSelect from './algorithm-select'

export default function MinimumSpaningTreeVisualization() {
  const [totalNodes, setTotalNodes] = useState(10)
  const [result, setResult] = useState<Edge[]>([])
  const options = [
    { value: 'kruskal', label: 'Kruskal' },
    { value: 'prim', label: 'Prim' },
    { value: 'boruvka', label: 'Boruvka' },
    { value: 'reverse-delete', label: 'Reverse Delete' },
  ]
  const [algorithm, setAlgorithm] = useState<string>('kruskal')
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
    switch (algorithm) {  
      case 'kruskal':
        setResult(kruskal(graph))
        break
      case 'prim':  
        setResult(prim(graph))
        break 
      case 'boruvka':
        setResult(boruvka(graph))
        break
      case 'reverse-delete':  
        setResult(reverseDelete(graph))
        break
      default:
        break
    }
  }, [graph])

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
      />
      <Graph graph={graph} result={result} currentStep={currentStep} />
    </div>
  )
}
