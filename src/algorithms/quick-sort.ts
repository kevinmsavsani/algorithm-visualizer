const quickSort = (arr) => {
  let steps = []
  const quickSortRecursive = (array) => {
    if (array.length <= 1) return array
    const pivot = array[array.length - 1]
    const left = []
    const right = []
    for (let i = 0; i < array.length - 1; i++) {
      if (array[i].value < pivot.value) {
        left.push(array[i])
      } else {
        right.push(array[i])
      }
    }
    const sortedLeft = quickSortRecursive(left)
    const sortedRight = quickSortRecursive(right)
    const sortedArray = [...sortedLeft, pivot, ...sortedRight]
    steps.push([...sortedArray])
    return sortedArray
  }

  quickSortRecursive(arr)
  return steps
}

export default quickSort
