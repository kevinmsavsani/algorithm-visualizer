
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

export const bfs = (graph: Graph, startNode: number, endNode: number): number[] => {
  const visited = new Set<number>()
  const queue: number[][] = [[startNode]]
  const path: number[] = []

  while (queue.length > 0) {
    const currentPath = queue.shift()!
    const node = currentPath[currentPath.length - 1]

    if (node === endNode) {
      return currentPath
    }

    if (!visited.has(node)) {
      visited.add(node)
      graph.edges
        .filter((e: Edge) => e.source === node || e.target === node)
        .forEach((e: Edge) => {
          const neighbor = e.source === node ? e.target : e.source
          if (!visited.has(neighbor)) {
            queue.push([...currentPath, neighbor])
          }
        })
    }
  }

  return path
}

export const dfs = (graph: Graph, startNode: number, endNode: number): number[] => {  
  const visited = new Set<number>()
  const stack: number[][] = [[startNode]]
  const path: number[] = []

  while (stack.length > 0) {
    const currentPath = stack.pop()!
    const node = currentPath[currentPath.length - 1]

    if (node === endNode) {
      return currentPath
    }

    if (!visited.has(node)) {
      visited.add(node)
      graph.edges
        .filter((e: Edge) => e.source === node || e.target === node)
        .forEach((e: Edge) => {
          const neighbor = e.source === node ? e.target : e.source
          if (!visited.has(neighbor)) {
            stack.push([...currentPath, neighbor])
          }
        })
    }
  }

  return path
}

export const dijkstra = (graph: Graph, startNode: number, endNode: number): number[] => {
  const distances: { [key: number]: number } = {};
  const previous: { [key: number]: number | null } = {};
  const pq = new PriorityQueue<{ node: number; distance: number }>((a, b) => a.distance < b.distance);

  graph.nodes.forEach(node => {
    distances[node.id] = Infinity;
    previous[node.id] = null;
  });
  distances[startNode] = 0;
  pq.queue({ node: startNode, distance: 0 });

  while (pq.length > 0) {
    const { node: currentNode } = pq.dequeue()!;

    if (currentNode === endNode) {
      break;
    }

    graph.edges
      .filter(edge => edge.source === currentNode || edge.target === currentNode)
      .forEach(edge => {
        const neighbor = edge.source === currentNode ? edge.target : edge.source;
        const newDistance = distances[currentNode] + edge.weight;
        if (newDistance < distances[neighbor]) {
          distances[neighbor] = newDistance;
          previous[neighbor] = currentNode;
          pq.queue({ node: neighbor, distance: newDistance });
        }
      });
  }

  const path: number[] = [];
  let currentNode = endNode;
  while (currentNode !== null) {
    path.unshift(currentNode);
    currentNode = previous[currentNode];
  }

  return path[0] === startNode ? path : [];
}

export const floydWarshall = (graph: Graph, startNode: number, endNode: number): number[] => {
  const numNodes = graph.nodes.length;
  const dist: number[][] = Array.from({ length: numNodes }, () => Array(numNodes).fill(Infinity));
  const next: (number | null)[][] = Array.from({ length: numNodes }, () => Array(numNodes).fill(null));

  graph.nodes.forEach(node => {
    dist[node.id][node.id] = 0;
  });

  graph.edges.forEach(edge => {
    dist[edge.source][edge.target] = edge.weight;
    dist[edge.target][edge.source] = edge.weight;
    next[edge.source][edge.target] = edge.target;
    next[edge.target][edge.source] = edge.source;
  });

  for (let k = 0; k < numNodes; k++) {
    for (let i = 0; i < numNodes; i++) {
      for (let j = 0; j < numNodes; j++) {
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
          next[i][j] = next[i][k];
        }
      }
    }
  }

  const path: number[] = [];
  if (next[startNode][endNode] === null) {
    return path;
  }

  let currentNode = startNode;
  while (currentNode !== endNode) {
    path.push(currentNode);
    currentNode = next[currentNode][endNode]!;
  }
  path.push(endNode);

  return path;
}

export const bellmanFord = (graph: Graph, startNode: number, endNode: number): number[] => {
  const distances: { [key: number]: number } = {};
  const previous: { [key: number]: number | null } = {};

  graph.nodes.forEach(node => {
    distances[node.id] = Infinity;
    previous[node.id] = null;
  });
  distances[startNode] = 0;

  for (let i = 0; i < graph.nodes.length - 1; i++) {
    for (const edge of graph.edges) {
      const { source, target, weight } = edge;
      if (distances[source] !== Infinity && distances[source] + weight < distances[target]) {
        distances[target] = distances[source] + weight;
        previous[target] = source;
      }
    }
  }

  // Check for negative weight cycles
  for (const edge of graph.edges) {
    const { source, target, weight } = edge;
    if (distances[source] !== Infinity && distances[source] + weight < distances[target]) {
      throw new Error('Graph contains a negative weight cycle');
    }
  }

  const path: number[] = [];
  let currentNode = endNode;
  while (currentNode !== null) {
    path.unshift(currentNode);
    currentNode = previous[currentNode];
  }

  return path[0] === startNode ? path : [];
}

const heuristic = (graph: Graph, nodeA: number, nodeB: number): number => {
  const a = graph.nodes.find(n => n.id === nodeA)!;
  const b = graph.nodes.find(n => n.id === nodeB)!;
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

export const aStar = (graph: Graph, startNode: number, endNode: number): number[] => {
  const openSet = new PriorityQueue<{ node: number; fScore: number }>((a, b) => a.fScore < b.fScore);
  const cameFrom: { [key: number]: number | null } = {};
  const gScore: { [key: number]: number } = {};
  const fScore: { [key: number]: number } = {};

  graph.nodes.forEach(node => {
    gScore[node.id] = Infinity;
    fScore[node.id] = Infinity;
    cameFrom[node.id] = null;
  });
  gScore[startNode] = 0;
  fScore[startNode] = heuristic(graph, startNode, endNode);
  openSet.queue({ node: startNode, fScore: fScore[startNode] });

  while (openSet.length > 0) {
    const current = openSet.dequeue()!.node;

    if (current === endNode) {
      const path: number[] = [];
      let step: number | null = endNode;
      while (step !== null) {
        path.unshift(step);
        step = cameFrom[step];
      }
      return path;
    }

    graph.edges
      .filter(edge => edge.source === current || edge.target === current)
      .forEach(edge => {
        const neighbor = edge.source === current ? edge.target : edge.source;
        const tentativeGScore = gScore[current] + edge.weight;

        if (tentativeGScore < gScore[neighbor]) {
          cameFrom[neighbor] = current;
          gScore[neighbor] = tentativeGScore;
          fScore[neighbor] = gScore[neighbor] + heuristic(graph, neighbor, endNode);
          if (!openSet.items.some(item => item.node === neighbor)) {
            openSet.queue({ node: neighbor, fScore: fScore[neighbor] });
          }
        }
      });
  }

  return [];
}

class PriorityQueue<T> {
  items: T[];
  comparator: (a: T, b: T) => boolean;

  constructor(comparator: (a: T, b: T) => boolean) {
    this.items = [];
    this.comparator = comparator;
  }

  queue(item: T) {
    let added = false;
    for (let i = 0; i < this.items.length; i++) {
      if (this.comparator(item, this.items[i])) {
        this.items.splice(i, 0, item);
        added = true;
        break;
      }
    }
    if (!added) {
      this.items.push(item);
    }
  }

  dequeue(): T | undefined {
    return this.items.shift();
  }

  get length(): number {
    return this.items.length;
  }
}
