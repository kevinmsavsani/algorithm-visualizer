interface Node {
  id: number
  x: number
  y: number
}

interface Edge {
  source: number
  target: number
  weight: number
}

interface Graph {
  nodes: Node[]
  edges: Edge[]
}

interface GraphProps {
  graph: Graph
  result: Edge[]
  currentStep: number
}

export type {
  Node,
  Edge,
  Graph,
  GraphProps
}