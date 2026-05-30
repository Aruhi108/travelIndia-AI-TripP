import React from 'react';

const LoadingSpinner = ({ size = 'large', text, showText = true }) => {
  const sizeClasses = {
    small: 'h-5 w-5',
    medium: 'h-10 w-10',
    large: 'h-14 w-14'
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizeClasses[size]}`}
      />

      {text && showText && (
        <p className="mt-3 text-gray-600 text-sm">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;