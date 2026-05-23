import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCharacterStore, useGameStore } from '../stores';
import { BossBattleComponent, BossSelect } from '../components/boss';
import { PixelButton } from '../components/ui/PixelButton';
import type { Boss } from '../types';

interface BossBattleViewProps {
  onBack: () => void;
}

export function BossBattleView({ onBack }: BossBattleViewProps) {
  const [selectedBoss, setSelectedBoss] = useState<Boss | null>(null);
  const unlockNextBoss = useGameStore((state) => state.unlockNextBoss);

  const handleSelectBoss = (boss: Boss) => {
    setSelectedBoss(boss);
  };

  const handleBossVictory = () => {
    if (selectedBoss) {
      unlockNextBoss(selectedBoss.id);
    }
    setTimeout(() => {
      setSelectedBoss(null);
    }, 3000);
  };

  const handleBossDefeat = () => {
    setTimeout(() => {
      setSelectedBoss(null);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-pixel-bg p-4">
      <div className="mb-4">
        <PixelButton variant="secondary" size="md" onClick={onBack}>
          ← 返回
        </PixelButton>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {selectedBoss ? (
          <BossBattleComponent
            boss={selectedBoss}
            onClose={() => setSelectedBoss(null)}
            onVictory={handleBossVictory}
            onDefeat={handleBossDefeat}
          />
        ) : (
          <BossSelect onSelectBoss={handleSelectBoss} />
        )}
      </motion.div>
    </div>
  );
}
