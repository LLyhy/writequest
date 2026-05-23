import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTutorialStore } from '../../stores';
import { TutorialStep } from './TutorialStep';
import { PixelPanel } from '../ui/PixelPanel';
import { X } from 'lucide-react';

const steps = [
  {
    id: 'welcome',
    title: '欢迎来到 WriteQuest！',
    description: '这是一个将写作变成冒险游戏的应用。让我们快速了解一下如何使用它！',
  },
  {
    id: 'character',
    title: '创建你的角色',
    description: '首先创建属于你的冒险者角色，选择一个职业开始你的旅程。你的角色会随着写作不断成长！',
  },
  {
    id: 'editor',
    title: '开始写作',
    description: '使用编辑器写下你的故事。每写一个字都会让你的角色获得经验值和金币！',
  },
  {
    id: 'quests',
    title: '完成每日任务',
    description: '每天都有新的任务等待你完成。完成任务可以获得额外奖励！',
  },
  {
    id: 'boss',
    title: '挑战 Boss',
    description: '通过写作积累力量，挑战强大的 Boss，解锁更多内容！',
  },
  {
    id: 'complete',
    title: '准备好了！',
    description: '你已经了解了 WriteQuest 的基本玩法。现在开始你的写作冒险吧！',
  },
];

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TutorialModal({ isOpen, onClose }: TutorialModalProps) {
  const { currentStep, setCurrentStep, markComplete } = useTutorialStore();
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    if (isOpen && !currentStep) {
      setCurrentStep('welcome');
      setCurrentIndex(0);
    }
  }, [isOpen, currentStep, setCurrentStep]);

  if (!isOpen) return null;

  const currentStepData = steps[currentIndex];

  const handleNext = () => {
    if (currentIndex < steps.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setCurrentStep(steps[nextIndex].id as any);
    } else {
      markComplete();
      onClose();
    }
  };

  const handleSkip = () => {
    markComplete();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <PixelPanel className="max-w-lg w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-end mb-2">
          <button
            onClick={handleSkip}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* 进度指示器 */}
        <div className="flex gap-1 justify-center mb-6">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index <= currentIndex ? 'w-8 bg-pixel-primary' : 'w-2 bg-gray-600'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <TutorialStep
              step={currentStepData.id}
              title={currentStepData.title}
              description={currentStepData.description}
              onNext={handleNext}
              onSkip={handleSkip}
              isLast={currentIndex === steps.length - 1}
            />
          </motion.div>
        </AnimatePresence>
      </PixelPanel>
    </div>
  );
}
