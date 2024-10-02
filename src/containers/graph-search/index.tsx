'use client'

import { useEffect, useState } from 'react'
import { ControlPanel } from '../../components/graph/control-panel'
import { useAlgorithm } from '../../components/graph/useAlgorithm'
import AlgorithmSelect, { Option } from '../../components/algorithm-select'
import {
  aStar,
  bellmanFord,
  bfs,
  dfs,
  dijkstra,
  floydWarshall,
} from './algorithm'
import { Edge } from '@/types'
import Graph from '@/components/graph/graph'

export default function GraphSearchVisualization() {
  const [totalNodes, setTotalNodes] = useState(10)
  const [result, setResult] = useState<Edge[]>([])
  const [selectedNode, setSelectedNode] = useState<number | null>(null)
  const [startNode, setStartNode] = useState<number | null>(null)
  const [endNode, setEndNode] = useState<number | null>(null)

  const options = [
    { value: 'bfs', label: 'BFS', method: bfs },
    { value: 'dfs', label: 'DFS', method: dfs },
    { value: 'dijkstra', label: 'Dijkstra', method: dijkstra },
    { value: 'astar', label: 'A*', method: aStar },
    { value: 'bellman-ford', label: 'Bellman-Ford', method: bellmanFord },
    { value: 'floyd-warshall', label: 'Floyd-Warshall', method: floydWarshall },
  ]
  const [algorithm, setAlgorithm] = useState<Option>(options[0])
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
    setResult(algorithm.method(graph, startNode, endNode))
  }, [graph, startNode, endNode, algorithm])

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
