import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface AlgorithmSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: Option[];
}

const AlgorithmSelect: React.FC<AlgorithmSelectProps> = ({ value, onValueChange, options }) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full md:w-[180px]">
        <SelectValue placeholder="Select algorithm" />
      </SelectTrigger>
      <SelectContent>
        {options.map(option => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default AlgorithmSelect;