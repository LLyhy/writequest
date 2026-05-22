import React from 'react';
import { motion } from 'framer-motion';
import { Coins } from 'lucide-react';

interface CoinDisplayProps {
  amount: number;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: { text: 'text-xs', icon: 14 },
  md: { text: 'text-sm', icon: 18 },
  lg: { text: 'text-lg', icon: 24 },
};

export const CoinDisplay: React.FC<CoinDisplayProps> = ({
  amount,
  showIcon = true,
  size = 'md',
}) => {
  return (
    <motion.div
      className="coin-display"
      key={amount}
      initial={{ scale: 1 }}
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 0.3 }}
    >
      {showIcon && (
        <Coins
          size={sizeStyles[size].icon}
          className="text-pixel-accent"
        />
      )}
      <span className={`font-pixel ${sizeStyles[size].text}`}>
        {amount.toLocaleString()}
      </span>
    </motion.div>
  );
};
