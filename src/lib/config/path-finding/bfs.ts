type Node = {
  row: number;
  col: number;
  isStart: boolean;
  isEnd: boolean;
  isWall: boolean;
  isVisited: boolean;
  previousNode: Node | null;
};

/** 
This implementation of the Breadth-First Search (BFS) algorithm is structured similarly to the A* implementation we discussed earlier. Here's an explanation of the key components:

1. `Node` type: Similar to A*, but without distance and heuristic properties, as BFS doesn't use these concepts.

2. `bfs` function: The main function that performs the BFS algorithm.
   - It uses a queue to keep track of nodes to visit.
   - It explores nodes level by level, ensuring the shortest path in unweighted graphs.

3. `getStartNode` and `getEndNode`: Helper functions to find the start and end nodes in the grid.

4. `getUnvisitedNeighbors`: Returns unvisited and non-wall neighboring nodes.

5. `getShortestPath`: Reconstructs the shortest path from the end node to the start node.

Key differences from A*:

1. No need for `distance` or `heuristic` properties in the `Node` type.
2. Uses a simple queue instead of a priority queue (no need to sort nodes).
3. No need for a separate `initializeStartNode` function, as BFS doesn't require special initialization.
4. Simpler logic in the main loop, as BFS doesn't need to recalculate distances or update existing nodes in the queue.

To use this BFS implementation:

1. Call `bfs(grid)` to get all visited nodes in order.
2. If you need the shortest path, call `getShortestPath(endNode)` where `endNode` is the last node in the `visitedNodesInOrder` array returned by `bfs`.

This BFS implementation will find the shortest path in unweighted graphs and is generally simpler than A*, but it might explore more nodes unnecessarily in larger or weighted graphs compared to A*.
*/
const pathFindingBfs = (grid: Node[][]): Node[] => {
  const visitedNodesInOrder: Node[] = [];
  const queue: Node[] = [];
  const startNode = getStartNode(grid);
  const endNode = getEndNode(grid);

  startNode.isVisited = true;
  queue.push(startNode);

  while (queue.length > 0) {
    const currentNode = queue.shift()!;
    visitedNodesInOrder.push(currentNode);

    if (currentNode === endNode) {
      break;
    }

    const unvisitedNeighbors = getUnvisitedNeighbors(currentNode, grid);
    for (const neighbor of unvisitedNeighbors) {
      neighbor.isVisited = true;
      neighbor.previousNode = currentNode;
      queue.push(neighbor);
    }
  }

  return visitedNodesInOrder;
};

const getStartNode = (grid: Node[][]): Node => {
  for (const row of grid) {
    for (const node of row) {
      if (node.isStart) {
        return node;
      }
    }
  }
  throw new Error('Start node not found');
};

const getEndNode = (grid: Node[][]): Node => {
  for (const row of grid) {
    for (const node of row) {
      if (node.isEnd) {
        return node;
      }
    }
  }
  throw new Error('End node not found');
};

const getUnvisitedNeighbors = (node: Node, grid: Node[][]): Node[] => {
  const neighbors: Node[] = [];
  const { row, col } = node;

  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

  return neighbors.filter(neighbor => !neighbor.isVisited && !neighbor.isWall);
};

export default pathFindingBfs;