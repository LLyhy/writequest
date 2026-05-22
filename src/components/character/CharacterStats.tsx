import React from 'react';
import { motion } from 'framer-motion';
import { useCharacterStore } from '../../stores';
import { CLASS_CONFIGS } from '../../constants/game';
import { PixelPanel } from '../ui/PixelPanel';
import { XPBar } from '../ui/XPBar';
import { StatCard } from '../ui/StatCard';
import { LevelBadge } from '../ui/LevelBadge';
import { FileText, Clock, Calendar, Award } from 'lucide-react';

export const CharacterStats: React.FC = () => {
  const character = useCharacterStore((state) => state.character);

  if (!character) return null;

  const classConfig = CLASS_CONFIGS.find((c) => c.id === character.class);

  // 格式化写作时间
  const formatWritingTime = (minutes: number): string => {
    if (minutes < 60) return `${minutes}分钟`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`;
  };

  // 格式化日期
  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString('zh-CN');
  };

  return (
    <PixelPanel title="角色信息" titleIcon={classConfig?.icon}>
      <div className="space-y-6">
        {/* 头部信息 */}
        <div className="flex items-center gap-4">
          <LevelBadge level={character.level} showTitle />
          <div className="flex-1">
            <h3 className="font-pixel text-lg text-white">{character.name}</h3>
            <p className="text-xs text-gray-400 font-mono">
              {classConfig?.name} · 加入于 {formatDate(character.createdAt)}
            </p>
          </div>
        </div>

        {/* 经验条 */}
        <XPBar level={character.level} exp={character.exp} />

        {/* 统计数据 */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={<FileText size={20} />}
            label="总字数"
            value={character.totalWords.toLocaleString()}
            subValue="字"
            color="primary"
          />
          <StatCard
            icon={<Clock size={20} />}
            label="写作时间"
            value={formatWritingTime(character.totalWritingTime)}
            subValue="累计"
            color="secondary"
          />
          <StatCard
            icon={<Calendar size={20} />}
            label="最近写作"
            value={
              character.lastWritingAt
                ? formatDate(character.lastWritingAt)
                : '从未'
            }
            subValue={character.lastWritingAt ? '上次活跃' : '开始写作吧'}
            color="accent"
          />
          <StatCard
            icon={<Award size={20} />}
            label="职业"
            value={classConfig?.name || '-'}
            subValue={classConfig?.description}
            color="danger"
          />
        </div>

        {/* 职业加成 */}
        <motion.div
          className="bg-pixel-border/20 border-2 border-pixel-border/50 p-3 rounded"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h4 className="font-pixel text-xs text-gray-300 mb-2">职业加成</h4>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-mono">经验:</span>
              <span className="font-pixel text-xs text-pixel-primary">
                x{classConfig?.bonus.expMultiplier}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-mono">字数:</span>
              <span className="font-pixel text-xs text-pixel-secondary">
                x{classConfig?.bonus.wordCountBonus}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </PixelPanel>
  );
};
