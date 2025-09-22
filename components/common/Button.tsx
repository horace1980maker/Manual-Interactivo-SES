
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'success';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseStyles = 'font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed';

  let variantStyles = '';
  switch (variant) {
    case 'primary':
      variantStyles = 'bg-[#001F89] hover:bg-[#001A74] text-white focus:ring-[#001F89]';
      break;
    case 'secondary':
      variantStyles = 'bg-[#009EE2] hover:bg-[#008ACE] text-white focus:ring-[#009EE2]';
      break;
    case 'danger':
      variantStyles = 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-400';
      break;
    case 'outline':
      variantStyles = 'bg-transparent hover:bg-[#EBF5FF] text-[#001F89] border border-[#001F89] focus:ring-[#001F89]';
      break;
    case 'success':
      variantStyles = 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-400';
      break;
  }

  let sizeStyles = '';
  switch (size) {
    case 'sm':
      sizeStyles = 'px-3 py-1.5 text-sm';
      break;
    case 'md':
      sizeStyles = 'px-4 py-2 text-base';
      break;
    case 'lg':
      sizeStyles = 'px-6 py-3 text-lg';
      break;
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};