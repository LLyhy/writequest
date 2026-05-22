import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CharacterClass } from '../../types';
import { useCharacterStore } from '../../stores';
import { PixelPanel } from '../ui/PixelPanel';
import { PixelInput } from '../ui/PixelInput';
import { PixelButton } from '../ui/PixelButton';
import { ClassSelector } from './ClassSelector';
import { Sparkles, User, ArrowRight } from 'lucide-react';

interface CharacterCreateProps {
  onComplete?: () => void;
}

export const CharacterCreate: React.FC<CharacterCreateProps> = ({ onComplete }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState('');
  const [selectedClass, setSelectedClass] = useState<CharacterClass | null>(null);
  const [error, setError] = useState('');

  const createCharacter = useCharacterStore((state) => state.createCharacter);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('请输入角色名称');
      return;
    }
    if (name.trim().length < 2) {
      setError('角色名称至少需要2个字符');
      return;
    }
    if (name.trim().length > 12) {
      setError('角色名称不能超过12个字符');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleClassSelect = (characterClass: CharacterClass) => {
    setSelectedClass(characterClass);
  };

  const handleCreate = () => {
    if (!selectedClass) return;
    createCharacter(name.trim(), selectedClass);
    onComplete?.();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-2xl"
      >
        <PixelPanel title="创建你的写作角色" titleIcon={<Sparkles className="text-pixel-accent" />}>
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-center mb-8">
                  <h2 className="font-pixel text-xl text-white mb-2">
                    欢迎来到 WriteQuest
                  </h2>
                  <p className="text-sm text-gray-400 font-mono">
                    开始你的写作冒险之旅
                  </p>
                </div>

                <form onSubmit={handleNameSubmit} className="space-y-6">
                  <PixelInput
                    label="角色名称"
                    placeholder="输入你的笔名..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={error}
                    helperText="2-12个字符，将成为你在游戏中的身份"
                    maxLength={12}
                  />

                  <PixelButton
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                  >
                    <span className="flex items-center justify-center gap-2">
                      下一步
                      <ArrowRight size={18} />
                    </span>
                  </PixelButton>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center gap-2 text-gray-400">
                    <User size={16} />
                    <span className="font-pixel text-xs">{name}</span>
                  </div>
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs text-pixel-secondary hover:underline font-mono"
                  >
                    修改
                  </button>
                </div>

                <p className="text-sm text-gray-400 font-mono mb-4">
                  选择你的写作职业，这将影响你的成长路线：
                </p>

                <ClassSelector
                  selectedClass={selectedClass}
                  onSelect={handleClassSelect}
                />

                <div className="flex gap-3 mt-6">
                  <PixelButton
                    variant="secondary"
                    size="md"
                    onClick={() => setStep(1)}
                    className="flex-1"
                  >
                    返回
                  </PixelButton>
                  <PixelButton
                    variant="primary"
                    size="md"
                    onClick={handleCreate}
                    disabled={!selectedClass}
                    className="flex-1"
                  >
                    开始冒险
                  </PixelButton>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </PixelPanel>
      </motion.div>
    </div>
  );
};
