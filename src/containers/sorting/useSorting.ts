import { useEffect, useState } from 'react'

const useSorting = () => {
  const [arr, setArr] = useState([])
  const [steps, setSteps] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isPaused, setIsPaused] = useState(true)
  const [intervalId, setIntervalId] = useState(null)
  const [animationSpeed, setAnimationSpeed] = useState(500)

  useEffect(() => {
    createArray()
  }, [])

  const createArray = (size = Math.floor(window.innerWidth / 50) / 2) => {
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
    setArr(newArr)
    setSteps([])
    setCurrentStep(0)
    setIsPaused(true)
    if (intervalId) {
      clearInterval(intervalId)
      setIntervalId(null)
    }
  }

  const sortFunc = () => {
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

  const toggleSorting = () => {
    if (isPaused) {
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
