
import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  wrapperClassName?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, id, className = '', wrapperClassName = '', ...props }) => {
  return (
    <div className={`mb-4 ${wrapperClassName}`}>
      {label && <label htmlFor={id || props.name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <textarea
        id={id || props.name}
        rows={4}
        className={`mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#009EE2] focus:border-[#009EE2] sm:text-sm ${className}`}
        {...props}
      />
    </div>
  );
};