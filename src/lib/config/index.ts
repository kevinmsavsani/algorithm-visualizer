import { grahamScan, jarvisMarch, monotoneChain } from './convex-hull'
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
import pathFindingaStar from './path-finding/a-star'
import pathFindingBfs from './path-finding/bfs'
import pathFindingDijkstra from './path-finding/dijkstra'

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
    name: 'Maze Path',
    path: '/path-finding',
    value: 'path-finding',
    algorithms: [
      {
        value: 'dijkstra',
        path: '/path-finding/dijkstra',
        name: "Dijkstra's Algorithm",
        label: "Dijkstra's Algorithm",
        method: pathFindingDijkstra,
        description: 'An algorithm for finding the shortest paths between nodes in a graph.',
        complexity: 'O(V^2) or O(E + V log V) with a priority queue',
      },
      {
        value: 'astar',
        path: '/path-finding/astar',
        name: 'A* Search Algorithm',
        label: 'A* Search Algorithm',
        method: pathFindingaStar,
        description: 'An algorithm for finding the shortest path between nodes in a graph, using heuristics to improve performance.',
        complexity: 'O(E)',
      },
      {
        value: 'bfs',
        path: '/path-finding/bfs',
        name: 'Breadth-First Search',
        label: 'Breadth-First Search',
        method: pathFindingBfs,
        description: 'An algorithm for traversing or searching tree or graph data structures.',
        complexity: 'O(V + E)',
      }
    ],
  },
  {
    name: 'Convex Hull',
    path: '/convex-hull',
    value: 'convex-hull',
    algorithms: [
      {
        value: 'graham-scan',
        path: '/convex-hull/graham-scan',
        name: 'Graham Scan',
        label: 'Graham Scan',
        method: grahamScan,
        description:
          'An algorithm to compute the convex hull of a set of points in the plane.',
        complexity: 'O(n log n)',
      },
      {
        value: 'jarvis-march',
        path: '/convex-hull/jarvis-march',
        name: 'Jarvis March',
        label: 'Jarvis March',
        method: jarvisMarch,
        description:
          'An algorithm to compute the convex hull of a set of points in the plane, also known as the gift wrapping algorithm.',
        complexity: 'O(nh)',
      },
      {
        value: 'monotone-chain',
        path: '/convex-hull/monotone-chain',
        name: 'Monotone Chain',
        label: 'Monotone Chain',
        method: monotoneChain,
        description:
          "An algorithm to compute the convex hull of a set of points in the plane, also known as Andrew's algorithm.",
        complexity: 'O(n log n)',
      },
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
