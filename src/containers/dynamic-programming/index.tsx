'use client'

import config from '@/lib/config'
import { useParams } from 'react-router-dom'
import KnapsackVisualizer from './knapsack';
import LCSVisualizer from './lcs';
import FibonacciVisualizer from './fibonacci';
import CoinChangeVisualizer from './coin-change';
import LISVisualizer from './lis';

export default function DynamicProgrammingVisualizer() {
  const { algorithm } = useParams<{ algorithm: string; topic: string }>()
  const algorithmOption = config
    ?.find((option) => option.value === 'dynamic-programming')
    ?.algorithms.find((option) => option.value === algorithm)
  
    const renderAlgorithmComponent = () => {
      switch (algorithmOption?.value) {
        case 'knapsack':
          return <KnapsackVisualizer />
        case 'lcs':
          return <LCSVisualizer />
        case 'fibonacci':
          return <FibonacciVisualizer />
        case 'coin-change':
          return <CoinChangeVisualizer />
        case 'lis':
          return <LISVisualizer />
        default:
          return <p>Algorithm not found</p>
      }
    }

  return (
    <div>
      {algorithmOption?.value && renderAlgorithmComponent()}
    </div>
  )

}