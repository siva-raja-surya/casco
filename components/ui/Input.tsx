import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  helperText, 
  required, 
  className = '', 
  id,
  ...props 
}) => {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={inputId}
        className={`w-full px-3 py-2 border rounded-md shadow-sm transition-colors focus:outline-none focus:ring-1 bg-white text-black
          ${error 
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
            : 'border-gray-300 focus:border-cosco-primary focus:ring-cosco-primary'
          } disabled:bg-gray-100 disabled:text-gray-500`}
        {...props}
      />
      {helperText && !error && <p className="mt-1 text-xs text-gray-500">{helperText}</p>}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};