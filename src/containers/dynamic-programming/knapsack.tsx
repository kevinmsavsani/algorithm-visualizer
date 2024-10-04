'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Plus,
  Minus,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  CirclePlus,
} from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

interface Item {
  id: number
  weight: number
  value: number
}

interface KnapsackStep {
  i: number
  w: number
  value: number
  table: { value: number; selectedItems: number[] }[][]
  selected: boolean[]
}

export default function KnapsackVisualizer() {
  const [capacity, setCapacity] = useState(50)
  const [items, setItems] = useState<Item[]>([
    { id: 1, weight: 10, value: 60 },
    { id: 2, weight: 20, value: 100 },
    { id: 3, weight: 30, value: 120 },
  ])
  const [steps, setSteps] = useState<KnapsackStep[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState(1)

  useEffect(() => {
    calculateKnapsack()
  }, [capacity, items])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isAnimating && currentStep < steps.length - 1) {
      timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1)
      }, 1000 / animationSpeed)
    } else if (currentStep >= steps.length - 1) {
      setIsAnimating(false)
    }
    return () => clearTimeout(timer)
  }, [isAnimating, currentStep, steps.length, animationSpeed])

  const calculateKnapsack = () => {
    const n = items.length
    const dp: { value: number; selectedItems: number[] }[][] = Array(n + 1)
      .fill(null)
      .map(() =>
        Array(capacity + 1)
          .fill(null)
          .map(() => ({ value: 0, selectedItems: [] })),
      )
    const newSteps: KnapsackStep[] = []
    const selected: boolean[] = Array(n).fill(false)

    for (let i = 1; i <= n; i++) {
      for (let w = 0; w <= capacity; w++) {
        if (items[i - 1].weight <= w) {
          const includeItem =
            items[i - 1].value + dp[i - 1][w - items[i - 1].weight].value
          const excludeItem = dp[i - 1][w].value
          if (includeItem > excludeItem) {
            dp[i][w].value = includeItem
            dp[i][w].selectedItems = [
              ...dp[i - 1][w - items[i - 1].weight].selectedItems,
              i - 1,
            ]
          } else {
            dp[i][w].value = excludeItem
            dp[i][w].selectedItems = [...dp[i - 1][w].selectedItems]
          }
        } else {
          dp[i][w].value = dp[i - 1][w].value
          dp[i][w].selectedItems = [...dp[i - 1][w].selectedItems]
        }
        newSteps.push({
          i,
          w,
          value: dp[i][w].value,
          table: JSON.parse(JSON.stringify(dp)),
          selected: [...selected],
        })
      }
    }

    // Backtrack to find selected items
    let w = capacity
    for (let i = n; i > 0 && w > 0; i--) {
      if (dp[i][w].value !== dp[i - 1][w].value) {
        selected[i - 1] = true
        w -= items[i - 1].weight
      }
    }
    newSteps.push({
      i: n,
      w: capacity,
      value: dp[n][capacity].value,
      table: dp,
      selected,
    })

    setSteps(newSteps)
    setCurrentStep(0)
    setIsAnimating(false)
  }

  const addItem = () => {
    const newId = Math.max(0, ...items.map((item) => item.id)) + 1
    setItems([...items, { id: newId, weight: 0, value: 0 }])
  }

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const updateItem = (id: number, field: 'weight' | 'value', value: number) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    )
  }

  const toggleAnimation = () => {
    setIsAnimating(!isAnimating)
  }

  const stepForward = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const stepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const reset = () => {
    setCurrentStep(0)
    setIsAnimating(false)
  }

  function generate() {
    const randomCapacity = Math.floor(Math.random() * 11) + 15 // Random capacity between 15 and 25
    const totalWeight = randomCapacity * 2 // Total weight is twice the random capacity
    const itemCount = 5

    // Generate random weights that sum up to totalWeight
    let remainingWeight = totalWeight
    const randomItems = Array.from({ length: itemCount }, (_, index) => {
      const weight =
        index === itemCount - 1
          ? remainingWeight
          : Math.floor(
              Math.random() * (remainingWeight / (itemCount - index)),
            ) + 1
      remainingWeight -= weight
      return {
        id: Math.random().toString(36).substr(2, 9),
        weight,
        value: Math.floor(Math.random() * 100) + 1, // Random value between 1 and 100
      }
    })

    setCapacity(randomCapacity)
    setItems(randomItems)
  }

  return (
    <div className="container mx-auto p-4 space-y-6 dark:bg-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold text-center">
        Knapsack Problem Visualizer
      </h1>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>What is the Knapsack Problem?</AccordionTrigger>
          <AccordionContent>
            <p>
              The Knapsack Problem is a classic optimization problem in computer
              science and mathematics. It models a situation where you have a
              knapsack (bag) with a fixed capacity and a set of items, each with
              a weight and a value. The goal is to determine which items to
              include in the knapsack to maximize the total value while not
              exceeding the knapsack's capacity.
            </p>
            <h3 className="font-semibold mt-2">Inputs:</h3>
            <ul className="list-disc list-inside">
              <li>
                <strong>Capacity:</strong> The maximum weight the knapsack can
                hold.
              </li>
              <li>
                <strong>Items:</strong> A list of items, each with a weight and
                a value.
              </li>
            </ul>
            <h3 className="font-semibold mt-2">Output:</h3>
            <p>
              The maximum value that can be achieved by selecting items without
              exceeding the knapsack's capacity.
            </p>
            <h3 className="font-semibold mt-2">Table Explanation:</h3>
            <p>
              The table shows the dynamic programming solution. Each cell [i][w]
              represents the maximum value that can be achieved with the first i
              items and a knapsack capacity of w.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Card>
        <CardHeader>
          <CardTitle>Knapsack Settings</CardTitle>
          <CardDescription>
            Set the capacity and items for the knapsack
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6 p-4">
            <div>
              <Label
                htmlFor="capacity"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Knapsack Capacity (Maximum weight the knapsack can hold)
              </Label>
              <Input
                id="capacity"
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Items
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mt-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="relative flex flex-col p-4 border rounded-md shadow-sm dark:border-gray-700"
                  >
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="absolute top-2 right-2 rounded-full"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <div className="flex flex-col mt-2">
                      <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        Weight
                      </label>
                      <Input
                        type="number"
                        value={item.weight}
                        onChange={(e) =>
                          updateItem(item.id, 'weight', Number(e.target.value))
                        }
                        placeholder="Weight"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                    <div className="flex flex-col mt-4">
                      <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        Value
                      </label>
                      <Input
                        type="number"
                        value={item.value}
                        onChange={(e) =>
                          updateItem(item.id, 'value', Number(e.target.value))
                        }
                        placeholder="Value"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <Button
                onClick={addItem}
                className="mt-4 w-full md:w-auto flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Item
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Visualization Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-center space-x-2">
                <Button onClick={generate}>
                  <CirclePlus className="h-4 w-4 mr-2" /> Generate
                </Button>
                <Button onClick={toggleAnimation}>
                  {isAnimating ? (
                    <Pause className="h-4 w-4 mr-2" />
                  ) : (
                    <Play className="h-4 w-4 mr-2" />
                  )}
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
          <CardContent className="flex justify-between">
            <div>
              <CardHeader>
                <CardTitle>Current Step Information</CardTitle>
              </CardHeader>
              <p>
                Item: {steps[currentStep]?.i}, Weight: {steps[currentStep]?.w}
              </p>
              <p>Current Maximum Value: {steps[currentStep]?.value}</p>
              <p>
                Step: {currentStep + 1} / {steps.length}
              </p>
            </div>
            <div className="">
              <CardHeader>
                <CardTitle>Selected Items</CardTitle>
              </CardHeader>
              <ul className="list-disc list-inside">
                {steps[currentStep]?.selected.map(
                  (isSelected, index) =>
                    isSelected && (
                      <li key={index}>
                        Item {index + 1}: Weight = {items[index].weight}, Value
                        = {items[index].value}
                      </li>
                    ),
                )}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {steps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Dynamic Programming Table</CardTitle>
            <CardDescription>
              Each cell [i][w] represents the maximum value achievable with the
              first i items and capacity w
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  {Array.from({ length: capacity + 1 }, (_, i) => (
                    <TableHead key={i} className="w-12 text-center">
                      {i}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {steps[currentStep].table.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    <TableCell className="font-medium">{rowIndex}</TableCell>
                    {row.map((cell, cellIndex) => (
                      <TableCell
                        key={cellIndex}
                        className={`text-center ${
                          rowIndex === steps[currentStep].i &&
                          cellIndex === steps[currentStep].w
                            ? 'bg-yellow-200 dark:bg-yellow-900'
                            : ''
                        }`}
                      >
                        <div>
                          <div>{cell.value}</div>
                          <div className="text-xxs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                            {cell.selectedItems.length > 0 ? (
                              <ul className="list-inside">
                                {cell.selectedItems.map((itemIndex) => (
                                  <li key={itemIndex}>Item {itemIndex + 1}</li>
                                ))}
                              </ul>
                            ) : (
                              <span>No items</span>
                            )}
                          </div>
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
