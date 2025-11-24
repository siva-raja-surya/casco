import React from 'react';

export const Button = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = '', 
  disabled, 
  ...props 
}) => {
  const baseStyles = "px-6 py-2 rounded-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-cosco-primary hover:bg-cosco-secondary text-white focus:ring-cosco-primary",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-400",
    outline: "border border-cosco-primary text-cosco-primary hover:bg-cosco-light focus:ring-cosco-primary",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className} flex items-center justify-center`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </span>
      ) : (
        children
      )}
    </button>
  );
};