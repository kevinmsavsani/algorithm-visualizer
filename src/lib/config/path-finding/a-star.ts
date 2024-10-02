type Node = {
  row: number;
  col: number;
  isStart: boolean;
  isEnd: boolean;
  isWall: boolean;
  distance: number;
  heuristic: number;
  isVisited: boolean;
  previousNode: Node | null;
};

const initializeStartNode = (grid: Node[][]): Node => {
  for (const row of grid) {
    for (const node of row) {
      if (node.isStart) {
        node.distance = 0;
        node.heuristic = calculateHeuristic(node, getEndNode(grid));
        return node;
      }
    }
  }
  throw new Error('Start node not found');
};

const pathFindingaStar = (grid: Node[][]): Node[] => {
  const visitedNodesInOrder: Node[] = [];
  const startNode = initializeStartNode(grid);
  const endNode = getEndNode(grid);
  const openSet: Node[] = [startNode];

  while (openSet.length) {
    sortNodesByCost(openSet);
    const currentNode = openSet.shift()!;
    
    if (currentNode.isWall) continue;
    
    currentNode.isVisited = true;
    visitedNodesInOrder.push(currentNode);

    if (currentNode === endNode) break;

    const unvisitedNeighbors = getUnvisitedNeighbors(currentNode, grid);
    for (const neighbor of unvisitedNeighbors) {
      const tentativeDistance = currentNode.distance + 1;
      if (tentativeDistance < neighbor.distance) {
        neighbor.distance = tentativeDistance;
        neighbor.heuristic = calculateHeuristic(neighbor, endNode);
        neighbor.previousNode = currentNode;
        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        }
      }
    }
  }

  return visitedNodesInOrder;
};

const sortNodesByCost = (nodes: Node[]) => {
  nodes.sort((nodeA, nodeB) => (nodeA.distance + nodeA.heuristic) - (nodeB.distance + nodeB.heuristic));
};

const calculateHeuristic = (node: Node, endNode: Node): number => {
  return Math.abs(node.row - endNode.row) + Math.abs(node.col - endNode.col);
};

const getUnvisitedNeighbors = (node: Node, grid: Node[][]): Node[] => {
  const neighbors: Node[] = [];
  const { row, col } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter(neighbor => !neighbor.isVisited);
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

export default pathFindingaStar;