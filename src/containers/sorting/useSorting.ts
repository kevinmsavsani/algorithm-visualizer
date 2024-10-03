import { useEffect, useState } from 'react'

interface ArrayElement {
  value: number
  id: string
}

const useSorting = () => {
  const [arr, setArr] = useState<ArrayElement[]>([])
  const [steps, setSteps] = useState<any[]>([])
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [isPaused, setIsPaused] = useState<boolean>(true)
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null)
  const [animationSpeed, setAnimationSpeed] = useState<number>(500)

  useEffect(() => {
    createArray()
  }, [])

  useEffect(() => {
    if (!isPaused) {
      if (intervalId) {
        clearInterval(intervalId)
      }
      startInterval()
    }
  }, [animationSpeed, isPaused])

  const generateRandomValue = (index: number): ArrayElement => {
    const value = Math.floor(Math.random() * (window.innerHeight / 4 - 30 + 1)) + 30
    console.log(`Generated value for index ${index}:`, value)
    return {
      value,
      id: `id-${index}`,
    }
  }

  const createArray = (size: number = Math.floor(window.innerWidth / 50) / 2) => {
    console.log('Creating array with size:', size)
    const newArr = Array.from({ length: size }, (_, i) => generateRandomValue(i))
    setArr(newArr)
    setSteps([])
    setCurrentStep(0)
    setIsPaused(true)
    if (intervalId) {
      clearInterval(intervalId)
      setIntervalId(null)
    }
  }

  const startInterval = () => {
    const id = setInterval(() => {
      setCurrentStep((prevStep) => {
        if (prevStep < steps.length - 1) {
          return prevStep + 1
        } else {
          clearInterval(id)
          return prevStep
        }
      })
    }, animationSpeed)
    setIntervalId(id)
  }

  const sortFunc = () => {
    setIsPaused(false)
    startInterval()
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

  const toggleSorting = () => {
    if (isPaused) {
      console.log('Resuming sorting')
      setIsPaused(false)
    } else {
      console.log('Pausing sorting')
      if (intervalId) {
        clearInterval(intervalId)
        setIntervalId(null)
      }
      setIsPaused(true)
    }
  }

  return {
    arr,
    steps,
    currentStep,
    isPaused,
    createArray,
    sortFunc,
    nextStep,
    prevStep,
    resetSteps,
    toggleSorting,
    setSteps,
    setCurrentStep,
    setIsPaused,
    animationSpeed,
    setAnimationSpeed,
  }
}

export default useSorting