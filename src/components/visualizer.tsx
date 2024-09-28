import React, { useState, useEffect } from 'react';

const Visualizer: React.FC = () => {
  const [array, setArray] = useState<number[]>([]);

  useEffect(() => {
    generateArray();
  }, []);

  const generateArray = () => {
    const newArray = Array.from({ length: 20 }, () => Math.floor(Math.random() * 100));
    setArray(newArray);
  };

  const bubbleSort = async () => {
    const arr = [...array];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
          await new Promise((resolve) => setTimeout(resolve, 100)); // animation delay
        }
      }
    }
  };

  return (
    <div className="text-center">
      <div className="flex justify-center mb-4">
        {array.map((value, index) => (
          <div
            key={index}
            className="bg-blue-500 mx-1"
            style={{ height: `${value}px`, width: '20px' }}
          ></div>
        ))}
      </div>
      <button
        onClick={generateArray}
        className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
      >
        Generate New Array
      </button>
      <button
        onClick={bubbleSort}
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Bubble Sort
      </button>
    </div>
  );
};

export default Visualizer;
