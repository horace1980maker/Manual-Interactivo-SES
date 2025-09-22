
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  wrapperClassName?: string;
  error?: string | null; // Added error prop
}

export const Input: React.FC<InputProps> = ({ label, id, className = '', wrapperClassName = '', error, ...props }) => {
  return (
    <div className={`mb-4 ${wrapperClassName}`}>
      {label && <label htmlFor={id || props.name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <input
        id={id || props.name}
        className={`mt-1 block w-full px-3 py-2 bg-white border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none ${error ? 'focus:ring-red-500 focus:border-red-500' : 'focus:ring-[#009EE2] focus:border-[#009EE2]'} sm:text-sm disabled:bg-gray-100 ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};