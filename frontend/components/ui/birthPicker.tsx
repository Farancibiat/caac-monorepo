"use client";
import { useState, useCallback } from "react";
import { ChevronDown } from "lucide-react";

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

interface BirthPickerProps {
  startYear: number;
  endYear: number;
  selected: Date;
  onSelect: (date: Date) => void;
}

const BirthPicker: React.FC<BirthPickerProps> = ({
  startYear,
  endYear,
  selected,
  onSelect,
}) => {
  const [error, setError] = useState<string | null>(null);

  // Generate arrays only once
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => endYear - i);

  const handleDateChange = useCallback((value: string, type: 'day' | 'month' | 'year') => {
    const currentYear = selected.getFullYear();
    const currentMonth = selected.getMonth();
    const currentDay = selected.getDate();

    let newYear = currentYear;
    let newMonth = currentMonth;
    let newDay = currentDay;

    switch (type) {
      case 'day':
        newDay = parseInt(value, 10);
        break;
      case 'month':
        newMonth = MONTHS.indexOf(value);
        break;
      case 'year':
        newYear = parseInt(value, 10);
        break;
    }

    const newDate = new Date(newYear, newMonth, newDay);
    
    const isValidDate = newDate.getFullYear() === newYear && 
                       newDate.getMonth() === newMonth && 
                       newDate.getDate() === newDay;

    if (isValidDate) {
      setError(null);
      onSelect(newDate);
    } else {
      setError("Fecha inválida seleccionada");
    }
  }, [selected, onSelect]);

  const SelectBox = ({ 
    label, 
    value, 
    options, 
    type 
  }: { 
    label: string; 
    value: string | number; 
    options: (string | number)[];
    type: 'day' | 'month' | 'year';
  }) => (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => handleDateChange(e.target.value, type)}
        className="w-full h-10 px-3 py-2 text-sm bg-background border border-input rounded-md shadow-sm 
                   focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring 
                   hover:border-accent-foreground cursor-pointer appearance-none
                   disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="" disabled hidden>
          {label}
        </option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 opacity-50 pointer-events-none" />
    </div>
  );

  return (
    <div className="space-y-2 max-w-[360px]">
      <div className="grid grid-cols-3 gap-4">
        <SelectBox
          label="Día"
          value={selected.getDate()}
          options={days}
          type="day"
        />
        <SelectBox
          label="Mes"
          value={MONTHS[selected.getMonth()]}
          options={MONTHS}
          type="month"
        />
        <SelectBox
          label="Año"
          value={selected.getFullYear()}
          options={years}
          type="year"
        />
      </div>
      
      {error && (
        <div className="text-red-500 text-sm text-center mt-2">
          {error}
        </div>
      )}
    </div>
  );
};

export default BirthPicker;