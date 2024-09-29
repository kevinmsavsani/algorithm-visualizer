const bubbleSort = (arr) => {
  let steps = [];
  let sortedArr = [...arr];
  for (let i = 0; i < sortedArr.length; i++) {
    for (let j = 0; j < sortedArr.length - i - 1; j++) {
      if (sortedArr[j].value > sortedArr[j + 1].value) {
        [sortedArr[j], sortedArr[j + 1]] = [sortedArr[j + 1], sortedArr[j]];
        steps.push([...sortedArr]);
      }
    }
  }
  return steps;
};

export default bubbleSort;