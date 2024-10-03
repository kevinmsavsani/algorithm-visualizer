export const bubbleSort = (arr) => {
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


export const mergeSort = (arr) => {
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

export const selectionSort = (arr) => {
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

export const insertionSort = (arr) => {
  let steps = [];
  let sortedArr = [...arr];
  for (let i = 1; i < sortedArr.length; i++) {
    let key = sortedArr[i];
    let j = i - 1;
    while (j >= 0 && sortedArr[j].value > key.value) {
      sortedArr[j + 1] = sortedArr[j];
      j--;
    }
    sortedArr[j + 1] = key;
    steps.push([...sortedArr]);
  }
  return steps;
}

export const heapSort = (arr) => {
  let steps = [];
  let sortedArr = [...arr];

  const heapify = (array, n, i) => {
    let largest = i;
    let left = 2 * i + 1;
    let right = 2 * i + 2;

    if (left < n && array[left].value > array[largest].value) {
      largest = left;
    }

    if (right < n && array[right].value > array[largest].value) {
      largest = right;
    }

    if (largest !== i) {
      [array[i], array[largest]] = [array[largest], array[i]];
      heapify(array, n, largest);
    }
  };

  const buildMaxHeap = (array) => {
    for (let i = Math.floor(array.length / 2) - 1; i >= 0; i--) {
      heapify(array, array.length, i);
    }
  };

  const heapSortRecursive = (array) => {
    buildMaxHeap(array);
    for (let i = array.length - 1; i > 0; i--) {
      [array[0], array[i]] = [array[i], array[0]];
      heapify(array, i, 0);
      steps.push([...array]);
    }
  };

  heapSortRecursive(sortedArr);
  return steps;
}

