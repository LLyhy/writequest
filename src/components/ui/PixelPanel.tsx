import React from 'react';
import { motion } from 'framer-motion';

interface PixelPanelProps {
  children: React.ReactNode;
  variant?: 'default' | 'inset' | 'bordered';
  className?: string;
  title?: string;
  titleIcon?: React.ReactNode;
  animate?: boolean;
}

const variantStyles = {
  default: 'bg-pixel-panel border-2 border-pixel-border shadow-pixel',
  inset: 'bg-pixel-bg border-2 border-pixel-border shadow-pixel-inset',
  bordered: 'bg-pixel-panel border-2 border-pixel-border',
};

export const PixelPanel: React.FC<PixelPanelProps> = ({
  children,
  variant = 'default',
  className = '',
  title,
  titleIcon,
  animate = true,
}) => {
  const content = (
    <div className={`${variantStyles[variant]} ${className}`}>
      {title && (
        <div className="flex items-center gap-2 px-4 py-3 border-b-2 border-pixel-border bg-pixel-border/20">
          {titleIcon && <span className="text-lg">{titleIcon}</span>}
          <h3 className="font-pixel text-sm text-white text-shadow-pixel">{title}</h3>
        </div>
      )}
      <div className={title ? 'p-4' : 'p-4'}>{children}</div>
    </div>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
};
