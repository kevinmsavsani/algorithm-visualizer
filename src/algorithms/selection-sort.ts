const selectionSort = (arr) => {
  let steps = [];
  let sortedArr = [...arr];
  for (let i = 0; i < sortedArr.length; i++) {
    let minIdx = i;
    for (let j = i + 1; j < sortedArr.length; j++) {
      if (sortedArr[j].value < sortedArr[minIdx].value) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      [sortedArr[i], sortedArr[minIdx]] = [sortedArr[minIdx], sortedArr[i]];
      steps.push([...sortedArr]);
    }
  }
  return steps;
};

export default selectionSort;