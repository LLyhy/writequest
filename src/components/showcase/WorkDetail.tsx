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
} from 'lucide-react';
import { PixelPanel, PixelButton } from '../ui';
import { useShowcaseStore } from '../../stores/showcaseStore';
import { useUserProfileStore } from '../../stores/userProfileStore';
import { CommentSection } from './CommentSection';
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    likeWork,
    unlikeWork,
    favoriteWork,
    unfavoriteWork,
    addComment,
    incrementViews,
    fetchComments,
  } = useShowcaseStore();
  const { currentUser } = useUserProfileStore();

  useEffect(() => {
    incrementViews(work.id);
    fetchComments(work.id);
  }, [work.id, incrementViews, fetchComments]);

  const isLiked = currentUser ? work.likedBy.includes(currentUser.id) : false;
  const isFavorited = currentUser
    ? work.favoritedBy.includes(currentUser.id)
    : false;

  const handleLike = () => {
    if (!currentUser) return;
    if (isLiked) {
      unlikeWork(work.id);
    } else {
      likeWork(work.id);
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

  const handleAddComment = async (content: string, parentId?: string) => {
    if (!currentUser || !content.trim()) return;
    setIsSubmitting(true);

    await addComment(work.id, content.trim(), parentId);
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

              <CommentSection
                comments={work.comments}
                currentUser={currentUser}
                onAddComment={handleAddComment}
                isSubmitting={isSubmitting}
              />
            </div>
          </PixelPanel>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
