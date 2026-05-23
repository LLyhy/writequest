import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, Trash2, Clock, Type, Tag, X } from 'lucide-react';
import { PixelPanel } from '../ui';
import type { DraftWork } from '../../types/showcase';

interface DraftBoxProps {
  isOpen: boolean;
  onClose: () => void;
  drafts: DraftWork[];
  onEditDraft: (draft: DraftWork) => void;
  onDeleteDraft: (draftId: string) => void;
}

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) {
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours === 0) {
      const minutes = Math.floor(diff / (1000 * 60));
      return minutes <= 1 ? '刚刚' : `${minutes} 分钟前`;
    }
    return `${hours} 小时前`;
  }
  if (days === 1) return '昨天';
  if (days < 7) return `${days} 天前`;
  return date.toLocaleDateString('zh-CN');
};

const getPreview = (content: string, maxLength = 100) => {
  const plainText = content.replace(/<[^>]*>/g, '');
  return plainText.length > maxLength ? plainText.slice(0, maxLength) + '...' : plainText;
};

export const DraftBox: React.FC<DraftBoxProps> = ({
  isOpen,
  onClose,
  drafts,
  onEditDraft,
  onDeleteDraft,
}) => {
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleDelete = (draftId: string) => {
    onDeleteDraft(draftId);
    setDeleteConfirmId(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-3xl max-h-[80vh] flex flex-col"
          >
            <PixelPanel className="flex flex-col max-h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-pixel text-white text-lg">草稿箱</h2>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-pixel-border/20 rounded transition-colors"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3">
                {drafts.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-500 text-4xl mb-4">📝</div>
                    <p className="text-gray-400 font-pixel text-sm">暂无草稿</p>
                  </div>
                ) : (
                  drafts.map((draft) => (
                    <motion.div
                      key={draft.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <PixelPanel variant="inset" className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-pixel text-white text-sm mb-2">
                              {draft.title || '无标题草稿'}
                            </h3>
                            <p className="text-xs text-gray-300 mb-3 line-clamp-2">
                              {getPreview(draft.content)}
                            </p>
                            
                            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-3">
                              <div className="flex items-center gap-1">
                                <Clock size={14} />
                                <span>{formatDate(draft.updatedAt)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Type size={14} />
                                <span>{draft.content.length} 字符</span>
                              </div>
                            </div>

                            {draft.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mb-3">
                                {draft.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="flex items-center gap-1 px-2 py-0.5 bg-pixel-border/30 text-xs text-gray-300 rounded"
                                  >
                                    <Tag size={12} />
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col gap-2 shrink-0">
                            <button
                              onClick={() => onEditDraft(draft)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-pixel-accent hover:bg-pixel-accent/80 text-white text-xs font-pixel rounded transition-colors"
                            >
                              <Edit size={14} />
                              编辑
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(draft.id)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-pixel rounded transition-colors"
                            >
                              <Trash2 size={14} />
                              删除
                            </button>
                          </div>
                        </div>
                      </PixelPanel>
                    </motion.div>
                  ))
                )}
              </div>
            </PixelPanel>

            <AnimatePresence>
              {deleteConfirmId && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute inset-0 z-10 flex items-center justify-center"
                >
                  <div className="absolute inset-0 bg-black/80" onClick={() => setDeleteConfirmId(null)} />
                  <PixelPanel className="relative p-6 max-w-sm">
                    <h3 className="font-pixel text-white text-sm mb-4">确认删除？</h3>
                    <p className="text-gray-400 text-sm mb-6">删除后无法恢复此草稿</p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="flex-1 px-4 py-2 bg-pixel-border/30 text-gray-300 text-xs font-pixel rounded hover:bg-pixel-border/50 transition-colors"
                      >
                        取消
                      </button>
                      <button
                        onClick={() => handleDelete(deleteConfirmId)}
                        className="flex-1 px-4 py-2 bg-red-600 text-white text-xs font-pixel rounded hover:bg-red-700 transition-colors"
                      >
                        删除
                      </button>
                    </div>
                  </PixelPanel>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
