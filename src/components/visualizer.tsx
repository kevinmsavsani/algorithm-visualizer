import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import bubbleSort from '../algorithms/bubble-sort';
import selectionSort from '../algorithms/selection-sort';
import mergeSort from '../algorithms/merge-sort';
import quickSort from '../algorithms/quick-sort';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../components/ui/dropdown-menu';
import 'tailwindcss/tailwind.css';
import { Button } from './ui/button';

const springAnim = {
  type: 'spring',
  damping: 20,
  stiffness: 300,
};

const Visualizer = () => {
  const [arr, setArr] = useState([]);
  const [method, setMethod] = useState('Algorithms');
  const [speed, setSpeed] = useState(100);

  const createArray = (size = Math.floor(window.innerWidth / 50) / 2) => {
    const newArr = Array.from({ length: size }, (_, i) => ({
      value: Math.floor(Math.random() * (window.innerHeight / 4 - 30 + 1)) + 30,
      id: `id-${i}`,
    }));
    setArr(newArr);
  };

  useEffect(() => {
    createArray();
    window.addEventListener('resize', () => createArray());
    return () => window.removeEventListener('resize', () => createArray());
  }, []);

  const sortFunc = () => {
    let sortedArr = [];
    if (method === 'Algorithms') {
      alert('Select an algorithm first!');
      return;
    }
    if (method === 'Bubble Sort') sortedArr = bubbleSort(arr);
    else if (method === 'Selection Sort') sortedArr = selectionSort(arr);
    else if (method === 'Merge Sort') sortedArr = mergeSort(arr);
    else if (method === 'Quick Sort') sortedArr = quickSort(arr);

    sortedArr.forEach((step, i) => {
      setTimeout(() => setArr(step), speed * i);
    });
  };

  return (
    <div>
      <div className="bg-gray-100 dark:bg-gray-800 p-4">
        <div className="flex justify-between items-center">
          <a className="text-xl font-bold text-gray-900 dark:text-gray-100" href="#">
            Sorting
          </a>
          <div className="flex items-center space-x-4">
            <Button className="bg-blue-500 text-white" onClick={() => createArray()}>
              Randomize
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-blue-500 text-white">
                  {method}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setMethod('Bubble Sort')}>Bubble Sort</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setMethod('Selection Sort')}>Selection Sort</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setMethod('Merge Sort')}>Merge Sort</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setMethod('Quick Sort')}>Quick Sort</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button className="bg-green-500 text-white" onClick={sortFunc}>
              Sort
            </Button>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-end mt-8 space-x-1">
        {arr.map((element, index) => (
          <motion.div
            key={element.id}
            layout
            transition={springAnim}
            className="bg-blue-500 text-white text-center"
            style={{ height: element.value * 3, width: '40px' }}
          >
            {element.value}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Visualizer;