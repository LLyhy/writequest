import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Heart,
  MessageCircle,
  Star,
  Calendar,
  User,
  FileText,
  Send,
} from 'lucide-react';
import { PixelPanel, PixelButton, PixelInput } from '../ui';
import { useShowcaseStore } from '../../stores/showcaseStore';
import { useUserProfileStore } from '../../stores/userProfileStore';
import type { PublishedWork } from '../../types/showcase';

interface WorkDetailProps {
  work: PublishedWork;
  onClose: () => void;
}

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const WorkDetail: React.FC<WorkDetailProps> = ({ work, onClose }) => {
  const [commentInput, setCommentInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    likeWork,
    unlikeWork,
    favoriteWork,
    unfavoriteWork,
    addComment,
    incrementViews,
  } = useShowcaseStore();
  const { currentUser } = useUserProfileStore();

  useEffect(() => {
    incrementViews(work.id);
  }, [work.id, incrementViews]);

  const isLiked = currentUser ? work.likedBy.includes(currentUser.id) : false;
  const isFavorited = currentUser
    ? work.favoritedBy.includes(currentUser.id)
    : false;

  const handleLike = () => {
    if (!currentUser) return;
    if (isLiked) {
      unlikeWork(work.id, currentUser.id);
    } else {
      likeWork(work.id, currentUser.id);
    }
  };

  const handleFavorite = () => {
    if (!currentUser) return;
    if (isFavorited) {
      unfavoriteWork(work.id, currentUser.id);
    } else {
      favoriteWork(work.id, currentUser.id);
    }
  };

  const handleComment = async () => {
    if (!currentUser || !commentInput.trim()) return;
    setIsSubmitting(true);

    const newComment = {
      id: Math.random().toString(36).substring(2, 9),
      authorId: currentUser.id,
      authorName: currentUser.displayName || currentUser.characterName,
      content: commentInput.trim(),
      createdAt: Date.now(),
    };

    addComment(work.id, newComment);
    setCommentInput('');
    setIsSubmitting(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <PixelPanel className="relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-pixel-border/20 rounded transition-colors"
            >
              <X size={24} className="text-gray-400 hover:text-white" />
            </button>

            <div className="pr-12">
              <h1 className="font-pixel text-2xl text-white mb-2">{work.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                <div className="flex items-center gap-1">
                  <User size={16} />
                  <span>{work.authorDisplayName || work.authorName}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  <span>{formatDate(work.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FileText size={16} />
                  <span>{work.wordCount} 字</span>
                </div>
              </div>

              {work.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {work.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-pixel-border/30 text-xs text-gray-300 rounded font-pixel"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="bg-pixel-bg/50 p-4 rounded mb-6 border border-pixel-border/30">
                <p className="text-gray-300 font-mono">{work.description}</p>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <PixelButton
                  variant={isLiked ? 'accent' : 'secondary'}
                  size="sm"
                  onClick={handleLike}
                  className="flex items-center gap-2"
                >
                  <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
                  <span>{work.likes}</span>
                </PixelButton>
                <PixelButton
                  variant={isFavorited ? 'accent' : 'secondary'}
                  size="sm"
                  onClick={handleFavorite}
                  className="flex items-center gap-2"
                >
                  <Star size={16} fill={isFavorited ? 'currentColor' : 'none'} />
                  <span>{work.favorites}</span>
                </PixelButton>
                <div className="flex items-center gap-2 text-gray-400 font-mono">
                  <MessageCircle size={16} />
                  <span>{work.comments.length} 条评论</span>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="font-pixel text-lg text-white mb-4">作品内容</h2>
                <div className="bg-pixel-bg/30 p-6 rounded border border-pixel-border/20">
                  <div className="text-gray-200 font-mono whitespace-pre-wrap leading-relaxed">
                    {work.content}
                  </div>
                </div>
              </div>

              <div>
                <h2 className="font-pixel text-lg text-white mb-4">评论区</h2>

                {currentUser && (
                  <div className="flex gap-3 mb-6">
                    <PixelInput
                      placeholder="写下你的评论..."
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleComment();
                        }
                      }}
                    />
                    <PixelButton
                      variant="primary"
                      onClick={handleComment}
                      isLoading={isSubmitting}
                      className="flex items-center gap-2"
                    >
                      <Send size={16} />
                      发送
                    </PixelButton>
                  </div>
                )}

                <div className="space-y-4">
                  {work.comments.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 font-mono">
                      暂无评论，快来抢沙发吧！
                    </div>
                  ) : (
                    work.comments.map((comment) => (
                      <motion.div
                        key={comment.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-pixel-bg/30 p-4 rounded border border-pixel-border/20"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-pixel text-sm text-pixel-primary">
                            {comment.authorName}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-gray-300 font-mono text-sm">
                          {comment.content}
                        </p>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </PixelPanel>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
