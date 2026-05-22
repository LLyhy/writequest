import type { ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface PixelButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'accent' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  isLoading?: boolean;
}

const variantStyles = {
  primary: 'bg-pixel-primary text-pixel-border font-bold',
  secondary: 'bg-pixel-secondary text-white',
  accent: 'bg-pixel-accent text-pixel-border font-bold',
  danger: 'bg-pixel-danger text-white',
};

const sizeStyles = {
  sm: 'px-3 py-1 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export const PixelButton = ({
  variant = 'primary',
  size = 'md',
  children,
  isLoading = false,
  disabled,
  className = '',
  ...props
}: PixelButtonProps) => {
  return (
    <motion.button
      whileHover={{ y: 2 }}
      whileTap={{ y: 4 }}
      className={`
        relative
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        border-2 border-pixel-border
        shadow-pixel-sm
        transition-shadow
        hover:shadow-none
        disabled:opacity-50
        disabled:cursor-not-allowed
        disabled:hover:shadow-pixel-sm
        font-pixel
        pixelated
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="animate-bounce">●</span>
          <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>●</span>
          <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>●</span>
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
};
