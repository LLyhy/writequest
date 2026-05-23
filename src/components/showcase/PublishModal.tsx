import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Save,
  Upload,
  CheckCircle2,
  Eye,
  EyeOff,
  Hash,
  Type,
} from 'lucide-react';
import { PixelPanel, PixelButton, PixelInput } from '../ui';
import { useShowcaseStore } from '../../stores/showcaseStore';
import { useUserProfileStore } from '../../stores/userProfileStore';

const PRESET_TAGS = [
  '奇幻',
  '科幻',
  '武侠',
  '言情',
  '悬疑',
  '冒险',
  '短篇',
  '长篇',
  '诗歌',
  '散文',
  '日常',
  '原创',
];

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialContent?: string;
  initialWordCount?: number;
}

export const PublishModal: React.FC<PublishModalProps> = ({
  isOpen,
  onClose,
  initialContent = '',
  initialWordCount = 0,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState(initialContent);
  const [tags, setTags] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const { publishWork, createDraft } = useShowcaseStore();
  const { currentUser, addToTotalWorks, addToTotalWords } = useUserProfileStore();

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length || initialWordCount;

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDescription('');
      setContent(initialContent);
      setTags([]);
      setIsPublic(true);
      setShowSuccess(false);
    }
  }, [isOpen, initialContent]);

  const toggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter((t) => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  const handleSaveDraft = async () => {
    if (!currentUser) return;
    setIsSavingDraft(true);

    const draft = {
      id: Math.random().toString(36).substring(2, 9),
      title,
      description,
      content,
      tags,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    createDraft(draft);

    setSuccessMessage('草稿保存成功！');
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 1500);

    setIsSavingDraft(false);
  };

  const handlePublish = async () => {
    if (!currentUser || !title.trim() || !content.trim()) return;
    setIsPublishing(true);

    const work = {
      id: Math.random().toString(36).substring(2, 9),
      authorId: currentUser.id,
      authorName: currentUser.characterName,
      authorDisplayName: currentUser.displayName,
      title: title.trim(),
      description: description.trim(),
      content: content.trim(),
      wordCount,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isPublic,
      tags,
      likes: 0,
      likedBy: [],
      comments: [],
      favorites: 0,
      favoritedBy: [],
      views: 0,
    };

    publishWork(work);
    addToTotalWorks(1);
    addToTotalWords(wordCount);

    setSuccessMessage('作品发布成功！');
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 1500);

    setIsPublishing(false);
  };

  if (!isOpen) return null;

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
          className="max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <PixelPanel className="relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-pixel-border/20 rounded transition-colors z-10"
            >
              <X size={24} className="text-gray-400 hover:text-white" />
            </button>

            {showSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-16"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{ duration: 0.6 }}
                >
                  <CheckCircle2 size={80} className="text-pixel-primary mb-4" />
                </motion.div>
                <h2 className="font-pixel text-2xl text-white mb-2">
                  {successMessage}
                </h2>
              </motion.div>
            ) : (
              <div className="pr-12">
                <h2 className="font-pixel text-xl text-white mb-6">发布作品</h2>

                <div className="space-y-5">
                  <div>
                    <PixelInput
                      label="作品标题"
                      placeholder="给你的作品起个名字..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      icon={<Type size={16} />}
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-pixel text-xs text-gray-300">
                      作品简介
                    </label>
                    <textarea
                      className="w-full bg-pixel-bg border-2 border-pixel-border px-3 py-2 text-white font-mono text-sm placeholder-gray-500 focus:outline-none focus:border-pixel-primary transition-colors resize-none h-24"
                      placeholder="简单介绍一下你的作品..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-pixel text-xs text-gray-300">
                      作品内容
                    </label>
                    <textarea
                      className="w-full bg-pixel-bg border-2 border-pixel-border px-3 py-2 text-white font-mono text-sm placeholder-gray-500 focus:outline-none focus:border-pixel-primary transition-colors resize-none h-48"
                      placeholder="在这里写下你的故事..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                    <div className="text-right text-xs text-gray-500 font-mono mt-1">
                      {wordCount} 字
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 font-pixel text-xs text-gray-300 flex items-center gap-2">
                      <Hash size={14} />
                      标签
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {PRESET_TAGS.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`px-3 py-1 text-xs font-pixel rounded border-2 transition-all ${
                            tags.includes(tag)
                              ? 'bg-pixel-primary text-pixel-border border-pixel-primary'
                              : 'bg-pixel-bg text-gray-400 border-pixel-border hover:border-pixel-primary/50'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-pixel-bg/30 rounded border border-pixel-border/20">
                    <div className="flex items-center gap-2">
                      {isPublic ? (
                        <Eye size={18} className="text-pixel-primary" />
                      ) : (
                        <EyeOff size={18} className="text-gray-500" />
                      )}
                      <span className="font-pixel text-sm text-gray-300">
                        {isPublic ? '公开可见' : '仅自己可见'}
                      </span>
                    </div>
                    <button
                      onClick={() => setIsPublic(!isPublic)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        isPublic ? 'bg-pixel-primary' : 'bg-pixel-border'
                      }`}
                    >
                      <motion.div
                        animate={{ x: isPublic ? 28 : 4 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
                      />
                    </button>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <PixelButton
                      variant="secondary"
                      onClick={handleSaveDraft}
                      isLoading={isSavingDraft}
                      className="flex-1 flex items-center justify-center gap-2"
                    >
                      <Save size={16} />
                      保存草稿
                    </PixelButton>
                    <PixelButton
                      variant="primary"
                      onClick={handlePublish}
                      isLoading={isPublishing}
                      disabled={!title.trim() || !content.trim()}
                      className="flex-1 flex items-center justify-center gap-2"
                    >
                      <Upload size={16} />
                      发布作品
                    </PixelButton>
                  </div>
                </div>
              </div>
            )}
          </PixelPanel>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
