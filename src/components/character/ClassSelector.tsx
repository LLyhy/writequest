import React from 'react';
import { motion } from 'framer-motion';
import type { CharacterClass } from '../../types';
import { CLASS_CONFIGS } from '../../constants/game';
import { PixelPanel } from '../ui/PixelPanel';

interface ClassSelectorProps {
  selectedClass: CharacterClass | null;
  onSelect: (characterClass: CharacterClass) => void;
}

export const ClassSelector: React.FC<ClassSelectorProps> = ({
  selectedClass,
  onSelect,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {CLASS_CONFIGS.map((config, index) => {
        const isSelected = selectedClass === config.id;

        return (
          <motion.div
            key={config.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(config.id)}
            className="cursor-pointer"
          >
            <PixelPanel
              variant={isSelected ? 'default' : 'inset'}
              className={`
                h-full transition-all duration-200
                ${isSelected ? 'border-pixel-primary shadow-[0_0_15px_rgba(74,222,128,0.3)]' : ''}
              `}
              animate={false}
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">{config.icon}</div>
                <div className="flex-1">
                  <h3 className="font-pixel text-sm text-white mb-2">{config.name}</h3>
                  <p className="text-xs text-gray-400 font-mono mb-3">
                    {config.description}
                  </p>

                  {/* 属性加成 */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500 font-mono">经验加成</span>
                      <span className="font-pixel text-pixel-primary">
                        x{config.bonus.expMultiplier}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500 font-mono">字数加成</span>
                      <span className="font-pixel text-pixel-secondary">
                        x{config.bonus.wordCountBonus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 选中标记 */}
              {isSelected && (
                <motion.div
                  className="absolute top-2 right-2 w-3 h-3 bg-pixel-primary rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </PixelPanel>
          </motion.div>
        );
      })}
    </div>
  );
};
