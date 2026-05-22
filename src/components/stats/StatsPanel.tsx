import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore, useCharacterStore } from '../../stores';
import { PixelPanel } from '../ui/PixelPanel';
import { BarChart3, TrendingUp, Calendar, Clock, FileText, Trophy, Flame } from 'lucide-react';

interface StatsPanelProps {
  onClose?: () => void;
}

export const StatsPanel: React.FC<StatsPanelProps> = () => {
  const { writingHistory, getWritingStats } = useGameStore();
  const { character } = useCharacterStore();

  const stats = getWritingStats();

  // 获取最近7天的数据
  const getLast7Days = () => {
    const days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().split('T')[0]);
    }
    return days;
  };

  const last7Days = getLast7Days();

  // 获取每天的字数
  const getDailyWords = (date: string) => {
    const record = writingHistory.find((h) => h.date === date);
    return record ? record.wordCount : 0;
  };

  // 计算最大字数用于图表比例
  const maxWords = Math.max(...last7Days.map(getDailyWords), 1);

  // 获取星期几
  const getWeekday = (dateStr: string) => {
    const date = new Date(dateStr);
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    return weekdays[date.getDay()];
  };

  if (!character) {
    return (
      <PixelPanel title="写作统计" titleIcon={<BarChart3 className="text-pixel-secondary" />}>
        <div className="text-center py-8 text-gray-500 font-mono">
          请先创建角色查看统计
        </div>
      </PixelPanel>
    );
  }

  return (
    <PixelPanel title="写作统计" titleIcon={<BarChart3 className="text-pixel-secondary" />}>
      <div className="space-y-6">
        {/* 总览数据 */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-pixel-bg/50 p-4 rounded border-2 border-pixel-border"
          >
            <div className="flex items-center gap-2 mb-2">
              <FileText size={18} className="text-pixel-primary" />
              <span className="text-xs text-gray-400 font-mono">总字数</span>
            </div>
            <p className="font-pixel text-xl text-white">{character.totalWords.toLocaleString()}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-pixel-bg/50 p-4 rounded border-2 border-pixel-border"
          >
            <div className="flex items-center gap-2 mb-2">
              <Clock size={18} className="text-pixel-secondary" />
              <span className="text-xs text-gray-400 font-mono">总时长</span>
            </div>
            <p className="font-pixel text-xl text-white">
              {Math.floor(character.totalWritingTime / 60)}h
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-pixel-bg/50 p-4 rounded border-2 border-pixel-border"
          >
            <div className="flex items-center gap-2 mb-2">
              <Flame size={18} className="text-pixel-danger" />
              <span className="text-xs text-gray-400 font-mono">连续天数</span>
            </div>
            <p className="font-pixel text-xl text-white">{character.streakDays} 天</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-pixel-bg/50 p-4 rounded border-2 border-pixel-border"
          >
            <div className="flex items-center gap-2 mb-2">
              <Trophy size={18} className="text-pixel-accent" />
              <span className="text-xs text-gray-400 font-mono">写作天数</span>
            </div>
            <p className="font-pixel text-xl text-white">{writingHistory.length} 天</p>
          </motion.div>
        </div>

        {/* 本周统计 */}
        <div className="bg-pixel-bg/30 p-4 rounded border-2 border-pixel-border">
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={18} className="text-pixel-secondary" />
            <h4 className="font-pixel text-sm text-white">本周写作</h4>
          </div>

          <div className="flex items-end justify-between h-32 gap-2">
            {last7Days.map((date, index) => {
              const words = getDailyWords(date);
              const height = maxWords > 0 ? (words / maxWords) * 100 : 0;
              const isToday = date === new Date().toISOString().split('T')[0];

              return (
                <div key={date} className="flex-1 flex flex-col items-center gap-1">
                  {/* 数值 */}
                  <span className="text-xs font-mono text-gray-500">
                    {words > 0 ? (words >= 1000 ? `${(words / 1000).toFixed(1)}k` : words) : ''}
                  </span>
                  
                  {/* 柱状图 */}
                  <div className="w-full bg-pixel-border rounded-t overflow-hidden relative" style={{ height: '80px' }}>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      className={`absolute bottom-0 w-full rounded-t ${
                        isToday ? 'bg-pixel-primary' : 'bg-pixel-secondary/60'
                      }`}
                    />
                  </div>
                  
                  {/* 日期 */}
                  <span className={`text-xs font-mono ${isToday ? 'text-pixel-primary' : 'text-gray-500'}`}>
                    {getWeekday(date)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between mt-4 text-xs font-mono text-gray-400">
            <span>本周: {stats.weeklyWords.toLocaleString()} 字</span>
            <span>{Math.floor(stats.weeklyTime / 60)} 小时</span>
          </div>
        </div>

        {/* 最佳记录 */}
        {stats.bestDay && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-pixel-accent/10 p-4 rounded border-2 border-pixel-accent/30"
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={18} className="text-pixel-accent" />
              <h4 className="font-pixel text-sm text-pixel-accent">最佳记录</h4>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-2xl font-pixel text-white">{stats.bestDay.wordCount.toLocaleString()}</p>
                <p className="text-xs text-gray-400 font-mono">{stats.bestDay.date}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-mono text-pixel-accent">
                  {Math.floor(stats.bestDay.writingTime / 60)}h {stats.bestDay.writingTime % 60}m
                </p>
                <p className="text-xs text-gray-400 font-mono">{stats.bestDay.sessions} 次写作</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* 最近记录 */}
        {writingHistory.length > 0 && (
          <div>
            <h4 className="font-pixel text-xs text-gray-500 mb-3 flex items-center gap-2">
              <Calendar size={14} />
              最近记录
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {[...writingHistory]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 10)
                .map((record, index) => (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-3 bg-pixel-bg/30 rounded border border-pixel-border/50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 font-mono">{record.date}</span>
                      <span className="text-sm font-mono text-white">{record.wordCount.toLocaleString()} 字</span>
                    </div>
                    <div className="text-xs text-gray-400 font-mono">
                      {Math.floor(record.writingTime / 60)}h {record.writingTime % 60}m
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        )}
      </div>
    </PixelPanel>
  );
};
