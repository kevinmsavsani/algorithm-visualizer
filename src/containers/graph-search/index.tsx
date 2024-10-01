'use client'

import { useEffect, useState } from 'react'
import { ControlPanel } from '../../components/graph/control-panel'
import { useAlgorithm } from '../../components/graph/useAlgorithm'
import AlgorithmSelect from '../../components/algorithm-select'
import {
  aStar,
  bellmanFord,
  bfs,
  dfs,
  dijkstra,
  floydWarshall,
} from './algorithm'
import NewGraph from './new-graph'

export default function GraphSearchVisualization() {
  const [totalNodes, setTotalNodes] = useState(10)
  const [result, setResult] = useState<number[]>([])
  const [selectedNode, setSelectedNode] = useState<number | null>(null)
  const [startNode, setStartNode] = useState<number | null>(null)
  const [endNode, setEndNode] = useState<number | null>(null)

  const options = [
    { value: 'bfs', label: 'BFS' },
    { value: 'dfs', label: 'DFS' },
    { value: 'dijkstra', label: 'Dijkstra' },
    { value: 'astar', label: 'A*' },
    { value: 'bellman-ford', label: 'Bellman-Ford' },
    { value: 'floyd-warshall', label: 'Floyd-Warshall' },
  ]
  const [algorithm, setAlgorithm] = useState<string>('bfs')
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
    const setNewResults = () => {
      switch (algorithm) {
        case 'bfs':
          return bfs(graph, startNode, endNode)
        case 'dfs':
          return dfs(graph, startNode, endNode)
        case 'dijkstra':
          return dijkstra(graph, startNode, endNode)
        case 'astar':
          return aStar(graph, startNode, endNode)
        case 'bellman-ford':
          return bellmanFord(graph, startNode, endNode)
        case 'floyd-warshall':
          return floydWarshall(graph, startNode, endNode)
        default:
          throw new Error(`Unknown algorithm: ${algorithm}`)
      }
    }
    setResult(setNewResults())
  }, [graph,startNode, endNode, algorithm])

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
      <NewGraph
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