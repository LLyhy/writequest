import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PixelPanel, PixelButton } from '../ui';
import { useHeroStore, useGameStore, useCharacterStore } from '../../stores';
import { LOOT_BOX_PRIZES } from '../../constants/game';
import type { EquipmentRarity, LootBoxPrize } from '../../types';

const RARITY_COLORS: Record<EquipmentRarity, string> = {
  common: 'text-gray-400',
  uncommon: 'text-green-400',
  rare: 'text-blue-400',
  epic: 'text-purple-400',
  legendary: 'text-yellow-400',
  mythical: 'text-pink-500',
};

const RARITY_GLOW_COLORS: Record<EquipmentRarity, string> = {
  common: 'shadow-gray-500',
  uncommon: 'shadow-green-500',
  rare: 'shadow-blue-500',
  epic: 'shadow-purple-500',
  legendary: 'shadow-yellow-500',
  mythical: 'shadow-pink-500',
};

export const LootBoxPanel: React.FC = () => {
  const { lootBox, draw, addDrawHistory, unlockEquipment } = useHeroStore();
  const { addCoins } = useGameStore();
  const { addExp } = useCharacterStore();
  const [isDrawing, setIsDrawing] = useState(false);
  const [showPrize, setShowPrize] = useState<LootBoxPrize | null>(null);

  const handleDraw = () => {
    if (lootBox.drawsRemaining <= 0) return;
    
    setIsDrawing(true);
    
    setTimeout(() => {
      const prize = draw();
      if (prize) {
        handlePrize(prize);
        setShowPrize(prize);
      }
      setIsDrawing(false);
    }, 1500);
  };

  const handlePrize = (prize: LootBoxPrize) => {
    addDrawHistory(prize);
    
    if (prize.type === 'equipment') {
      unlockEquipment(prize.value as string);
    } else if (prize.type === 'coins') {
      addCoins(prize.value as number);
    } else if (prize.type === 'exp') {
      addExp(prize.value as number);
    }
  };

  const closePrizeModal = () => {
    setShowPrize(null);
  };

  return (
    <div className="space-y-4">
      {/* 抽奖区域 */}
      <PixelPanel title="抽奖" titleIcon="🎰">
        <div className="text-center py-8">
          <div className="mb-6">
            <motion.div
              animate={isDrawing ? { rotate: 360 } : {}}
              transition={{ duration: 1, repeat: isDrawing ? Infinity : 0, ease: 'linear' }}
              className="text-8xl mb-4"
            >
              🎁
            </motion.div>
            <h3 className="font-pixel text-2xl text-white mb-2">神秘宝箱</h3>
            <p className="text-gray-400">
              剩余抽奖次数: <span className="text-pixel-accent font-bold">{lootBox.drawsRemaining}</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              总抽奖次数: {lootBox.totalDraws}
            </p>
          </div>
          
          <PixelButton
            variant="primary"
            size="lg"
            onClick={handleDraw}
            disabled={isDrawing || lootBox.drawsRemaining <= 0}
            className="w-full max-w-xs"
          >
            {isDrawing ? '抽奖中...' : '开始抽奖'}
          </PixelButton>
        </div>
      </PixelPanel>

      {/* 奖品展示 */}
      <PixelPanel title="奖品预览" titleIcon="🎁">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {LOOT_BOX_PRIZES.slice(0, 12).map((prize) => (
            <div
              key={prize.id}
              className={`p-3 rounded-lg border text-center ${RARITY_COLORS[prize.rarity]}`}
            >
              <div className="text-3xl mb-2">{prize.icon}</div>
              <div className="font-pixel text-sm">{prize.name}</div>
              <div className="text-xs text-gray-500">{(prize.dropRate * 100).toFixed(1)}%</div>
            </div>
          ))}
        </div>
      </PixelPanel>

      {/* 抽奖历史 */}
      <PixelPanel title="抽奖历史" titleIcon="📜">
        {lootBox.history.length === 0 ? (
          <p className="text-gray-400 text-center py-4">还没有抽奖记录</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {lootBox.history.map((item) => (
              <div
                key={item.id}
                className={`p-3 rounded-lg border flex items-center gap-3 ${RARITY_COLORS[item.prize.rarity]}`}
              >
                <span className="text-2xl">{item.prize.icon}</span>
                <div className="flex-1">
                  <div className="font-pixel text-sm">{item.prize.name}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(item.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </PixelPanel>

      {/* 奖品弹窗 */}
      <AnimatePresence>
        {showPrize && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="bg-pixel-panel border-2 border-pixel-accent rounded-lg p-8 max-w-md w-full mx-4 text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className={`text-8xl mb-4 ${RARITY_GLOW_COLORS[showPrize.rarity]} drop-shadow-lg`}
              >
                {showPrize.icon}
              </motion.div>
              <h3 className={`font-pixel text-2xl mb-2 ${RARITY_COLORS[showPrize.rarity]}`}>
                恭喜获得！
              </h3>
              <div className="text-white text-xl mb-2">{showPrize.name}</div>
              <div className="text-gray-400 mb-6">{showPrize.description}</div>
              <PixelButton
                variant="primary"
                size="md"
                onClick={closePrizeModal}
              >
                太棒了！
              </PixelButton>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
