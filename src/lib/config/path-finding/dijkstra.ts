const initializeStartNode = (grid: Node[][]) => {
  for (const row of grid) {
    for (const node of row) {
      if (node.isStart) {
        node.distance = 0
        return node
      }
    }
  }
  throw new Error('Start node not found')
}

const pathFindingDijkstra = (grid: Node[][]) => {
  const visitedNodesInOrder = []
  const unvisitedNodes = getAllNodes(grid)
  initializeStartNode(grid)
  while (unvisitedNodes.length) {
    sortNodesByDistance(unvisitedNodes)
    const closestNode = unvisitedNodes.shift()!
    if (closestNode.isWall) continue
    if (closestNode.distance === Infinity) return visitedNodesInOrder
    closestNode.isVisited = true
    visitedNodesInOrder.push(closestNode)
    if (closestNode.isEnd) return visitedNodesInOrder
    updateUnvisitedNeighbors(closestNode, grid)
  }
  return visitedNodesInOrder
}

const sortNodesByDistance = (unvisitedNodes: Node[]) => {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance)
}

const updateUnvisitedNeighbors = (node: Node, grid: Node[][]) => {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid)
  for (const neighbor of unvisitedNeighbors) {
    neighbor.distance = node.distance + 1
    neighbor.previousNode = node
  }
}

const getUnvisitedNeighbors = (node: Node, grid: Node[][]) => {
  const neighbors = []
  const { row, col } = node
  if (row > 0) neighbors.push(grid[row - 1][col])
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col])
  if (col > 0) neighbors.push(grid[row][col - 1])
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1])
  return neighbors.filter((neighbor) => !neighbor.isVisited)
}

const getAllNodes = (grid: Node[][]) => {
  const nodes = []
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node)
    }
  }
  return nodes
}  

export default pathFindingDijkstra