import React from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface TabsComponentProps {
  setCurrentMode: (mode: string) => void
  modes?: any
  defaultValue?: string
}

const TabsComponent: React.FC<TabsComponentProps> = ({ setCurrentMode, modes, defaultValue }) => {
  return (
    <Tabs defaultValue={defaultValue}>
      <TabsList>
        {modes.map((mode) => (
          <TabsTrigger
            key={mode.value}
            value={mode.value}
            onClick={() => setCurrentMode(mode.value)}
          >
            {mode.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}

export default TabsComponent
