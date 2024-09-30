import { useState } from 'react'
import bubbleSort from './algorithms/bubble-sort'
import selectionSort from './algorithms/selection-sort'
import mergeSort from './algorithms/merge-sort'

const useSorting = () => {
  const [arr, setArr] = useState([])
  const [method, setMethod] = useState('Algorithms')
  const [steps, setSteps] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isPaused, setIsPaused] = useState(true)
  const [intervalId, setIntervalId] = useState(null)

  const handleAlgorithmSelection = (selectedMethod) => {
    let sortedSteps = []
    if (selectedMethod === 'Bubble Sort') sortedSteps = bubbleSort(arr)
    else if (selectedMethod === 'Selection Sort')
      sortedSteps = selectionSort(arr)
    else if (selectedMethod === 'Merge Sort') sortedSteps = mergeSort(arr)

    setSteps([arr, ...sortedSteps])
    setCurrentStep(0)
    setMethod(selectedMethod)
    setIsPaused(true) // Ensure it's paused initially
  }

  const createArray = (selectedMethod, size = Math.floor(window.innerWidth / 50) / 2) => {
    console.log('Creating array with size:', size)
    const newArr = Array.from({ length: size }, (_, i) => {
      const value =
        Math.floor(Math.random() * (window.innerHeight / 4 - 30 + 1)) + 30
      console.log(`Generated value for index ${i}:`, value)
      return {
        value,
        id: `id-${i}`,
      }
    })
    console.log('New array:', newArr)
    setArr(newArr)
    setSteps([])
    setCurrentStep(0)
    setIsPaused(true)
    if(selectedMethod) {
      handleAlgorithmSelection(selectedMethod)  
    }
    if (intervalId) {
      clearInterval(intervalId)
      setIntervalId(null)
    }
  }

  const sortFunc = () => {
    if (method === 'Algorithms') {
      alert('Select an algorithm first!')
      return
    }

    setIsPaused(false)
    const id = setInterval(() => {
      setCurrentStep((prevStep) => {
        if (prevStep < steps.length - 1) {
          return prevStep + 1
        } else {
          clearInterval(id)
          return prevStep
        }
      })
    }, 500)
    setIntervalId(id)
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const resetSteps = () => {
    setCurrentStep(0)
  }

  const pauseSorting = () => {
    console.log('Pausing sorting')
    if (intervalId) {
      clearInterval(intervalId)
      setIntervalId(null)
    }
    setIsPaused(true)
  }

  const resumeSorting = () => {
    console.log('Resuming sorting')
    setIsPaused(false)
    const id = setInterval(() => {
      setCurrentStep((prevStep) => {
        if (prevStep < steps.length - 1) {
          return prevStep + 1
        } else {
          clearInterval(id)
          return prevStep
        }
      })
    }, 500)
    setIntervalId(id)
  }

  return {
    arr,
    steps,
    currentStep,
    isPaused,
    method,
    createArray,
    handleAlgorithmSelection,
    sortFunc,
    nextStep,
    prevStep,
    resetSteps,
    pauseSorting,
    resumeSorting,
  }
}

export default useSorting
