import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCollectionStore } from '../../stores';
import { PixelPanel } from '../ui/PixelPanel';
import { PixelButton } from '../ui/PixelButton';
import { ThemeSkin, FontEffect, Badge, InspirationFragment, WritingMaterial } from '../../types';
import { Palette, Type, Award, Lightbulb, BookOpen, Check, X } from 'lucide-react';

interface CollectionPanelProps {
  onClose: () => void;
}

type TabType = 'skins' | 'fonts' | 'badges' | 'fragments' | 'materials';

export const CollectionPanel: React.FC<CollectionPanelProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('skins');
  const [selectedItem, setSelectedItem] = useState<ThemeSkin | FontEffect | Badge | InspirationFragment | WritingMaterial | null>(null);
  
  const { 
    skins,
    fonts,
    badges,
    fragments,
    materials,
    unlockedSkins,
    unlockedFonts,
    unlockedBadges,
    collectedFragments,
    currentSkin,
    currentFont,
    equipSkin,
    equipFont,
    getCollectionProgress,
  } = useCollectionStore();
  
  const progress = getCollectionProgress();
  
  const handleEquipSkin = (skinId: string) => {
    equipSkin(skinId);
    setSelectedItem(null);
  };
  
  const handleEquipFont = (fontId: string) => {
    equipFont(fontId);
    setSelectedItem(null);
  };
  
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400';
      case 'rare': return 'text-blue-400';
      case 'epic': return 'text-purple-400';
      case 'legendary': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'writing': return '✍️';
      case 'combat': return '⚔️';
      case 'collection': return '💎';
      case 'special': return '⭐';
      default: return '🏆';
    }
  };
  
  const getFragmentCategoryIcon = (category: string) => {
    switch (category) {
      case 'plot': return '📖';
      case 'character': return '👤';
      case 'setting': return '🏞️';
      case 'dialogue': return '💬';
      default: return '💡';
    }
  };

  return (
    <PixelPanel className="relative" title="收集" titleIcon="🎒">
      {/* 关闭按钮 */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors z-10"
      >
        <X size={24} />
      </button>
      
      {/* 收集进度 */}
      <div className="mb-4 p-3 bg-pixel-bg/50 rounded border-2 border-pixel-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-pixel text-pixel-accent">收集进度</span>
          <span className="text-lg font-pixel text-white">{progress.totalProgress}%</span>
        </div>
        <div className="h-3 bg-pixel-border rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-pixel-primary via-pixel-secondary to-pixel-accent"
            initial={{ width: 0 }}
            animate={{ width: `${progress.totalProgress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="grid grid-cols-4 gap-2 mt-3 text-center">
          <div>
            <span className="text-xs text-gray-500 font-mono">皮肤</span>
            <p className="text-sm font-pixel text-blue-400">{progress.skinsProgress}%</p>
          </div>
          <div>
            <span className="text-xs text-gray-500 font-mono">字体</span>
            <p className="text-sm font-pixel text-purple-400">{progress.fontsProgress}%</p>
          </div>
          <div>
            <span className="text-xs text-gray-500 font-mono">徽章</span>
            <p className="text-sm font-pixel text-yellow-400">{progress.badgesProgress}%</p>
          </div>
          <div>
            <span className="text-xs text-gray-500 font-mono">碎片</span>
            <p className="text-sm font-pixel text-green-400">{progress.fragmentsProgress}%</p>
          </div>
        </div>
      </div>
      
      {/* 标签页 */}
      <div className="flex gap-1 mb-4 flex-wrap">
        {[
          { id: 'skins', icon: Palette, label: '皮肤' },
          { id: 'fonts', icon: Type, label: '字体' },
          { id: 'badges', icon: Award, label: '徽章' },
          { id: 'fragments', icon: Lightbulb, label: '灵感' },
          { id: 'materials', icon: BookOpen, label: '素材' },
        ].map((tab) => (
          <PixelButton
            key={tab.id}
            variant={activeTab === tab.id ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setActiveTab(tab.id as TabType)}
            className="flex-1 min-w-[60px]"
          >
            <span className="flex items-center justify-center gap-1">
              <tab.icon size={14} />
              <span className="hidden sm:inline">{tab.label}</span>
            </span>
          </PixelButton>
        ))}
      </div>
      
      {/* 内容区域 */}
      <div className="max-h-80 overflow-y-auto">
        {/* 皮肤 */}
        {activeTab === 'skins' && (
          <div className="grid grid-cols-2 gap-3">
            {skins.map((skin) => {
              const isUnlocked = unlockedSkins.includes(skin.id);
              const isEquipped = currentSkin === skin.id;
              
              return (
                <motion.button
                  key={skin.id}
                  onClick={() => setSelectedItem(skin)}
                  className={`p-3 rounded border-2 text-left transition-all ${
                    isEquipped 
                      ? 'bg-pixel-accent/20 border-pixel-accent' 
                      : isUnlocked
                      ? 'bg-pixel-panel border-pixel-border hover:border-pixel-secondary'
                      : 'bg-gray-800/50 border-gray-700 opacity-60'
                  }`}
                  whileHover={isUnlocked ? { scale: 1.02 } : {}}
                  whileTap={isUnlocked ? { scale: 0.98 } : {}}
                >
                  <div className={`aspect-video rounded mb-2 ${skin.preview} flex items-center justify-center text-2xl border border-pixel-border`}>
                    {skin.icon}
                  </div>
                  <h4 className="font-pixel text-sm text-white">{skin.name}</h4>
                  <p className={`text-xs ${getRarityColor(skin.rarity)}`}>
                    {skin.rarity === 'common' && '普通'}
                    {skin.rarity === 'rare' && '稀有'}
                    {skin.rarity === 'epic' && '史诗'}
                    {skin.rarity === 'legendary' && '传说'}
                  </p>
                  {isEquipped && (
                    <span className="text-xs text-pixel-accent font-mono">已装备</span>
                  )}
                </motion.button>
              );
            })}
          </div>
        )}
        
        {/* 字体特效 */}
        {activeTab === 'fonts' && (
          <div className="grid grid-cols-2 gap-3">
            {fonts.map((font) => {
              const isUnlocked = unlockedFonts.includes(font.id);
              const isEquipped = currentFont === font.id;
              
              return (
                <motion.button
                  key={font.id}
                  onClick={() => setSelectedItem(font)}
                  className={`p-3 rounded border-2 text-left transition-all ${
                    isEquipped 
                      ? 'bg-pixel-accent/20 border-pixel-accent' 
                      : isUnlocked
                      ? 'bg-pixel-panel border-pixel-border hover:border-pixel-secondary'
                      : 'bg-gray-800/50 border-gray-700 opacity-60'
                  }`}
                  whileHover={isUnlocked ? { scale: 1.02 } : {}}
                  whileTap={isUnlocked ? { scale: 0.98 } : {}}
                >
                  <div className="aspect-video bg-pixel-bg rounded mb-2 flex items-center justify-center border border-pixel-border">
                    <span className={`text-2xl ${font.preview}`}>
                      {font.icon}
                    </span>
                  </div>
                  <h4 className="font-pixel text-sm text-white">{font.name}</h4>
                  <p className={`text-xs ${getRarityColor(font.rarity)}`}>
                    {font.rarity === 'common' && '普通'}
                    {font.rarity === 'rare' && '稀有'}
                    {font.rarity === 'epic' && '史诗'}
                    {font.rarity === 'legendary' && '传说'}
                  </p>
                  {isEquipped && (
                    <span className="text-xs text-pixel-accent font-mono">已装备</span>
                  )}
                </motion.button>
              );
            })}
          </div>
        )}
        
        {/* 徽章 */}
        {activeTab === 'badges' && (
          <div className="space-y-2">
            {badges.map((badge) => {
              const isUnlocked = unlockedBadges.includes(badge.id);
              
              return (
                <motion.button
                  key={badge.id}
                  onClick={() => setSelectedItem(badge)}
                  className={`w-full p-3 rounded border-2 text-left transition-all ${
                    isUnlocked 
                      ? 'bg-pixel-primary/20 border-pixel-primary' 
                      : 'bg-gray-800/50 border-gray-700 opacity-60'
                  }`}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${
                      isUnlocked ? 'bg-pixel-primary' : 'bg-gray-700'
                    }`}>
                      {badge.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-pixel text-sm text-white">{badge.name}</h4>
                      <p className="text-xs text-gray-500 font-mono">{badge.description}</p>
                      <span className="text-xs text-gray-600 font-mono">
                        {getCategoryIcon(badge.category)} {badge.category}
                      </span>
                    </div>
                    {isUnlocked && <Check size={20} className="text-pixel-primary" />}
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
        
        {/* 灵感碎片 */}
        {activeTab === 'fragments' && (
          <div className="space-y-2">
            {fragments.map((fragment) => {
              const isCollected = collectedFragments.includes(fragment.id);
              
              return (
                <motion.button
                  key={fragment.id}
                  onClick={() => setSelectedItem(fragment)}
                  className={`w-full p-3 rounded border-2 text-left transition-all ${
                    isCollected 
                      ? 'bg-pixel-secondary/20 border-pixel-secondary' 
                      : 'bg-gray-800/50 border-gray-700 opacity-60'
                  }`}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${
                      isCollected ? 'bg-pixel-secondary' : 'bg-gray-700'
                    }`}>
                      {fragment.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-pixel text-sm text-white">{fragment.name}</h4>
                      <p className="text-xs text-gray-500 font-mono">{fragment.description}</p>
                      <span className="text-xs text-gray-600 font-mono">
                        {getFragmentCategoryIcon(fragment.category)} {fragment.category}
                      </span>
                    </div>
                    {isCollected && <Check size={20} className="text-pixel-secondary" />}
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
        
        {/* 写作素材 */}
        {activeTab === 'materials' && (
          <div className="space-y-2">
            {materials.map((material) => (
              <motion.button
                key={material.id}
                onClick={() => setSelectedItem(material)}
                className={`w-full p-3 rounded border-2 text-left transition-all ${
                  material.unlocked 
                    ? 'bg-pixel-accent/20 border-pixel-accent' 
                    : 'bg-gray-800/50 border-gray-700 opacity-60'
                }`}
                whileHover={material.unlocked ? { scale: 1.01 } : {}}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${
                    material.unlocked ? 'bg-pixel-accent' : 'bg-gray-700'
                  }`}>
                    {material.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-pixel text-sm text-white">{material.name}</h4>
                    <p className="text-xs text-gray-500 font-mono">{material.description}</p>
                    {!material.unlocked && (
                      <span className="text-xs text-pixel-danger font-mono">
                        需要 {material.requiredFragments} 个灵感碎片
                      </span>
                    )}
                  </div>
                  {material.unlocked && <Check size={20} className="text-pixel-accent" />}
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>
      
      {/* 详情弹窗 */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <PixelPanel className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-pixel text-xl text-white">
                    {'name' in selectedItem ? selectedItem.name : ''}
                  </h3>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="text-gray-500 hover:text-white"
                  >
                    <X size={24} />
                  </button>
                </div>
                
                {/* 预览 */}
                <div className="aspect-video bg-pixel-bg rounded border-2 border-pixel-border mb-4 flex items-center justify-center">
                  {'icon' in selectedItem && (
                    <span className="text-6xl">{selectedItem.icon}</span>
                  )}
                </div>
                
                {/* 描述 */}
                <p className="text-gray-300 font-mono mb-4">
                  {'description' in selectedItem ? selectedItem.description : ''}
                </p>
                
                {/* 皮肤/字体特有信息 */}
                {activeTab === 'skins' && 'colors' in selectedItem && (
                  <div className="mb-4">
                    <h4 className="text-sm font-pixel text-gray-400 mb-2">主题颜色</h4>
                    <div className="flex gap-2">
                      {Object.entries(selectedItem.colors).slice(0, 4).map(([key, color]) => (
                        <div
                          key={key}
                          className="w-8 h-8 rounded border border-pixel-border"
                          style={{ backgroundColor: color }}
                          title={key}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {activeTab === 'fonts' && 'cssClass' in selectedItem && (
                  <div className="mb-4">
                    <h4 className="text-sm font-pixel text-gray-400 mb-2">预览文字</h4>
                    <p className={`text-xl ${selectedItem.cssClass}`}>
                      这是一段预览文字
                    </p>
                  </div>
                )}
                
                {/* 灵感碎片内容 */}
                {activeTab === 'fragments' && 'content' in selectedItem && (
                  <div className="bg-pixel-bg/50 p-3 rounded border border-pixel-border mb-4">
                    <p className="text-white font-mono italic">
                      "{selectedItem.content}"
                    </p>
                  </div>
                )}
                
                {/* 写作素材内容 */}
                {activeTab === 'materials' && 'content' in selectedItem && (
                  <div className="bg-pixel-bg/50 p-3 rounded border border-pixel-border mb-4 max-h-32 overflow-y-auto">
                    <pre className="text-sm text-white font-mono whitespace-pre-wrap">
                      {selectedItem.content}
                    </pre>
                  </div>
                )}
                
                {/* 装备按钮 */}
                {activeTab === 'skins' && 'id' in selectedItem && unlockedSkins.includes(selectedItem.id) && (
                  <PixelButton
                    variant={currentSkin === selectedItem.id ? 'secondary' : 'primary'}
                    size="lg"
                    onClick={() => handleEquipSkin(selectedItem.id)}
                    disabled={currentSkin === selectedItem.id}
                    className="w-full"
                  >
                    {currentSkin === selectedItem.id ? '已装备' : '装备'}
                  </PixelButton>
                )}
                
                {activeTab === 'fonts' && 'id' in selectedItem && unlockedFonts.includes(selectedItem.id) && (
                  <PixelButton
                    variant={currentFont === selectedItem.id ? 'secondary' : 'primary'}
                    size="lg"
                    onClick={() => handleEquipFont(selectedItem.id)}
                    disabled={currentFont === selectedItem.id}
                    className="w-full"
                  >
                    {currentFont === selectedItem.id ? '已装备' : '装备'}
                  </PixelButton>
                )}
              </PixelPanel>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PixelPanel>
  );
};
