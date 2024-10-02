import { BinaryHeap } from '@/lib/binaryHeap'
import { Edge, Graph } from '@/types'

export const minimumSpaningTreeKruskal = (graph: Graph) => {
  const sortedEdges = [...graph.edges].sort((a, b) => a.weight - b.weight)
  const parent = new Array(graph.nodes.length).fill(null).map((_, i) => i)
  const rank = new Array(graph.nodes.length).fill(0)

  function find(i: number): number {
    if (parent[i] !== i) {
      parent[i] = find(parent[i])
    }
    return parent[i]
  }

  function union(x: number, y: number) {
    const rootX = find(x)
    const rootY = find(y)

    if (rank[rootX] < rank[rootY]) {
      parent[rootX] = rootY
    } else if (rank[rootX] > rank[rootY]) {
      parent[rootY] = rootX
    } else {
      parent[rootY] = rootX
      rank[rootX]++
    }
  }

  const result: Edge[] = []
  for (const edge of sortedEdges) {
    const sourceRoot = find(edge.source)
    const targetRoot = find(edge.target)

    if (sourceRoot !== targetRoot) {
      result.push(edge)
      union(sourceRoot, targetRoot)
    }

    if (result.length === graph.nodes.length - 1) break
  }

  return result
}

export const minimumSpaningTreePrim = (graph: Graph) => {
  const result: Edge[] = []
  const visited = new Array(graph.nodes.length).fill(false)
  const minHeap = new BinaryHeap<Edge>((a, b) => a.weight - b.weight)

  visited[0] = true
  for (const edge of graph.edges) {
    if (edge.source === 0) {
      minHeap.insert(edge)
    }
  }

  while (!minHeap.isEmpty()) {
    const edge = minHeap.extract()
    if (visited[edge.target]) continue

    visited[edge.target] = true
    result.push(edge)

    for (const nextEdge of graph.edges) {
      if (nextEdge.source === edge.target && !visited[nextEdge.target]) {
        minHeap.insert(nextEdge)
      }
    }
  }

  return result
}

export const minimumSpaningTreeBoruvka = (graph: Graph) => {
  const components = new Array(graph.nodes.length).fill(null).map((_, i) => i)
  const result: Edge[] = []
  let numComponents = graph.nodes.length

  while (numComponents > 1) {
    const cheapestEdge = new Array(graph.nodes.length).fill(null)
    for (const edge of graph.edges) {
      const component1 = components[edge.source]
      const component2 = components[edge.target]

      if (component1 === component2) continue

      if (
        cheapestEdge[component1] === null ||
        edge.weight < cheapestEdge[component1].weight
      ) {
        cheapestEdge[component1] = edge
      }

      if (
        cheapestEdge[component2] === null ||
        edge.weight < cheapestEdge[component2].weight
      ) {
        cheapestEdge[component2] = edge
      }
    }

    for (let i = 0; i < graph.nodes.length; i++) {
      if (cheapestEdge[i] !== null) {
        const component1 = components[cheapestEdge[i].source]
        const component2 = components[cheapestEdge[i].target]

        if (component1 !== component2) {
          result.push(cheapestEdge[i])
          numComponents--
          for (let j = 0; j < graph.nodes.length; j++) {
            if (components[j] === component2) {
              components[j] = component1
            }
          }
        }
      }
    }
  }

  return result
}

export const minimumSpaningTreeReverseDelete = (graph: Graph) => {
  const sortedEdges = [...graph.edges].sort((a, b) => b.weight - a.weight)
  const parent = new Array(graph.nodes.length).fill(null).map((_, i) => i)
  const rank = new Array(graph.nodes.length).fill(0)

  function find(i: number): number {
    if (parent[i] !== i) {
      parent[i] = find(parent[i])
    }
    return parent[i]
  }

  function union(x: number, y: number) {
    const rootX = find(x)
    const rootY = find(y)

    if (rank[rootX] < rank[rootY]) {
      parent[rootX] = rootY
    } else if (rank[rootX] > rank[rootY]) {
      parent[rootY] = rootX
    } else {
      parent[rootY] = rootX
      rank[rootX]++
    }
  }

  const result: Edge[] = []
  for (const edge of sortedEdges) {
    const sourceRoot = find(edge.source)
    const targetRoot = find(edge.target)

    if (sourceRoot !== targetRoot) {
      result.push(edge)
      union(sourceRoot, targetRoot)
    }
  }

  return result
}
