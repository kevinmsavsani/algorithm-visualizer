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

interface CoinChangeStep {
  amount: number
  coin: number
  table: number[]
  coinUsed: number[]
}

export default function CoinChangeVisualizer() {
  const [amount, setAmount] = useState(11)
  const [coins, setCoins] = useState([1, 2, 5])
  const [steps, setSteps] = useState<CoinChangeStep[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState(1)

  useEffect(() => {
    calculateCoinChange()
  }, [amount, coins])

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

  const calculateCoinChange = () => {
    const dp: number[] = new Array(amount + 1).fill(Infinity)
    const coinUsed: number[] = new Array(amount + 1).fill(-1)
    dp[0] = 0
    const newSteps: CoinChangeStep[] = []

    for (let i = 1; i <= amount; i++) {
      for (const coin of coins) {
        if (coin <= i) {
          if (dp[i - coin] + 1 < dp[i]) {
            dp[i] = dp[i - coin] + 1
            coinUsed[i] = coin
          }
          newSteps.push({
            amount: i,
            coin: coin,
            table: [...dp],
            coinUsed: [...coinUsed]
          })
        }
      }
    }

    setSteps(newSteps)
    setCurrentStep(0)
    setIsAnimating(false)
  }

  const addCoin = () => {
    setCoins([...coins, 1])
  }

  const removeCoin = (index: number) => {
    setCoins(coins.filter((_, i) => i !== index))
  }

  const updateCoin = (index: number, value: number) => {
    const newCoins = [...coins]
    newCoins[index] = value
    setCoins(newCoins)
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

  const renderCoinChangeVisualization = () => {
    const current = steps[currentStep]
    if (!current) return null

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: amount }, (_, i) => (
            <div
              key={i}
              className={`w-12 h-12 flex items-center justify-center border rounded ${
                i + 1 === current.amount ? 'bg-yellow-200 dark:bg-yellow-900' : ''
              }`}
            >
              {i + 1}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {current.table.slice(1).map((value, index) => (
            <div
              key={index}
              className="w-12 h-12 flex items-center justify-center border rounded"
            >
              {value === Infinity ? '∞' : value}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-6 dark:bg-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold text-center">Coin Change Problem Visualizer</h1>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>What is the Coin Change Problem?</AccordionTrigger>
          <AccordionContent>
            <p>The Coin Change Problem is a classic dynamic programming problem. Given a set of coin denominations and a target amount, the goal is to find the minimum number of coins needed to make up that amount.</p>
            <h3 className="font-semibold mt-2">Inputs:</h3>
            <ul className="list-disc list-inside">
              <li><strong>Amount:</strong> The target amount of money to make change for.</li>
              <li><strong>Coins:</strong> A set of coin denominations available.</li>
            </ul>
            <h3 className="font-semibold mt-2">Output:</h3>
            <p>The minimum number of coins needed to make up the target amount.</p>
            <h3 className="font-semibold mt-2">Algorithm:</h3>
            <p>We use dynamic programming to build up solutions for smaller amounts until we reach the target amount. For each amount, we consider using each coin and choose the option that results in the fewest total coins.</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Card>
        <CardHeader>
          <CardTitle>Coin Change Settings</CardTitle>
          <CardDescription>Set the target amount and available coin denominations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="amount">Target Amount</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value)))}
                className="mt-1 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <Label>Coin Denominations</Label>
              {coins.map((coin, index) => (
                <div key={index} className="flex items-center space-x-2 mt-2">
                  <Input
                    type="number"
                    value={coin}
                    onChange={(e) => updateCoin(index, Math.max(1, parseInt(e.target.value)))}
                    className="dark:bg-gray-800 dark:text-white"
                  />
                  <Button variant="destructive" size="icon" onClick={() => removeCoin(index)}>
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button onClick={addCoin} className="mt-2">
                <Plus className="h-4 w-4 mr-2" /> Add Coin
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
          <CardTitle>Coin Change Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          {renderCoinChangeVisualization()}
        </CardContent>
      </Card>

      {steps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Coin Change Calculation Table</CardTitle>
            <CardDescription>
              Shows the minimum number of coins needed for each amount
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">Amount</TableHead>
                  <TableHead className="w-24">Coin Used</TableHead>
                  <TableHead className="w-24">Min Coins</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {steps[currentStep].table.map((minCoins, amount) => (
                  <TableRow key={amount} className={amount === steps[currentStep].amount ? 'bg-yellow-200 dark:bg-yellow-900' : ''}>
                    <TableCell>{amount}</TableCell>
                    <TableCell>{steps[currentStep].coinUsed[amount] !== -1 ? steps[currentStep].coinUsed[amount] : '-'}</TableCell>
                    <TableCell>{minCoins === Infinity ? '∞' : minCoins}</TableCell>
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
          <p>Current Amount: {steps[currentStep]?.amount}</p>
          <p>Considering Coin: {steps[currentStep]?.coin}</p>
          <p>Step: {currentStep + 1} / {steps.length}</p>
          <p>Minimum Coins: {steps[currentStep]?.table[steps[currentStep]?.amount] === Infinity ? '∞' : steps[currentStep]?.table[steps[currentStep]?.amount]}</p>
        </CardContent>
      </Card>
    </div>
  )
}