import React from 'react';
import { motion } from 'framer-motion';
import { PixelPanel } from '../ui/PixelPanel';
import { PixelButton } from '../ui/PixelButton';
import { ScrollText, PenTool, Target, Zap, CheckCircle2 } from 'lucide-react';

interface TutorialStepProps {
  step: string;
  title: string;
  description: string;
  onNext: () => void;
  onSkip: () => void;
  isLast?: boolean;
}

const stepIcons: Record<string, React.ReactNode> = {
  welcome: <ScrollText size={32} />,
  character: <PenTool size={32} />,
  editor: <ScrollText size={32} />,
  quests: <Target size={32} />,
  boss: <Zap size={32} />,
  complete: <CheckCircle2 size={32} />,
};

export function TutorialStep({ step, title, description, onNext, onSkip, isLast = false }: TutorialStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center"
    >
      <div className="text-pixel-primary mb-4">
        {stepIcons[step] || <ScrollText size={32} />}
      </div>
      <h3 className="font-pixel text-xl text-white mb-3">{title}</h3>
      <p className="text-gray-300 mb-6 max-w-md mx-auto">{description}</p>
      <div className="flex gap-3 justify-center">
        {!isLast && (
          <PixelButton variant="secondary" onClick={onSkip}>
            跳过教程
          </PixelButton>
        )}
        <PixelButton variant="primary" onClick={onNext}>
          {isLast ? '开始冒险！' : '下一步'}
        </PixelButton>
      </div>
    </motion.div>
  );
}
