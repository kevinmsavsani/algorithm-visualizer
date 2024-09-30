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
  getNodeClassName,
  getNodesInShortestPathOrder,
  toggleWall,
}
