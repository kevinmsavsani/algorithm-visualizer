const dijkstra = (grid: Node[][], startNode: Node, endNode: Node) => {
  const visitedNodesInOrder = []
  startNode.distance = 0
  const unvisitedNodes = getAllNodes(grid)
  while (unvisitedNodes.length) {
    sortNodesByDistance(unvisitedNodes)
    const closestNode = unvisitedNodes.shift()!
    if (closestNode.isWall) continue
    if (closestNode.distance === Infinity) return visitedNodesInOrder
    closestNode.isVisited = true
    visitedNodesInOrder.push(closestNode)
    if (closestNode === endNode) return visitedNodesInOrder
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

const getNodesInShortestPathOrder = (finishNode: Node) => {
  const nodesInShortestPathOrder = []
  let currentNode: Node | null = finishNode
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode)
    currentNode = currentNode.previousNode
  }
  return nodesInShortestPathOrder
}

const getNodeClassName = (node: Node): string => {
  if (node.isStart) return 'bg-green-500'
  if (node.isEnd) return 'bg-red-500'
  if (node.isPath) return 'bg-yellow-300'
  if (node.isVisited) return 'bg-blue-300'
  if (node.isWall) return 'bg-gray-800'
  return 'bg-white'
}

const toggleWall = (grid: Node[][], row: number, col: number) => {
  const newGrid = grid.slice()
  const node = newGrid[row][col]
  if (!node.isStart && !node.isEnd) {
    const newNode = {
      ...node,
      isWall: !node.isWall,
    }
    newGrid[row][col] = newNode
  }
  return newGrid
}
export {
  dijkstra,
  sortNodesByDistance,
  updateUnvisitedNeighbors,
  getNodeClassName,
  getNodesInShortestPathOrder,
  toggleWall
}
