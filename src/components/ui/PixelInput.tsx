import React, { forwardRef } from 'react';

interface PixelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const PixelInput = forwardRef<HTMLInputElement, PixelInputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block mb-2 font-pixel text-xs text-gray-300">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full
            bg-pixel-bg
            border-2
            ${error ? 'border-pixel-danger' : 'border-pixel-border'}
            px-3
            py-2
            text-white
            font-mono
            text-sm
            placeholder-gray-500
            focus:outline-none
            focus:border-pixel-primary
            transition-colors
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-pixel-danger font-pixel">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-xs text-gray-500 font-mono">{helperText}</p>
        )}
      </div>
    );
  }
);

PixelInput.displayName = 'PixelInput';
