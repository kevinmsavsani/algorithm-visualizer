import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import React from 'react'

export interface Option {
  value: string
  label: string
  method: any
}

interface AlgorithmSelectProps {
  value: Option
  onValueChange: (option: Option) => void
  options: Option[]
}

const AlgorithmSelect: React.FC<AlgorithmSelectProps> = ({
  value,
  onValueChange,
  options,
}) => {
  const handleValueChange = (selectedValue: string) => {
    const selectedOption = options.find(
      (option) => option.value === selectedValue,
    )
    if (selectedOption) {
      onValueChange(selectedOption)
    }
  }

  return (
    <Select value={value.value} onValueChange={handleValueChange}>
      <SelectTrigger className="w-full md:w-[180px]">
        <SelectValue placeholder="Select algorithm" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default AlgorithmSelect
