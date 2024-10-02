import {
  graphSearchaStar,
  graphSearchBellmanFord,
  graphSearchBfs,
  graphSearchDfs,
  graphSearchDijkstra,
  graphSearchFloydWarshall,
} from './graph-search'
import {
  minimumSpaningTreeBoruvka,
  minimumSpaningTreeKruskal,
  minimumSpaningTreePrim,
  minimumSpaningTreeReverseDelete,
} from './minimum-spanning-tree'

interface AlgorithmConfig {
  name: string
  path: string
  value: string
  algorithms: Array<{
    name: string
    path: string
    value?: string
    label?: string
    method?: Function
    description?: string
    complexity?: string
  }>
}

const config: AlgorithmConfig[] = [
  {
    name: 'Sorting',
    path: '/sorting',
    value: 'sorting',
    algorithms: [
      { name: 'Bubble Sort', path: '/sorting/bubble-sort' },
      { name: 'Merge Sort', path: '/sorting/merge-sort' },
      { name: 'Quick Sort', path: '/sorting/quick-sort' },
      { name: 'Heap Sort', path: '/sorting/heap-sort' },
    ],
  },
  {
    name: 'Path Finding',
    path: '/path-finding',
    value: 'path-finding',
    algorithms: [
      { name: "Dijkstra's Algorithm", path: '/path-finding/dijkstra' },
      { name: 'A* Search Algorithm', path: '/path-finding/astar' },
      { name: 'Breadth-First Search', path: '/path-finding/bfs' },
      { name: 'Depth-First Search', path: '/path-finding/dfs' },
    ],
  },
  {
    name: 'Convex Hull',
    path: '/convex-hull',
    value: 'convex-hull',
    algorithms: [
      { name: 'Graham Scan', path: '/convex-hull/graham-scan' },
      { name: 'Jarvis March', path: '/convex-hull/jarvis-march' },
    ],
  },
  {
    name: 'Graph Search',
    path: '/graph-search',
    value: 'graph-search',
    algorithms: [
      {
        name: 'Breadth-First Search (BFS)',
        path: '/graph-search/bfs',
        value: 'bfs',
        label: 'BFS',
        method: graphSearchBfs,
        description:
          'An algorithm for traversing or searching tree or graph data structures.',
        complexity: 'O(V + E)',
      },
      {
        name: 'Depth-First Search (DFS)',
        path: '/graph-search/dfs',
        value: 'dfs',
        label: 'DFS',
        method: graphSearchDfs,
        description:
          'An algorithm for traversing or searching tree or graph data structures.',
        complexity: 'O(V + E)',
      },
      {
        name: "Dijkstra's Algorithm",
        path: '/graph-search/dijkstra',
        value: 'dijkstra',
        label: 'Dijkstra',
        method: graphSearchDijkstra,
        description:
          'An algorithm for finding the shortest paths between nodes in a graph.',
        complexity: 'O(V^2) or O(E + V log V) with a priority queue',
      },
      {
        name: 'Floyd-Warshall Algorithm',
        path: '/graph-search/floyd-warshall',
        value: 'floydWarshall',
        label: 'Floyd-Warshall',
        method: graphSearchFloydWarshall,
        description:
          'An algorithm for finding shortest paths in a weighted graph with positive or negative edge weights.',
        complexity: 'O(V^3)',
      },
      {
        name: 'Bellman-Ford Algorithm',
        path: '/graph-search/bellman-ford',
        value: 'bellmanFord',
        label: 'Bellman-Ford',
        method: graphSearchBellmanFord,
        description:
          'An algorithm for finding shortest paths in a graph with negative weights.',
        complexity: 'O(VE)',
      },
      {
        name: 'A* Search Algorithm',
        path: '/graph-search/a-star',
        value: 'aStar',
        label: 'A*',
        method: graphSearchaStar,
        description:
          'An algorithm for finding the shortest path between nodes in a graph, using heuristics to improve performance.',
        complexity: 'O(E)',
      },
    ],
  },
  {
    name: 'Minimum Spanning Tree',
    path: '/minimum-spanning-tree',
    value: 'minimum-spanning-tree',
    algorithms: [
      {
        name: "Kruskal's Algorithm",
        path: '/minimum-spanning-tree/kruskal',
        value: 'kruskal',
        label: 'Kruskal',
        method: minimumSpaningTreeKruskal,
        description:
          'An algorithm for finding the minimum spanning tree of a graph.',
        complexity: 'O(E log E)',
      },
      {
        name: "Prim's Algorithm",
        path: '/minimum-spanning-tree/prim',
        value: 'prim',
        label: 'Prim',
        method: minimumSpaningTreePrim,
        description:
          'An algorithm for finding the minimum spanning tree of a graph.',
        complexity: 'O(V^2) or O(E + V log V) with a priority queue',
      },
      {
        name: "Boruvka's Algorithm",
        path: '/minimum-spanning-tree/boruvka',
        value: 'boruvka',
        label: 'Boruvka',
        method: minimumSpaningTreeBoruvka,
        description:
          'An algorithm for finding the minimum spanning tree of a graph.',
        complexity: 'O(E log V)',
      },
      {
        name: 'Reverse Delete Algorithm',
        path: '/minimum-spanning-tree/reverse-delete',
        value: 'reverse-delete',
        label: 'Reverse Delete',
        method: minimumSpaningTreeReverseDelete,
        description:
          'An algorithm for finding the minimum spanning tree of a graph by deleting edges.',
        complexity: 'O(E log V)',
      },
    ],
  },
]

export default config
