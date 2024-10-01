
export const bfs = (graph: any, startNode: number): number[] => {
  const visited = new Set<number>()
  const order: number[] = []
  const queue: number[] = [startNode]

  while (queue.length > 0) {
    const node = queue.shift()!
    if (!visited.has(node)) {
      visited.add(node)
      order.push(node)
      graph.edges
        .filter((e) => e.source === node || e.target === node)
        .forEach((e) => {
          const neighbor = e.source === node ? e.target : e.source
          if (!visited.has(neighbor)) {
            queue.push(neighbor)
          }
        })
    }
  }

  return order
}

export const dfs = (graph: any, startNode: number): number[] => {
  const visited = new Set<number>()
  const order: number[] = []

  const dfsRecursive = (node: number) => {
    visited.add(node)
    order.push(node)
    graph.edges
      .filter((e) => e.source === node || e.target === node)
      .forEach((e) => {
        const neighbor = e.source === node ? e.target : e.source
        if (!visited.has(neighbor)) {
          dfsRecursive(neighbor)
        }
      })
  }

  dfsRecursive(startNode)
  return order
}

export const dijkstra = (graph: any, startNode: number): number[] => {  
  const visited = new Set<number>()
  const order: number[] = []
  const queue: number[] = [startNode]

  while (queue.length > 0) {
    const node = queue.shift()!
    if (!visited.has(node)) {
      visited.add(node)
      order.push(node)
      graph.edges
        .filter((e) => e.source === node || e.target === node)
        .forEach((e) => {
          const neighbor = e.source === node ? e.target : e.source
          if (!visited.has(neighbor)) {
            queue.push(neighbor)
          }
        })
    }
  }

  return order
}

export const prim = (graph: any, startNode: number): number[] => {
  const visited = new Set<number>()
  const order: number[] = []
  const queue: number[] = [startNode]

  while (queue.length > 0) {
    const node = queue.shift()!
    if (!visited.has(node)) {
      visited.add(node)
      order.push(node)
      graph.edges
        .filter((e) => e.source === node || e.target === node)
        .forEach((e) => {
          const neighbor = e.source === node ? e.target : e.source
          if (!visited.has(neighbor)) {
            queue.push(neighbor)
          }
        })
    }
  }

  return order
}

export const kruskal = (graph: any, startNode: number): number[] => { 
  const visited = new Set<number>()
  const order: number[] = []
  const queue: number[] = [startNode]

  while (queue.length > 0) {
    const node = queue.shift()!
    if (!visited.has(node)) {
      visited.add(node)
      order.push(node)
      graph.edges
        .filter((e) => e.source === node || e.target === node)
        .forEach((e) => {
          const neighbor = e.source === node ? e.target : e.source
          if (!visited.has(neighbor)) {
            queue.push(neighbor)
          }
        })
    }
  }

  return order
}

export const floydWarshall = (graph: any, startNode: number): number[] => {
  const visited = new Set<number>()
  const order: number[] = []
  const queue: number[] = [startNode]

  while (queue.length > 0) {
    const node = queue.shift()!
    if (!visited.has(node)) {
      visited.add(node)
      order.push(node)
      graph.edges
        .filter((e) => e.source === node || e.target === node)
        .forEach((e) => {
          const neighbor = e.source === node ? e.target : e.source
          if (!visited.has(neighbor)) {
            queue.push(neighbor)
          }
        })
    }
  }

  return order
}

export const bellmanFord = (graph: any, startNode: number): number[] => {
  const visited = new Set<number>()
  const order: number[] = []
  const queue: number[] = [startNode]

  while (queue.length > 0) {
    const node = queue.shift()!
    if (!visited.has(node)) {
      visited.add(node)
      order.push(node)
      graph.edges
        .filter((e) => e.source === node || e.target === node)
        .forEach((e) => {
          const neighbor = e.source === node ? e.target : e.source
          if (!visited.has(neighbor)) {
            queue.push(neighbor)
          }
        })
    }
  }

  return order
}

export const aStar = (graph: any, startNode: number): number[] => { 
  const visited = new Set<number>()
  const order: number[] = []
  const queue: number[] = [startNode]

  while (queue.length > 0) {
    const node = queue.shift()!
    if (!visited.has(node)) {
      visited.add(node)
      order.push(node)
      graph.edges
        .filter((e) => e.source === node || e.target === node)
        .forEach((e) => {
          const neighbor = e.source === node ? e.target : e.source
          if (!visited.has(neighbor)) {
            queue.push(neighbor)
          }
        })
    }
  }

  return order
}

export const topologicalSort = (graph: any, startNode: number): number[] => {
  const visited = new Set<number>()
  const order: number[] = []
  const queue: number[] = [startNode]

  while (queue.length > 0) {
    const node = queue.shift()!
    if (!visited.has(node)) {
      visited.add(node)
      order.push(node)
      graph.edges
        .filter((e) => e.source === node || e.target === node)
        .forEach((e) => {
          const neighbor = e.source === node ? e.target : e.source
          if (!visited.has(neighbor)) {
            queue.push(neighbor)
          }
        })
    }
  }

  return order
}