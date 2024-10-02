import { graphSearchaStar, graphSearchBellmanFord, graphSearchBfs, graphSearchDfs, graphSearchDijkstra, graphSearchFloydWarshall } from './graph-search'
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
    name: 'Graph',
    path: '/graph',
    value: 'graph',
    algorithms: [
      { name: 'Adjacency List', path: '/graph/adjacency-list' },
      { name: 'Adjacency Matrix', path: '/graph/adjacency-matrix' },
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
      },
      {
        name: 'Depth-First Search (DFS)',
        path: '/graph-search/dfs',
        value: 'dfs',
        label: 'DFS',
        method: graphSearchDfs,
      },
      {
        name: "Dijkstra's Algorithm",
        path: '/graph-search/dijkstra',
        value: 'dijkstra',
        label: 'Dijkstra',
        method: graphSearchDijkstra,
      },
      {
        name: 'Floyd-Warshall Algorithm',
        path: '/graph-search/floyd-warshall',
        value: 'floydWarshall',
        label: 'Floyd-Warshall',
        method: graphSearchFloydWarshall,
      },
      {
        name: 'Bellman-Ford Algorithm',
        path: '/graph-search/bellman-ford',
        value: 'bellmanFord',
        label: 'Bellman-Ford',
        method: graphSearchBellmanFord,
      },
      {
        name: 'A* Search Algorithm',
        path: '/graph-search/a-star',
        value: 'aStar',
        label: 'A*',
        method: graphSearchaStar,
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
      },
      {
        name: "Prim's Algorithm",
        path: '/minimum-spanning-tree/prim',
        value: 'prim',
        label: 'Prim',
        method: minimumSpaningTreePrim,
      },
      {
        name: "Boruvka's Algorithm",
        path: '/minimum-spanning-tree/boruvka',
        value: 'boruvka',
        label: 'Boruvka',
        method: minimumSpaningTreeBoruvka,
      },
      {
        name: 'Reverse Delete Algorithm',
        path: '/minimum-spanning-tree/reverse-delete',
        value: 'reverse-delete',
        label: 'Reverse Delete',
        method: minimumSpaningTreeReverseDelete,
      },
    ],
  },
]

export default config
