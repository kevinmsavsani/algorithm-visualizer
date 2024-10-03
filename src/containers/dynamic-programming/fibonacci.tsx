'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface FibStep {
  n: number
  value: number
  sequence: number[]
}

export default function FibonacciVisualizer() {
  const [n, setN] = useState(10)
  const [steps, setSteps] = useState<FibStep[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState(1)

  useEffect(() => {
    calculateFibonacci()
  }, [n])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isAnimating && currentStep < steps.length - 1) {
      timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1)
      }, 1000 / animationSpeed)
    } else if (currentStep >= steps.length - 1) {
      setIsAnimating(false)
    }
    return () => clearTimeout(timer)
  }, [isAnimating, currentStep, steps.length, animationSpeed])

  const calculateFibonacci = () => {
    const fib: number[] = [0, 1]
    const newSteps: FibStep[] = [
      { n: 0, value: 0, sequence: [0] },
      { n: 1, value: 1, sequence: [0, 1] }
    ]

    for (let i = 2; i <= n; i++) {
      fib[i] = fib[i - 1] + fib[i - 2]
      newSteps.push({ n: i, value: fib[i], sequence: [...fib] })
    }

    setSteps(newSteps)
    setCurrentStep(0)
    setIsAnimating(false)
  }

  const toggleAnimation = () => {
    setIsAnimating(!isAnimating)
  }

  const stepForward = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const stepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const reset = () => {
    setCurrentStep(0)
    setIsAnimating(false)
  }

  const renderFibonacciVisualization = () => {
    const currentSequence = steps[currentStep]?.sequence || []
    return (
      <div className="flex flex-wrap gap-2">
        {currentSequence.map((num, index) => (
          <div
            key={index}
            className={`w-12 h-12 flex items-center justify-center border rounded ${
              index === currentStep ? 'bg-yellow-200 dark:bg-yellow-900' : ''
            }`}
          >
            {num}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-6 dark:bg-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold text-center">Fibonacci Sequence Visualizer</h1>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>What is the Fibonacci Sequence?</AccordionTrigger>
          <AccordionContent>
            <p>The Fibonacci sequence is a series of numbers where each number is the sum of the two preceding ones. It usually starts with 0 and 1. The sequence goes: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, and so on.</p>
            <h3 className="font-semibold mt-2">Input:</h3>
            <ul className="list-disc list-inside">
              <li><strong>n:</strong> The number of Fibonacci numbers to calculate.</li>
            </ul>
            <h3 className="font-semibold mt-2">Output:</h3>
            <p>The first n numbers in the Fibonacci sequence.</p>
            <h3 className="font-semibold mt-2">Formula:</h3>
            <p>F(n) = F(n-1) + F(n-2), where F(0) = 0 and F(1) = 1</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Card>
        <CardHeader>
          <CardTitle>Fibonacci Settings</CardTitle>
          <CardDescription>Set the number of Fibonacci numbers to calculate</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="fibN">Number of Fibonacci Numbers (n)</Label>
              <Input
                id="fibN"
                type="number"
                value={n}
                onChange={(e) => setN(Math.max(2, Math.min(30, parseInt(e.target.value))))}
                className="mt-1 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Visualization Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-center space-x-2">
              <Button onClick={toggleAnimation}>
                {isAnimating ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {isAnimating ? 'Pause' : 'Play'}
              </Button>
              <Button onClick={stepBackward}>
                <SkipBack className="h-4 w-4 mr-2" /> Step Back
              </Button>
              <Button onClick={stepForward}>
                <SkipForward className="h-4 w-4 mr-2" /> Step Forward
              </Button>
              <Button onClick={reset}>
                <RotateCcw className="h-4 w-4 mr-2" /> Reset
              </Button>
            </div>

            <div className="flex items-center space-x-4">
              <Label htmlFor="speed">Animation Speed</Label>
              <Slider
                id="speed"
                min={1}
                max={10}
                step={1}
                value={[animationSpeed]}
                onValueChange={(value) => setAnimationSpeed(value[0])}
                className="w-64"
              />
              <span>{animationSpeed}x</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fibonacci Sequence Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          {renderFibonacciVisualization()}
        </CardContent>
      </Card>

      {steps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Fibonacci Calculation Table</CardTitle>
            <CardDescription>
              Shows how each Fibonacci number is calculated from the previous two
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">n</TableHead>
                  <TableHead className="w-24">F(n-2)</TableHead>
                  <TableHead className="w-24">F(n-1)</TableHead>
                  <TableHead className="w-24">F(n)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {steps.map((step, index) => (
                  <TableRow key={index} className={index === currentStep ? 'bg-yellow-200 dark:bg-yellow-900' : ''}>
                    <TableCell>{step.n}</TableCell>
                    <TableCell>{index < 2 ? '-' : steps[index - 2].value}</TableCell>
                    <TableCell>{index < 1 ? '-' : steps[index - 1].value}</TableCell>
                    <TableCell>{step.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Current Step Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p>n: {steps[currentStep]?.n}</p>
          <p>Current Fibonacci Number: {steps[currentStep]?.value}</p>
          <p>Step: {currentStep + 1} / {steps.length}</p>
        </CardContent>
      </Card>
    </div>
  )
}