
import React from 'react';

export interface StyledRadioSelectProps {
  label?: string;
  value: string | number;
  options: Array<{ value: string | number; display: string }>;
  onChange: (value: string | number) => void;
  name: string;
  helpText?: string;
  inline?: boolean;
}

export const StyledRadioSelect: React.FC<StyledRadioSelectProps> = ({ 
    label, 
    value, 
    options, 
    onChange, 
    name, 
    helpText, 
    inline = true 
}) => (
  <div className="mb-3">
    {label && <label htmlFor={`${name}-label`} className="block text-sm font-medium text-gray-700">{label}</label>}
    {helpText && <p className="text-xs text-gray-500 mb-1">{helpText}</p>}
    <div className={`flex ${inline ? 'flex-wrap gap-2' : 'flex-col space-y-1'} mt-1`} role="radiogroup" id={`${name}-label`}>
      {options.map(option => (
        <label 
          key={option.value} 
          className={`cursor-pointer px-2.5 py-1.5 border rounded-md text-sm font-medium transition-colors text-center ${inline ? 'flex-grow' : 'w-full'}
          ${value === option.value 
            ? 'bg-[#009EE2] text-white border-[#008ACE] shadow-sm' 
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'}`
        }>
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => {
                requestAnimationFrame(() => { // Defer state update
                    onChange(option.value);
                });
            }}
            className="sr-only" 
            aria-label={`${label || name} ${option.display}`}
          />
          {option.display}
        </label>
      ))}
    </div>
  </div>
);
