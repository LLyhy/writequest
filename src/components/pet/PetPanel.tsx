import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Zap, Star, PlayCircle, Coffee, ChevronRight, ChevronLeft } from 'lucide-react';
import { usePetStore, type Pet } from '../../stores';
import { PetAvatar } from './PetAvatar';
import { PixelButton } from '../ui/PixelButton';
import { PixelPanel as _PixelPanel } from '../ui/PixelPanel';

interface PetPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const getHappinessColor = (happiness: number): string => {
  if (happiness >= 80) return 'text-green-400';
  if (happiness >= 50) return 'text-yellow-400';
  return 'text-red-400';
};

const getHappinessText = (happiness: number): string => {
  if (happiness >= 80) return '非常开心';
  if (happiness >= 50) return '还不错';
  return '需要关心';
};

const PetCard: React.FC<{
  pet: Pet;
  isActive: boolean;
  onSelect: () => void;
}> = ({ pet, isActive, onSelect }) => {
  const { equipPet, interactWithPet, renamePet } = usePetStore();
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(pet.name);

  if (!pet.unlocked) {
    return (
      <div className="bg-pixel-panel border-2 border-pixel-border rounded-lg p-4 opacity-50">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center text-2xl">
            ?
          </div>
          <div>
            <div className="text-gray-500 font-mono">未解锁</div>
            <div className="text-xs text-gray-600 font-mono mt-1">
              {pet.type === 'cat' && '达到 5 级解锁'}
              {pet.type === 'owl' && '达到 10 级解锁'}
              {pet.type === 'fox' && '达到 15 级解锁'}
              {pet.type === 'wolf' && '连续写作 7 天解锁'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onClick={onSelect}
      className={`bg-pixel-panel border-2 rounded-lg p-4 cursor-pointer transition-all ${
        isActive ? 'border-pixel-primary' : 'border-pixel-border hover:border-pixel-secondary'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-4">
          <PetAvatar type={pet.type} size="md" />
          <div>
            {isRenaming ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (newName.trim()) {
                    renamePet(pet.id, newName.trim());
                  }
                  setIsRenaming(false);
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="bg-pixel-bg border-2 border-pixel-border px-2 py-1 text-white font-mono focus:outline-none focus:border-pixel-primary rounded w-32"
                  autoFocus
                />
              </form>
            ) : (
              <div className="font-pixel text-white flex items-center gap-2">
                {pet.name}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsRenaming(true);
                  }}
                  className="text-gray-500 hover:text-white"
                >
                  ✏️
                </button>
              </div>
            )}
            <div className="text-xs text-pixel-primary font-mono mt-1">
              Lv.{pet.level}
            </div>
          </div>
        </div>
        {isActive && (
          <div className="bg-pixel-primary text-white px-2 py-1 rounded text-xs font-mono">
            出战中
          </div>
        )}
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-400 font-mono">经验</span>
          <span className="text-xs text-gray-400 font-mono">
            {pet.exp}/{pet.expToNextLevel}
          </span>
        </div>
        <div className="h-2 bg-pixel-border rounded overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(pet.exp / pet.expToNextLevel) * 100}%` }}
            className="h-full bg-pixel-primary"
          />
        </div>
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1">
            <Heart size={12} className={getHappinessColor(pet.happiness)} />
            <span className="text-xs text-gray-400 font-mono">心情</span>
          </div>
          <span className={`text-xs font-mono ${getHappinessColor(pet.happiness)}`}>
            {getHappinessText(pet.happiness)} {pet.happiness}%
          </span>
        </div>
        <div className="h-2 bg-pixel-border rounded overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pet.happiness}%` }}
            className="h-full"
            style={{
              backgroundColor: pet.happiness >= 80 ? '#22c55e' :
                              pet.happiness >= 50 ? '#eab308' : '#ef4444',
            }}
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-xs text-gray-500 font-mono">技能</div>
        {pet.skills.map(skill => (
          <div key={skill.id} className="bg-pixel-bg border border-pixel-border p-2 rounded">
            <div className="font-mono text-pixel-accent text-xs flex items-center gap-1">
              <Star size={10} /> {skill.name}
            </div>
            <div className="text-gray-400 text-xs font-mono mt-1">
              {skill.description}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-4">
        <PixelButton
          variant="secondary"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            interactWithPet(pet.id, 'play');
          }}
          className="flex-1"
        >
          <PlayCircle size={14} className="mr-1" /> 玩耍
        </PixelButton>
        <PixelButton
          variant="secondary"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            interactWithPet(pet.id, 'feed');
          }}
          className="flex-1"
        >
          <Coffee size={14} className="mr-1" /> 喂食
        </PixelButton>
        {!isActive && (
          <PixelButton
            variant="primary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              equipPet(pet.id);
            }}
            className="flex-1"
          >
            装备
          </PixelButton>
        )}
      </div>
    </motion.div>
  );
};

export const PetPanel: React.FC<PetPanelProps> = ({ isOpen, onClose }) => {
  const { pets, getEquippedPet } = usePetStore();
  const equippedPet = getEquippedPet();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="relative w-full max-w-2xl"
          >
            <_PixelPanel className="max-h-[80vh] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-pixel-border">
                <div>
                  <h2 className="font-pixel text-white text-xl flex items-center gap-2">
                    <Zap size={20} className="text-pixel-accent" />
                    我的伙伴
                  </h2>
                  <p className="text-xs text-gray-500 font-mono mt-1">
                    宠物陪伴你写作，提供强大加成！
                  </p>
                </div>
                <PixelButton variant="secondary" size="sm" onClick={onClose}>
                  <X size={18} />
                </PixelButton>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="grid gap-4">
                  {pets.map(pet => (
                    <PetCard
                      key={pet.id}
                      pet={pet}
                      isActive={pet.equipped}
                      onSelect={() => {}}
                    />
                  ))}
                </div>
              </div>

              {equippedPet && (
                <div className="mt-4 pt-4 border-t-2 border-pixel-border">
                  <div className="text-xs text-gray-500 font-mono mb-2">
                    当前加成
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="bg-pixel-bg border border-pixel-border p-2 rounded">
                      <div className="text-pixel-primary">经验加成</div>
                    </div>
                    <div className="bg-pixel-bg border border-pixel-border p-2 rounded">
                      <div className="text-pixel-accent">金币加成</div>
                    </div>
                  </div>
                </div>
              )}
            </_PixelPanel>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
