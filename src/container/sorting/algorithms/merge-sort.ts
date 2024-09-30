const mergeSort = (arr) => {
  let steps = [];
  let originalArray = [...arr];

  const merge = (left, right) => {
    let result = [];
    while (left.length && right.length) {
      if (left[0].value < right[0].value) {
        result.push(left.shift());
      } else {
        result.push(right.shift());
      }
    }
    return result.concat(left, right);
  };

  const mergeSortRecursive = (array, startIndex) => {
    if (array.length <= 1) return array;
    const mid = Math.floor(array.length / 2);
    const left = mergeSortRecursive(array.slice(0, mid), startIndex);
    const right = mergeSortRecursive(array.slice(mid), startIndex + mid);
    const merged = merge(left, right);

    // Update the original array with the merged result
    for (let i = 0; i < merged.length; i++) {
      originalArray[startIndex + i] = merged[i];
    }

    // Push a copy of the updated original array to steps
    steps.push([...originalArray]);
    return merged;
  };

  mergeSortRecursive(arr, 0);
  return steps;
};

export default mergeSort;