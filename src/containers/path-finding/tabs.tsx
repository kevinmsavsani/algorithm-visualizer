import React from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface TabsComponentProps {
  setCurrentTool: (tool: string) => void
}

const TabsComponent: React.FC<TabsComponentProps> = ({ setCurrentTool }) => {
  return (
    <Tabs defaultValue="wall">
      <TabsList>
        <TabsTrigger value="wall" onClick={() => setCurrentTool('wall')}>
          Wall
        </TabsTrigger>
        <TabsTrigger value="start" onClick={() => setCurrentTool('start')}>
          Start
        </TabsTrigger>
        <TabsTrigger value="end" onClick={() => setCurrentTool('end')}>
          End
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}

export default TabsComponent
