import React from 'react';
import { motion } from 'framer-motion';
import { useEditorStore } from '../../stores';
import { PixelPanel } from '../ui/PixelPanel';
import { FileText, Type, Clock, TrendingUp } from 'lucide-react';

interface WordCounterProps {
  className?: string;
}

export const WordCounter: React.FC<WordCounterProps> = ({ className = '' }) => {
  const { wordCount, charCount, content } = useEditorStore();

  // 计算阅读时间（假设平均阅读速度为每分钟200字）
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  // 计算写作速度（需要更多信息，这里显示当前会话的估算）
  const stats = [
    {
      icon: <FileText size={20} />,
      label: '字数',
      value: wordCount,
      color: 'text-pixel-primary' as const,
    },
    {
      icon: <Type size={20} />,
      label: '字符',
      value: charCount,
      color: 'text-pixel-secondary' as const,
    },
    {
      icon: <Clock size={20} />,
      label: '阅读时间',
      value: `${readingTime}分钟`,
      color: 'text-pixel-accent' as const,
      isText: true,
    },
    {
      icon: <TrendingUp size={20} />,
      label: '段落',
      value: content.split(/\n\s*\n/).filter((p) => p.trim()).length,
      color: 'text-pixel-magic' as const,
    },
  ];

  return (
    <PixelPanel
      title="字数统计"
      titleIcon={<FileText className="text-pixel-primary" />}
      className={className}
    >
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="text-center p-3 bg-pixel-border/20 border-2 border-pixel-border/50"
          >
            <div className={`${stat.color} mb-2 flex justify-center`}>
              {stat.icon}
            </div>
            <div className="font-pixel text-xl text-white mb-1">
              {stat.isText ? stat.value : stat.value.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 font-mono">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* 进度条 - 目标字数 */}
      <div className="mt-4 pt-4 border-t-2 border-pixel-border">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-400 font-mono">今日目标</span>
          <span className="text-xs text-pixel-primary font-pixel">
            {wordCount >= 500 ? '已完成!' : `${wordCount} / 500`}
          </span>
        </div>
        <div className="h-3 bg-pixel-border border-2 border-pixel-border overflow-hidden">
          <motion.div
            className="h-full bg-pixel-primary"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, (wordCount / 500) * 100)}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </PixelPanel>
  );
};
