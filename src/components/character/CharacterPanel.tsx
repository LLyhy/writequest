import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EquipmentPanel } from './EquipmentPanel';
import { LootBoxPanel } from './LootBoxPanel';

type CharacterTab = 'equipment' | 'lootbox';

const TAB_CONFIGS = [
  { id: 'equipment' as CharacterTab, name: '装备', icon: '⚔️' },
  { id: 'lootbox' as CharacterTab, name: '抽奖', icon: '🎰' },
];

export const CharacterPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CharacterTab>('equipment');

  const renderContent = () => {
    switch (activeTab) {
      case 'equipment':
        return <EquipmentPanel />;
      case 'lootbox':
        return <LootBoxPanel />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* 标签页 */}
      <div className="flex gap-2">
        {TAB_CONFIGS.map((tab) => (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg border-2 font-pixel transition-all ${
              activeTab === tab.id
                ? 'border-pixel-accent bg-pixel-accent/20 text-pixel-accent'
                : 'border-pixel-border bg-pixel-panel text-gray-400 hover:border-pixel-secondary hover:text-white'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.name}
          </motion.button>
        ))}
      </div>

      {/* 内容区域 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
