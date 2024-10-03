'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Plus, Minus } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface LISStep {
  index: number
  sequence: number[]
  dp: number[]
  lis: number[]
  currentLIS: number[]
}

export default function LISVisualizer() {
  const [sequence, setSequence] = useState([10, 22, 9, 33, 21, 50, 41, 60, 80])
  const [steps, setSteps] = useState<LISStep[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState(1)

  useEffect(() => {
    calculateLIS()
  }, [sequence])

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

  const calculateLIS = () => {
    const n = sequence.length
    const dp: number[] = new Array(n).fill(1)
    const lis: number[] = new Array(n).fill(-1)
    const newSteps: LISStep[] = []

    for (let i = 1; i < n; i++) {
      for (let j = 0; j < i; j++) {
        if (sequence[i] > sequence[j] && dp[i] < dp[j] + 1) {
          dp[i] = dp[j] + 1
          lis[i] = j
        }
        newSteps.push({
          index: i,
          sequence: [...sequence],
          dp: [...dp],
          lis: [...lis],
          currentLIS: reconstructLIS(lis, i)
        })
      }
    }

    setSteps(newSteps)
    setCurrentStep(0)
    setIsAnimating(false)
  }

  const reconstructLIS = (lis: number[], end: number): number[] => {
    const result: number[] = []
    for (let i = end; i !== -1; i = lis[i]) {
      result.unshift(sequence[i])
    }
    return result
  }

  const addNumber = () => {
    setSequence([...sequence, 0])
  }

  const removeNumber = (index: number) => {
    setSequence(sequence.filter((_, i) => i !== index))
  }

  const updateNumber = (index: number, value: number) => {
    const newSequence = [...sequence]
    newSequence[index] = value
    setSequence(newSequence)
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

  const renderLISVisualization = () => {
    const current = steps[currentStep]
    if (!current) return null

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {current.sequence.map((num, index) => (
            <div
              key={index}
              className={`w-12 h-12 flex items-center justify-center border rounded ${
                index === current.index ? 'bg-yellow-200 dark:bg-yellow-900' : 
                current.currentLIS.includes(num) ? 'bg-green-200 dark:bg-green-900' : ''
              }`}
            >
              {num}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {current.dp.map((length, index) => (
            <div
              key={index}
              className="w-12 h-12 flex items-center justify-center border rounded"
            >
              {length}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-6 dark:bg-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold text-center">Longest Increasing Subsequence (LIS) Visualizer</h1>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>What is the Longest Increasing Subsequence (LIS) Problem?</AccordionTrigger>
          <AccordionContent>
            <p>The Longest Increasing Subsequence (LIS) problem is to find a subsequence of a given sequence in which the subsequence's elements are in sorted order, lowest to highest, and in which the subsequence is as long as possible. This subsequence is not necessarily contiguous or unique.</p>
            <h3 className="font-semibold mt-2">Input:</h3>
            <ul className="list-disc list-inside">
              <li><strong>Sequence:</strong> An array of numbers.</li>
            </ul>
            <h3 className="font-semibold mt-2">Output:</h3>
            <p>The length of the longest increasing subsequence and one possible longest increasing subsequence.</p>
            <h3 className="font-semibold mt-2">Algorithm:</h3>
            <p>We use dynamic programming to build up solutions for smaller subsequences. For each element, we consider it as a potential end of an increasing subsequence and determine its length based on previous elements.</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Card>
        <CardHeader>
          <CardTitle>LIS Settings</CardTitle>
          <CardDescription>Set the sequence for LIS calculation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Sequence</Label>
              {sequence.map((num, index) => (
                <div key={index} className="flex items-center space-x-2 mt-2">
                  <Input
                    type="number"
                    value={num}
                    onChange={(e) => updateNumber(index, parseInt(e.target.value))}
                    className="dark:bg-gray-800 dark:text-white"
                  />
                  <Button variant="destructive" size="icon" onClick={() => removeNumber(index)}>
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button onClick={addNumber} className="mt-2">
                <Plus className="h-4 w-4 mr-2" /> Add Number
              </Button>
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
          <CardTitle>LIS Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          {renderLISVisualization()}
        </CardContent>
      </Card>

      {steps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>LIS Calculation Table</CardTitle>
            <CardDescription>
              Shows the length of the LIS ending at each index
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">Index</TableHead>
                  <TableHead className="w-24">Number</TableHead>
                  <TableHead className="w-24">LIS Length</TableHead>
                  <TableHead className="w-24">Previous Index</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {steps[currentStep].sequence.map((num, index) => (
                  <TableRow key={index} className={index === steps[currentStep].index ? 'bg-yellow-200 dark:bg-yellow-900' : ''}>
                    <TableCell>{index}</TableCell>
                    <TableCell>{num}</TableCell>
                    <TableCell>{steps[currentStep].dp[index]}</TableCell>
                    <TableCell>{steps[currentStep].lis[index] !== -1 ? steps[currentStep].lis[index] : '-'}</TableCell>
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
          <p>Current Index: {steps[currentStep]?.index}</p>
          <p>Current Number: {steps[currentStep]?.sequence[steps[currentStep]?.index]}</p>
          <p>Step: {currentStep + 1} / {steps.length}</p>
          <p>Current LIS: {steps[currentStep]?.currentLIS.join(', ')}</p>
          <p>Current LIS Length: {steps[currentStep]?.currentLIS.length}</p>
        </CardContent>
      </Card>
    </div>
  )
}