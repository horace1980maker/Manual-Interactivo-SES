
import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Array<{ value: string | number; label: string }>;
  wrapperClassName?: string;
  placeholder?: string; // Added placeholder prop
}

export const Select: React.FC<SelectProps> = ({ 
  label, 
  id, 
  options, 
  className = '', 
  wrapperClassName = '', 
  placeholder, // Destructured placeholder
  ...rest // Use ...rest for other HTMLSelectAttributes
}) => {
  return (
    <div className={`mb-4 ${wrapperClassName}`}>
      {label && <label htmlFor={id || rest.name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <select
        id={id || rest.name}
        className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#009EE2] focus:border-[#009EE2] sm:text-sm rounded-md bg-white border shadow-sm ${className}`}
        {...rest} // Spread rest of the props
      >
        {/* Use the destructured placeholder prop */}
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};