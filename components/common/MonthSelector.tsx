
import React from 'react';

const MONTHS = [
  "ENE", "FEB", "MAR",
  "ABR", "MAY", "JUN",
  "JUL", "AGO", "SEP",
  "OCT", "NOV", "DIC"
];

interface MonthSelectorProps {
  selectedMonths: string[];
  onMonthToggle: (month: string) => void;
  label?: string;
  className?: string;
}

export const MonthSelector: React.FC<MonthSelectorProps> = ({ 
    selectedMonths, 
    onMonthToggle, 
    label,
    className = ''
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && <p className="block text-sm font-medium text-gray-700 mb-2">{label}</p>}
      <div className="grid grid-cols-4 gap-2">
        {MONTHS.map(month => {
          const isSelected = selectedMonths.includes(month);
          return (
            <button
              key={month}
              type="button"
              onClick={() => onMonthToggle(month)}
              className={`p-2 border rounded-md text-center text-xs sm:text-sm transition-colors duration-150
                ${isSelected 
                  ? 'bg-[#009EE2] text-white border-[#008ACE] font-semibold shadow-md' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-gray-400'
                }`}
              aria-pressed={isSelected}
            >
              {month}
            </button>
          );
        })}
      </div>
    </div>
  );
};
