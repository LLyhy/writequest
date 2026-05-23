import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEditorStore, useGameStore, useCharacterStore, useSkillStore } from '../../stores';
import { useShowcaseStore } from '../../stores/showcaseStore';
import { useUserProfileStore } from '../../stores/userProfileStore';
import { calculateWritingExp } from '../../constants/game';
import { PixelPanel } from '../ui/PixelPanel';
import { PixelButton } from '../ui/PixelButton';
import { Play, Square, Trash2, FileText, Clock, Sparkles, Upload, Save, FolderOpen } from 'lucide-react';
import { PublishModal } from '../showcase/PublishModal';
import { DraftBox } from '../showcase/DraftBox';
import type { DraftWork } from '../../types/showcase';

interface WritingEditorProps {
  onWordCountChange?: (count: number) => void;
}

export const WritingEditor: React.FC<WritingEditorProps> = ({
  onWordCountChange,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [sessionStartWordCount, setSessionStartWordCount] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showDraftBox, setShowDraftBox] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const {
    content,
    wordCount,
    charCount,
    setContent,
    isDirty,
    createDocument,
    saveDocument,
    activeDocumentId,
    clearContent,
  } = useEditorStore();

  const {
    isWriting,
    startWritingSession,
    endWritingSession,
    sessionStartTime,
    addWritingHistory,
  } = useGameStore();

  const {
    character,
    addExp,
    addWords,
    addWritingTime,
    checkAndLevelUp,
    updateStreak,
  } = useCharacterStore();

  const { getSkillEffects } = useSkillStore();
  const { createDraft, draftWorks, deleteDraft } = useShowcaseStore();
  const { currentUser, createProfile } = useUserProfileStore();

  // 计时器
  useEffect(() => {
    if (isWriting && sessionStartTime) {
      timerRef.current = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - sessionStartTime) / 1000));
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setElapsedTime(0);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isWriting, sessionStartTime]);

  // 格式化时间
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 确保用户资料存在（如果不存在则创建）
  const ensureUserProfile = () => {
    if (!currentUser && character) {
      const newProfile = {
        id: character.id,
        characterName: character.name,
        displayName: character.name,
        avatar: '',
        bio: '',
        level: character.level,
        class: character.class,
        totalLikes: 0,
        totalWorks: 0,
        totalWords: character.totalWords,
        followers: [],
        following: [],
        joinedAt: character.createdAt,
      };
      createProfile(newProfile);
    }
  };

  // 处理内容变化
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    onWordCountChange?.(wordCount);
  };

  // 开始写作
  const handleStartWriting = () => {
    if (!character) return;
    startWritingSession();
    setSessionStartWordCount(wordCount);
    createDocument();
    textareaRef.current?.focus();
  };

  // 结束写作
  const handleEndWriting = () => {
    if (!character) return;

    const wordsWritten = Math.max(0, wordCount - sessionStartWordCount);
    const writingTime = Math.floor(elapsedTime / 60);

    // 获取技能效果
    const skillEffects = getSkillEffects();

    // 计算经验值（应用技能加成）
    const expGained = calculateWritingExp(
      wordsWritten,
      elapsedTime,
      character.class,
      {
        expBoost: skillEffects.expBoost,
        wordBonus: skillEffects.wordBonus,
        focusTime: skillEffects.focusTime,
      }
    );

    // 结束会话
    endWritingSession(content, wordCount, expGained);

    // 更新角色数据
    if (wordsWritten > 0) {
      addWords(wordsWritten);
    }
    if (writingTime > 0) {
      addWritingTime(writingTime);
    }
    if (expGained > 0) {
      addExp(expGained);
      // 检查升级
      setTimeout(() => {
        const leveledUp = checkAndLevelUp();
        if (leveledUp) {
          setShowLevelUp(true);
          setTimeout(() => setShowLevelUp(false), 3000);
        }
      }, 100);
    }

    // 更新连续天数
    if (wordsWritten > 0) {
      updateStreak();
    }

    // 记录历史
    if (wordsWritten > 0) {
      addWritingHistory(wordsWritten, writingTime);
    }

    // 保存文档
    if (activeDocumentId) {
      saveDocument(activeDocumentId, `写作会话 ${new Date().toLocaleString()}`);
    }
  };

  // 清空内容
  const handleClear = () => {
    if (confirm('确定要清空当前内容吗？')) {
      clearContent();
      textareaRef.current?.focus();
    }
  };

  // 发布作品
  const handlePublish = () => {
    ensureUserProfile();
    setShowPublishModal(true);
  };

  // 保存草稿
  const handleSaveDraft = () => {
    ensureUserProfile();
    
    const draft: DraftWork = {
      id: Math.random().toString(36).substring(2, 9),
      title: '',
      description: '',
      content,
      tags: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    createDraft(draft);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  // 编辑草稿
  const handleEditDraft = (draft: DraftWork) => {
    setContent(draft.content);
    setShowDraftBox(false);
  };

  // 获取技能效果显示
  const skillEffects = getSkillEffects();
  const hasSkillBonus = skillEffects.expBoost > 0 || skillEffects.wordBonus > 0 || skillEffects.coinBoost > 0;

  return (
    <PixelPanel
      title="写作编辑器"
      titleIcon={<FileText className="text-pixel-primary" />}
      className="h-full relative"
    >
      {/* 升级提示 */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -50 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-pixel-accent text-pixel-border px-6 py-3 rounded-lg border-2 border-pixel-border shadow-pixel font-pixel"
          >
            <div className="flex items-center gap-2">
              <Sparkles size={20} />
              <span>升级了! 等级 {character?.level}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 保存成功提示 */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -50 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-pixel-primary text-white px-6 py-3 rounded-lg border-2 border-pixel-border shadow-pixel font-pixel"
          >
            <div className="flex items-center gap-2">
              <Save size={20} />
              <span>草稿保存成功！</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col h-full">
        {/* 工具栏 */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-pixel-border">
          <div className="flex items-center gap-4">
            {/* 字数统计 */}
            <div className="flex items-center gap-2 text-sm">
              <FileText size={16} className="text-pixel-secondary" />
              <span className="font-mono text-gray-400">
                字数: <span className="text-white font-pixel">{wordCount}</span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-mono text-gray-400">
                字符: <span className="text-white">{charCount}</span>
              </span>
            </div>
            {isDirty && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-pixel-accent font-mono"
              >
                未保存
              </motion.span>
            )}
            {/* 技能加成提示 */}
            {hasSkillBonus && isWriting && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-pixel-magic font-mono flex items-center gap-1"
              >
                <Sparkles size={12} />
                技能加成激活
              </motion.span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isWriting && (
              <div className="flex items-center gap-2 mr-4">
                <Clock size={16} className="text-pixel-accent animate-pulse" />
                <span className="font-pixel text-pixel-accent">
                  {formatTime(elapsedTime)}
                </span>
              </div>
            )}

            {/* 发布和草稿按钮 */}
            <PixelButton
              variant="secondary"
              size="sm"
              onClick={handleSaveDraft}
              disabled={!content || !character}
            >
              <span className="flex items-center gap-1">
                <Save size={14} />
                保存草稿
              </span>
            </PixelButton>

            <PixelButton
              variant="secondary"
              size="sm"
              onClick={() => setShowDraftBox(true)}
              disabled={!character}
            >
              <span className="flex items-center gap-1">
                <FolderOpen size={14} />
                草稿箱
              </span>
            </PixelButton>

            <PixelButton
              variant="primary"
              size="sm"
              onClick={handlePublish}
              disabled={!content || !character}
            >
              <span className="flex items-center gap-1">
                <Upload size={14} />
                发布
              </span>
            </PixelButton>

            {!isWriting ? (
              <PixelButton
                variant="primary"
                size="sm"
                onClick={handleStartWriting}
                disabled={!character}
              >
                <span className="flex items-center gap-2">
                  <Play size={16} />
                  开始写作
                </span>
              </PixelButton>
            ) : (
              <PixelButton
                variant="danger"
                size="sm"
                onClick={handleEndWriting}
              >
                <span className="flex items-center gap-2">
                  <Square size={16} />
                  结束写作
                </span>
              </PixelButton>
            )}

            <PixelButton
              variant="secondary"
              size="sm"
              onClick={handleClear}
              disabled={!content}
            >
              <Trash2 size={16} />
            </PixelButton>
          </div>
        </div>

        {/* 编辑器 */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleContentChange}
            placeholder={
              character
                ? isWriting
                  ? '开始你的创作吧...'
                  : '点击"开始写作"按钮开始你的写作冒险'
                : '请先创建角色'
            }
            disabled={!character || !isWriting}
            className={`
              w-full h-full min-h-[300px]
              bg-pixel-bg
              border-2 border-pixel-border
              p-4
              text-white
              font-mono
              text-base
              leading-relaxed
              resize-none
              focus:outline-none
              focus:border-pixel-primary
              transition-colors
              placeholder-gray-600
              ${!character || !isWriting ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          />

          {/* 遮罩层 - 未开始写作时显示 */}
          <AnimatePresence>
            {(!isWriting || !character) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-pixel-bg/80 backdrop-blur-sm"
              >
                <div className="text-center">
                  {!character ? (
                    <>
                      <p className="font-pixel text-lg text-gray-400 mb-2">
                        请先创建角色
                      </p>
                      <p className="text-sm text-gray-500 font-mono">
                        角色将记录你的写作成长
                      </p>
                    </>
                  ) : (
                    <>
                      <Play size={48} className="mx-auto mb-4 text-pixel-primary" />
                      <p className="font-pixel text-lg text-gray-400 mb-2">
                        准备好开始写作了吗？
                      </p>
                      <p className="text-sm text-gray-500 font-mono">
                        点击"开始写作"按钮开始记录
                      </p>
                      {hasSkillBonus && (
                        <p className="text-xs text-pixel-magic font-mono mt-2">
                          技能加成已激活
                        </p>
                      )}
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 底部提示 */}
        {isWriting && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 pt-4 border-t-2 border-pixel-border"
          >
            <p className="text-xs text-gray-500 font-mono text-center">
              写作中... 每写一个字都能获得经验值！
              {skillEffects.expBoost > 0 && (
                <span className="text-pixel-magic ml-2">
                  (+{(skillEffects.expBoost * 100).toFixed(0)}% 技能加成)
                </span>
              )}
            </p>
          </motion.div>
        )}
      </div>

      {/* 发布模态框 */}
      <PublishModal
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        initialContent={content}
        initialWordCount={wordCount}
      />

      {/* 草稿箱 */}
      <DraftBox
        isOpen={showDraftBox}
        onClose={() => setShowDraftBox(false)}
        drafts={draftWorks}
        onEditDraft={handleEditDraft}
        onDeleteDraft={deleteDraft}
      />
    </PixelPanel>
  );
};
