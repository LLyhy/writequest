import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMapStore, useCharacterStore, useStoryStore } from '../../stores';
import { PixelPanel } from '../ui/PixelPanel';
import { PixelButton } from '../ui/PixelButton';
import { MapRegion } from '../../types';
import { Lock, Check, Star, X, ChevronRight } from 'lucide-react';

interface WorldMapProps {
  onClose: () => void;
}

export const WorldMap: React.FC<WorldMapProps> = ({ onClose }) => {
  const [selectedRegion, setSelectedRegion] = useState<MapRegion | null>(null);
  
  const { regions, unlockRegion, exploreRegion, canUnlockRegion, getExplorationProgress } = useMapStore();
  const { character } = useCharacterStore();
  const { currentChapter } = useStoryStore();
  
  const explorationProgress = getExplorationProgress();
  const characterLevel = character?.level || 1;
  
  const handleRegionClick = (region: MapRegion) => {
    setSelectedRegion(region);
  };
  
  const handleUnlockRegion = (regionId: string) => {
    if (canUnlockRegion(regionId, characterLevel, currentChapter)) {
      unlockRegion(regionId);
    }
  };
  
  const handleExplore = (regionId: string) => {
    exploreRegion(regionId, 10);
  };
  
  const getRegionColor = (region: MapRegion) => {
    if (!region.unlocked) return 'bg-gray-600';
    if (region.explored) return 'bg-pixel-primary';
    return 'bg-pixel-secondary';
  };
  
  const getRegionBorderColor = (region: MapRegion) => {
    if (!region.unlocked) return 'border-gray-500';
    if (region.explored) return 'border-green-400';
    return 'border-blue-400';
  };

  return (
    <PixelPanel className="relative" title="世界地图" titleIcon="🗺️">
      {/* 关闭按钮 */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors z-10"
      >
        <X size={24} />
      </button>
      
      {/* 探索进度 */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-mono text-gray-400">总探索进度</span>
          <span className="text-sm font-pixel text-pixel-primary">{explorationProgress}%</span>
        </div>
        <div className="h-3 bg-pixel-border rounded-full overflow-hidden border-2 border-pixel-border">
          <motion.div
            className="h-full bg-gradient-to-r from-pixel-primary to-green-400"
            initial={{ width: 0 }}
            animate={{ width: `${explorationProgress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
      
      {/* 地图区域 */}
      <div className="relative h-96 bg-pixel-bg/50 rounded border-2 border-pixel-border overflow-hidden">
        {/* 连接线 */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {regions.map((region) => 
            region.connections.map((connId) => {
              const connRegion = regions.find(r => r.id === connId);
              if (!connRegion || region.id > connId) return null;
              
              return (
                <line
                  key={`${region.id}-${connId}`}
                  x1={`${region.position.x}%`}
                  y1={`${region.position.y}%`}
                  x2={`${connRegion.position.x}%`}
                  y2={`${connRegion.position.y}%`}
                  stroke={region.unlocked && connRegion.unlocked ? '#4ade80' : '#374151'}
                  strokeWidth="2"
                  strokeDasharray={region.unlocked && connRegion.unlocked ? "0" : "5,5"}
                />
              );
            })
          )}
        </svg>
        
        {/* 区域节点 */}
        {regions.map((region) => (
          <motion.button
            key={region.id}
            className={`absolute w-12 h-12 -ml-6 -mt-6 rounded-full border-2 ${getRegionBorderColor(region)} ${getRegionColor(region)} flex items-center justify-center text-2xl shadow-pixel-sm hover:scale-110 transition-transform`}
            style={{
              left: `${region.position.x}%`,
              top: `${region.position.y}%`,
            }}
            onClick={() => handleRegionClick(region)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {region.unlocked ? (
              region.explored ? (
                <Check size={20} className="text-white" />
              ) : (
                <span>{region.icon}</span>
              )
            ) : (
              <Lock size={16} className="text-gray-400" />
            )}
          </motion.button>
        ))}
        
        {/* 区域标签 */}
        {regions.map((region) => (
          <div
            key={`label-${region.id}`}
            className="absolute text-xs font-mono text-gray-400 -ml-8 mt-6"
            style={{
              left: `${region.position.x}%`,
              top: `${region.position.y}%`,
            }}
          >
            {region.unlocked ? region.name : '???'}
          </div>
        ))}
      </div>
      
      {/* 区域详情面板 */}
      <AnimatePresence>
        {selectedRegion && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-4"
          >
            <PixelPanel variant="inset" className="p-4">
              <div className="flex items-start gap-4">
                <div className={`w-16 h-16 rounded-lg ${selectedRegion.unlocked ? 'bg-pixel-panel' : 'bg-gray-700'} flex items-center justify-center text-3xl border-2 border-pixel-border`}>
                  {selectedRegion.unlocked ? selectedRegion.icon : '🔒'}
                </div>
                <div className="flex-1">
                  <h3 className="font-pixel text-lg text-white mb-1">
                    {selectedRegion.unlocked ? selectedRegion.name : '未解锁区域'}
                  </h3>
                  <p className="text-sm text-gray-400 font-mono mb-2">
                    {selectedRegion.unlocked ? selectedRegion.description : '完成前置章节和等级要求以解锁此区域'}
                  </p>
                  
                  {selectedRegion.unlocked && (
                    <>
                      <div className="flex items-center gap-4 text-xs font-mono text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <Star size={12} className="text-pixel-accent" />
                          探索度: {selectedRegion.explorationProgress}%
                        </span>
                        {selectedRegion.explored && (
                          <span className="text-pixel-primary">已完全探索</span>
                        )}
                      </div>
                      
                      {/* 区域挑战 */}
                      <div className="space-y-2 mb-3">
                        <h4 className="text-xs font-pixel text-gray-400">区域挑战</h4>
                        {selectedRegion.challenges.map((challenge) => (
                          <div
                            key={challenge.id}
                            className={`flex items-center justify-between p-2 rounded border ${
                              challenge.completed 
                                ? 'bg-pixel-primary/20 border-pixel-primary' 
                                : 'bg-pixel-bg border-pixel-border'
                            }`}
                          >
                            <div>
                              <span className="text-sm font-mono text-white">{challenge.name}</span>
                              <p className="text-xs text-gray-500">{challenge.description}</p>
                            </div>
                            {challenge.completed ? (
                              <Check size={16} className="text-pixel-primary" />
                            ) : (
                              <ChevronRight size={16} className="text-gray-500" />
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {/* 探索按钮 */}
                      {!selectedRegion.explored && (
                        <PixelButton
                          variant="primary"
                          size="sm"
                          onClick={() => handleExplore(selectedRegion.id)}
                          className="w-full"
                        >
                          探索区域
                        </PixelButton>
                      )}
                    </>
                  )}
                  
                  {!selectedRegion.unlocked && (
                    <div className="space-y-2">
                      <div className="text-xs font-mono text-gray-500">
                        <span className="text-pixel-danger">解锁条件:</span>
                      </div>
                      <ul className="text-xs font-mono text-gray-400 space-y-1">
                        <li className={characterLevel >= selectedRegion.requiredLevel ? 'text-pixel-primary' : ''}>
                          • 等级 {selectedRegion.requiredLevel} {characterLevel >= selectedRegion.requiredLevel ? '✓' : ''}
                        </li>
                        {selectedRegion.requiredChapter && (
                          <li className={currentChapter >= selectedRegion.requiredChapter ? 'text-pixel-primary' : ''}>
                            • 完成第{selectedRegion.requiredChapter}章 {currentChapter >= selectedRegion.requiredChapter ? '✓' : ''}
                          </li>
                        )}
                      </ul>
                      
                      {canUnlockRegion(selectedRegion.id, characterLevel, currentChapter) && (
                        <PixelButton
                          variant="accent"
                          size="sm"
                          onClick={() => handleUnlockRegion(selectedRegion.id)}
                          className="w-full mt-3"
                        >
                          解锁区域
                        </PixelButton>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </PixelPanel>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 提示 */}
      <div className="mt-4 flex items-center gap-4 text-xs font-mono text-gray-500">
        <span className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-pixel-primary" />
          已探索
        </span>
        <span className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-pixel-secondary" />
          已解锁
        </span>
        <span className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-gray-600" />
          未解锁
        </span>
      </div>
    </PixelPanel>
  );
};
