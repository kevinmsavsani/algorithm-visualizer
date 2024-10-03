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

interface LCSStep {
  i: number
  j: number
  value: number
  table: number[][]
  lcs: string
}

export default function LCSVisualizer() {
  const [sequence1, setSequence1] = useState('ABCDGH')
  const [sequence2, setSequence2] = useState('AEDFHR')
  const [steps, setSteps] = useState<LCSStep[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState(1)

  useEffect(() => {
    calculateLCS()
  }, [sequence1, sequence2])

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

  const calculateLCS = () => {
    const m = sequence1.length
    const n = sequence2.length
    const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0))
    const newSteps: LCSStep[] = []

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (sequence1[i - 1] === sequence2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
        }
        newSteps.push({ i, j, value: dp[i][j], table: JSON.parse(JSON.stringify(dp)), lcs: '' })
      }
    }

    // Backtrack to find LCS
    let i = m, j = n
    let lcs = ''
    while (i > 0 && j > 0) {
      if (sequence1[i - 1] === sequence2[j - 1]) {
        lcs = sequence1[i - 1] + lcs
        i--
        j--
      } else if (dp[i - 1][j] > dp[i][j - 1]) {
        i--
      } else {
        j--
      }
    }

    newSteps.push({ i: m, j: n, value: dp[m][n], table: dp, lcs })

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

  const renderLCSVisualization = () => {
    const currentLCS = steps[currentStep]?.lcs || ''
    return (
      <div className="flex flex-wrap gap-2">
        {sequence1.split('').map((char, index) => (
          <div
            key={index}
            className={`w-8 h-8 flex items-center justify-center border rounded ${
              currentLCS.includes(char) ? 'bg-green-200 dark:bg-green-800' : ''
            }`}
          >
            {char}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-6 dark:bg-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold text-center">Longest Common Subsequence (LCS) Visualizer</h1>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>What is the Longest Common Subsequence (LCS) Problem?</AccordionTrigger>
          <AccordionContent>
            <p>The Longest Common Subsequence (LCS) problem is a classic computer science problem of finding the longest subsequence common to all sequences in a set of sequences. It's a basis for file comparison programs and is used in bioinformatics.</p>
            <h3 className="font-semibold mt-2">Inputs:</h3>
            <ul className="list-disc list-inside">
              <li><strong>Sequence 1:</strong> The first string sequence.</li>
              <li><strong>Sequence 2:</strong> The second string sequence.</li>
            </ul>
            <h3 className="font-semibold mt-2">Output:</h3>
            <p>The longest subsequence of characters that appear in the same relative order in both sequences.</p>
            <h3 className="font-semibold mt-2">Table Explanation:</h3>
            <p>The table shows the dynamic programming solution. Each cell [i][j] represents the length of the LCS of the prefixes of length i and j of the two sequences.</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Card>
        <CardHeader>
          <CardTitle>LCS Settings</CardTitle>
          <CardDescription>Set the two sequences for LCS calculation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="sequence1">Sequence 1</Label>
              <Input
                id="sequence1"
                value={sequence1}
                onChange={(e) => setSequence1(e.target.value.toUpperCase())}
                className="mt-1 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <Label htmlFor="sequence2">Sequence 2</Label>
              <Input
                id="sequence2"
                value={sequence2}
                onChange={(e) => setSequence2(e.target.value.toUpperCase())}
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
          <CardTitle>LCS Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          {renderLCSVisualization()}
        </CardContent>
      </Card>

      {steps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Dynamic Programming Table</CardTitle>
            <CardDescription>
              Each cell [i][j] represents the length of the LCS for prefixes of length i and j
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead className="w-12"></TableHead>
                  {sequence2.split('').map((char, index) => (
                    <TableHead key={index} className="w-12 text-center">{char}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {steps[currentStep].table.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    <TableCell className="font-medium">
                      {rowIndex === 0 ? '' : sequence1[rowIndex - 1]}
                    </TableCell>
                    <TableCell className="font-medium">{rowIndex}</TableCell>
                    {row.map((cell, cellIndex) => (
                      <TableCell
                        key={cellIndex}
                        className={`text-center ${
                          rowIndex === steps[currentStep].i && cellIndex === steps[currentStep].j
                            ? 'bg-yellow-200 dark:bg-yellow-900'
                            : ''
                        }`}
                      >
                        {cell}
                      </TableCell>
                    ))}
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
          <p>Position: i = {steps[currentStep]?.i}, j = {steps[currentStep]?.j}</p>
          <p>Current LCS Length: {steps[currentStep]?.value}</p>
          <p>Step: {currentStep + 1} / {steps.length}</p>
          <p>Current LCS: {steps[currentStep]?.lcs || 'Not yet calculated'}</p>
        </CardContent>
      </Card>
    </div>
  )
}