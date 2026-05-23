import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ArrowLeft, SortAsc, SortDesc, TrendingUp, Users, Flame } from 'lucide-react';
import { useShowcaseStore, useUserProfileStore } from '../stores';
import { WorkCard, WorkDetail, Leaderboard } from '../components/showcase';
import { PixelPanel, PixelButton, PixelInput } from '../components/ui';
import type { PublishedWork, WorkSortType, LeaderboardType } from '../types/showcase';

type SidebarTab = 'all' | 'trending' | 'leaderboard';

export function ShowcasePage({ onBack }: { onBack: () => void }) {
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWork, setSelectedWork] = useState<PublishedWork | null>(null);
  const [leaderboardType, setLeaderboardType] = useState<LeaderboardType>('works');
  const {
    publishedWorks,
    currentSort,
    currentFilter,
    setSort,
    setFilter,
    getSortedWorks,
    selectWork,
    incrementViews,
  } = useShowcaseStore();
  const { currentUser } = useUserProfileStore();

  const works = getSortedWorks();

  const filteredWorks = works.filter(
    (work) =>
      work.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      work.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      work.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleWorkClick = (work: PublishedWork) => {
    incrementViews(work.id);
    setSelectedWork(work);
    selectWork(work);
  };

  const renderSortOptions = () => (
    <div className="space-y-2">
      <p className="text-xs text-gray-500 font-pixel mb-2">排序方式</p>
      {[
        { type: 'latest' as WorkSortType, label: '最新发布', icon: SortDesc },
        { type: 'popular' as WorkSortType, label: '最受欢迎', icon: TrendingUp },
        { type: 'wordCount' as WorkSortType, label: '字数最多', icon: Flame },
        { type: 'random' as WorkSortType, label: '随机推荐', icon: Users },
      ].map(({ type, label, icon: Icon }) => (
        <button
          key={type}
          onClick={() => setSort(type)}
          className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded transition-colors ${
            currentSort === type
              ? 'bg-pixel-accent/20 text-pixel-accent'
              : 'text-gray-400 hover:bg-pixel-border/20 hover:text-white'
          }`}
        >
          <Icon size={14} />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );

  const renderFilterOptions = () => {
    const allTags = Array.from(
      new Set(publishedWorks.flatMap((work) => work.tags))
    ).slice(0, 15);

    return (
      <div className="space-y-2">
        <p className="text-xs text-gray-500 font-pixel mb-2">标签筛选</p>
        <button
          onClick={() => setFilter(null)}
          className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded transition-colors ${
            !currentFilter
              ? 'bg-pixel-accent/20 text-pixel-accent'
              : 'text-gray-400 hover:bg-pixel-border/20 hover:text-white'
          }`}
        >
          全部作品
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setFilter(tag)}
            className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded transition-colors ${
              currentFilter === tag
                ? 'bg-pixel-accent/20 text-pixel-accent'
                : 'text-gray-400 hover:bg-pixel-border/20 hover:text-white'
            }`}
          >
            #{tag}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-pixel-bg">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <PixelButton variant="secondary" size="md" onClick={onBack}>
            <ArrowLeft size={16} className="mr-2" />
            返回
          </PixelButton>
          <div>
            <h1 className="font-pixel text-white text-xl">作品广场</h1>
            <p className="text-gray-500 text-sm">发现优秀作品，与其他冒险者交流</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-3 space-y-4">
            {/* Search */}
            <PixelPanel className="p-4">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <PixelInput
                  placeholder="搜索作品..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </PixelPanel>

            {/* Tabs */}
            <PixelPanel className="p-4">
              <div className="flex gap-2 mb-4">
                {[
                  { id: 'all' as SidebarTab, label: '全部' },
                  { id: 'trending' as SidebarTab, label: '热门' },
                  { id: 'leaderboard' as SidebarTab, label: '排行榜' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSidebarTab(tab.id)}
                    className={`flex-1 py-2 text-xs font-pixel rounded transition-colors ${
                      sidebarTab === tab.id
                        ? 'bg-pixel-accent text-white'
                        : 'text-gray-400 hover:bg-pixel-border/20'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {sidebarTab === 'all' && (
                <div className="space-y-4">
                  {renderSortOptions()}
                  <div className="h-px bg-pixel-border/30" />
                  {renderFilterOptions()}
                </div>
              )}

              {sidebarTab === 'trending' && (
                <div className="text-center py-8">
                  <TrendingUp size={32} className="text-pixel-accent mx-auto mb-2 opacity-50" />
                  <p className="text-gray-500 text-sm font-pixel">热门作品将显示在这里</p>
                </div>
              )}

              {sidebarTab === 'leaderboard' && (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    {[
                      { id: 'works' as LeaderboardType, label: '作品榜' },
                      { id: 'authors' as LeaderboardType, label: '作者榜' },
                    ].map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setLeaderboardType(type.id)}
                        className={`flex-1 py-2 text-xs font-pixel rounded transition-colors ${
                          leaderboardType === type.id
                            ? 'bg-pixel-primary text-white'
                            : 'text-gray-400 hover:bg-pixel-border/20'
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                  <Leaderboard type={leaderboardType} />
                </div>
              )}
            </PixelPanel>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            {filteredWorks.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {filteredWorks.map((work, index) => (
                  <motion.div
                    key={work.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <WorkCard work={work} onClick={handleWorkClick} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <PixelPanel className="p-12 text-center">
                <div className="text-gray-500 text-4xl mb-4">📚</div>
                <h3 className="font-pixel text-white text-lg mb-2">暂无作品</h3>
                <p className="text-gray-400 text-sm">
                  {searchQuery ? '没有找到匹配的作品' : '还没有任何作品发布'}
                </p>
              </PixelPanel>
            )}
          </div>
        </div>
      </div>

      {/* Work Detail Modal */}
      <AnimatePresence>
        {selectedWork && (
          <WorkDetail work={selectedWork} onClose={() => setSelectedWork(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
