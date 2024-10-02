'use client'

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import config from '@/lib/config'
import { useParams } from 'react-router-dom'

export default function AlgorithmSearch() {
  const { topic } = useParams<{ topic: string }>()

  const data = config?.find((option) => option.value === topic)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 dark:from-black dark:to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">{data?.name}</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.algorithms.map((algo) => (
            <Card
              key={algo.value}
              className="bg-white/10 backdrop-blur-xl border-gray-700 text-white hover:bg-white/20 transition-all duration-300"
            >
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  {algo.name}
                </CardTitle>
                <CardDescription className="text-gray-300">
                  {algo.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400 mb-2">
                  Time Complexity:{' '}
                  <Badge
                    variant="secondary"
                    className="ml-1 bg-gray-700 text-gray-200"
                  >
                    {algo.complexity}
                  </Badge>
                </p>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <Badge className="bg-blue-600 text-white">{algo.label}</Badge>
                <Button variant="link" asChild>
                  <a
                    href={algo.path}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    Learn more
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
