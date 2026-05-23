import React from 'react';
import { motion } from 'framer-motion';
import { PixelPanel } from '../ui';
import { useHeroStore } from '../../stores';
import { ALL_EQUIPMENT } from '../../constants/game';
import type { EquipmentSlot, EquipmentRarity } from '../../types';

const RARITY_COLORS: Record<EquipmentRarity, string> = {
  common: 'text-gray-400',
  uncommon: 'text-green-400',
  rare: 'text-blue-400',
  epic: 'text-purple-400',
  legendary: 'text-yellow-400',
  mythical: 'text-pink-500',
};

const RARITY_BG_COLORS: Record<EquipmentRarity, string> = {
  common: 'bg-gray-800',
  uncommon: 'bg-green-900',
  rare: 'bg-blue-900',
  epic: 'bg-purple-900',
  legendary: 'bg-yellow-900',
  mythical: 'bg-pink-900',
};

const SLOT_ICONS: Record<EquipmentSlot, string> = {
  helmet: '🎩',
  armor: '👕',
  leggings: '👖',
  weapon: '⚔️',
  ring: '💍',
};

const SLOT_NAMES: Record<EquipmentSlot, string> = {
  helmet: '头盔',
  armor: '盔甲',
  leggings: '腿甲',
  weapon: '武器',
  ring: '戒指',
};

export const EquipmentPanel: React.FC = () => {
  const { equipment, equipEquipment, getEquippedEquipment, getTotalStats } = useHeroStore();
  const equipped = getEquippedEquipment();
  const totalStats = getTotalStats();

  const getSlotEquipment = (slot: EquipmentSlot) => {
    return ALL_EQUIPMENT.filter(e => e.slot === slot);
  };

  const handleEquip = (slot: EquipmentSlot, equipmentId: string | null) => {
    equipEquipment(slot, equipmentId);
  };

  return (
    <div className="space-y-4">
      {/* 装备总览 */}
      <PixelPanel title="装备总览" titleIcon="⚔️">
        <div className="grid grid-cols-5 gap-4">
          {Object.entries(SLOT_ICONS).map(([slot, icon]) => {
            const slotKey = slot as EquipmentSlot;
            const equippedItem = equipped[slotKey];
            
            return (
              <div key={slot} className="flex flex-col items-center">
                <div 
                  className={`w-16 h-16 rounded-lg flex items-center justify-center text-2xl border-2 ${
                    equippedItem 
                      ? `${RARITY_BG_COLORS[equippedItem.rarity]} border-pixel-accent` 
                      : 'bg-pixel-panel border-pixel-border'
                  }`}
                >
                  {equippedItem ? equippedItem.icon : icon}
                </div>
                <span className="text-xs text-gray-400 mt-1">{SLOT_NAMES[slotKey]}</span>
              </div>
            );
          })}
        </div>
        
        {/* 总属性 */}
        <div className="mt-4 grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-lg text-red-400">⚔️ {totalStats.attack}</div>
            <div className="text-xs text-gray-400">攻击</div>
          </div>
          <div className="text-center">
            <div className="text-lg text-blue-400">🛡️ {totalStats.defense}</div>
            <div className="text-xs text-gray-400">防御</div>
          </div>
          <div className="text-center">
            <div className="text-lg text-green-400">💨 {totalStats.speed}</div>
            <div className="text-xs text-gray-400">速度</div>
          </div>
          <div className="text-center">
            <div className="text-lg text-yellow-400">🍀 {totalStats.luck}</div>
            <div className="text-xs text-gray-400">幸运</div>
          </div>
        </div>
      </PixelPanel>

      {/* 装备库 */}
      <PixelPanel title="装备库" titleIcon="📦">
        <div className="space-y-4">
          {Object.entries(SLOT_ICONS).map(([slot, icon]) => {
            const slotKey = slot as EquipmentSlot;
            const slotEquipment = getSlotEquipment(slotKey);
            
            return (
              <div key={slot} className="space-y-2">
                <h3 className="font-pixel text-white flex items-center gap-2">
                  {icon} {SLOT_NAMES[slotKey]}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {slotEquipment.map((item) => {
                    const isOwned = equipment.inventory.some(e => e.id === item.id);
                    const isEquipped = equipped[slotKey]?.id === item.id;
                    
                    return (
                      <motion.div
                        key={item.id}
                        whileHover={{ scale: 1.02 }}
                        className={`p-3 rounded-lg border-2 text-left cursor-pointer ${
                          isEquipped 
                            ? 'border-pixel-accent bg-pixel-accent/20' 
                            : isOwned 
                              ? 'border-pixel-secondary bg-pixel-secondary/20'
                              : 'border-pixel-border bg-pixel-panel/50 opacity-50'
                        }`}
                        onClick={() => isOwned && handleEquip(slotKey, isEquipped ? null : item.id)}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{item.icon}</span>
                          <div>
                            <div className={`font-pixel text-sm ${RARITY_COLORS[item.rarity]}`}>
                              {item.name}
                            </div>
                            <div className="text-xs text-gray-400">
                              {isEquipped ? '已装备' : isOwned ? '已获得' : '未获得'}
                            </div>
                          </div>
                        </div>
                        
                        {isOwned && (
                          <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
                            <div className="text-red-400">攻: {item.stats.attack}</div>
                            <div className="text-blue-400">防: {item.stats.defense}</div>
                            <div className="text-green-400">速: {item.stats.speed}</div>
                            <div className="text-yellow-400">运: {item.stats.luck}</div>
                          </div>
                        )}
                        
                        {item.specialEffect && isOwned && (
                          <div className="mt-2 text-xs text-purple-400 italic">
                            ✨ {item.specialEffect}
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </PixelPanel>
    </div>
  );
};
