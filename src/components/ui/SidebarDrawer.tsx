import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { PixelButton } from './PixelButton';

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function SidebarDrawer({ isOpen, onClose, title, children }: SidebarDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />
          
          {/* 抽屉 */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-80 bg-pixel-panel border-r-2 border-pixel-border z-50 overflow-y-auto"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                {title && <h3 className="font-pixel text-white">{title}</h3>}
                <PixelButton variant="secondary" size="sm" onClick={onClose}>
                  <X size={16} />
                </PixelButton>
              </div>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
