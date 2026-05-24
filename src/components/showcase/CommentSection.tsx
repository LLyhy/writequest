import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, User } from 'lucide-react';
import { CommentInput } from './CommentInput';
import { PixelPanel } from '../ui';
import type { Comment as CommentType } from '../../types/showcase';

interface CommentSectionProps {
  comments: CommentType[];
  currentUser?: { id: string; username?: string; displayName?: string; avatar?: string } | null;
  onAddComment: (content: string, parentId?: string) => Promise<void>;
  isSubmitting?: boolean;
}

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  // 1分钟内
  if (diff < 60000) {
    return '刚刚';
  }
  // 1小时内
  if (diff < 3600000) {
    return `${Math.floor(diff / 60000)} 分钟前`;
  }
  // 1天内
  if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)} 小时前`;
  }
  
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

interface CommentItemProps {
  comment: CommentType;
  comments: CommentType[];
  currentUser?: { id: string; username?: string; displayName?: string; avatar?: string } | null;
  onAddComment: (content: string, parentId?: string) => Promise<void>;
  isSubmitting?: boolean;
  level?: number;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  comments,
  currentUser,
  onAddComment,
  isSubmitting,
  level = 0,
}) => {
  const [showReply, setShowReply] = useState(false);
  
  const replies = comments.filter(c => c.parentId === comment.id);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-pixel-bg/30 p-4 rounded border border-pixel-border/20 ${level > 0 ? 'ml-8' : ''}`}
    >
      <div className="flex items-start gap-3">
        {/* 头像 */}
        <div className="flex-shrink-0">
          {comment.userAvatar ? (
            <img
              src={comment.userAvatar}
              alt={comment.userName}
              className="w-10 h-10 rounded-full bg-pixel-border/30 object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-pixel-border/30 flex items-center justify-center">
              <User size={20} className="text-gray-400" />
            </div>
          )}
        </div>
        
        {/* 评论内容 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="font-pixel text-sm text-pixel-primary">
              {comment.userName}
            </span>
            <span className="text-xs text-gray-500 font-mono">
              {formatDate(comment.createdAt)}
            </span>
          </div>
          
          <p className="text-gray-300 font-mono text-sm mb-3">
            {comment.content}
          </p>
          
          {/* 回复按钮 */}
          {currentUser && (
            <button
              onClick={() => setShowReply(!showReply)}
              className="text-xs text-pixel-primary hover:text-white transition-colors flex items-center gap-1"
            >
              <MessageCircle size={14} />
              <span>回复</span>
            </button>
          )}
          
          {/* 回复输入框 */}
          {showReply && (
            <div className="mt-3">
              <CommentInput
                placeholder={`回复 ${comment.userName}...`}
                onSubmit={async (content) => {
                  await onAddComment(content, comment.id);
                  setShowReply(false);
                }}
                isLoading={isSubmitting}
                autoFocus
                onCancel={() => setShowReply(false)}
              />
            </div>
          )}
          
          {/* 子评论 */}
          {replies.length > 0 && (
            <div className="mt-4 space-y-4">
              {replies.map(reply => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  comments={comments}
                  currentUser={currentUser}
                  onAddComment={onAddComment}
                  isSubmitting={isSubmitting}
                  level={level + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  currentUser,
  onAddComment,
  isSubmitting = false,
}) => {
  // 获取顶级评论
  const topLevelComments = comments.filter(comment => !comment.parentId);
  
  return (
    <div>
      <h2 className="font-pixel text-lg text-white mb-4 flex items-center gap-2">
        <MessageCircle size={20} />
        评论区
        <span className="text-gray-400 text-sm font-mono">({comments.length})</span>
      </h2>
      
      {/* 评论输入框 */}
      {currentUser && (
        <div className="mb-6">
          <CommentInput
            placeholder="写下你的评论..."
            onSubmit={(content) => onAddComment(content)}
            isLoading={isSubmitting}
          />
        </div>
      )}
      
      {/* 评论列表 */}
      <div className="space-y-4">
        {topLevelComments.length === 0 ? (
          <div className="text-center py-8 text-gray-500 font-mono">
            暂无评论，快来抢沙发吧！
          </div>
        ) : (
          topLevelComments.map(comment => (
            <CommentItem
              key={comment.id}
              comment={comment}
              comments={comments}
              currentUser={currentUser}
              onAddComment={onAddComment}
              isSubmitting={isSubmitting}
            />
          ))
        )}
      </div>
    </div>
  );
};
