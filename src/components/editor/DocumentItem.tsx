import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Trash2, Edit2, Calendar, Clock, ChevronRight } from 'lucide-react';
import { PixelButton } from '../ui/PixelButton';
import { useEditorStore } from '../../stores';

interface DocumentItemProps {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
  wordCount: number;
  isActive: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, newTitle: string) => void;
}

export const DocumentItem: React.FC<DocumentItemProps> = ({
  id,
  title,
  content,
  updatedAt,
  wordCount,
  isActive,
  onSelect,
  onDelete,
  onRename,
}) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isRenaming]);

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim()) {
      onRename(id, newTitle.trim());
    }
    setIsRenaming(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`确定要删除文档"${title}"吗？`)) {
      onDelete(id);
    }
  };

  const handleRenameClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRenaming(true);
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return '昨天';
    } else if (days < 7) {
      return `${days} 天前`;
    } else {
      return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
    }
  };

  const getPreview = (): string => {
    const preview = content.slice(0, 50);
    return content.length > 50 ? preview + '...' : preview;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.02 }}
      onClick={() => !isRenaming && onSelect(id)}
      className={`
        p-4 mb-2 rounded-lg cursor-pointer transition-all
        ${isActive 
          ? 'bg-pixel-primary/20 border-2 border-pixel-primary' 
          : 'bg-pixel-panel border-2 border-pixel-border hover:border-pixel-secondary'
        }
      `}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <FileText 
            size={20} 
            className={isActive ? 'text-pixel-primary' : 'text-gray-400'} 
          />
          <div className="flex-1 min-w-0">
            {isRenaming ? (
              <form onSubmit={handleRenameSubmit} className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onBlur={() => setIsRenaming(false)}
                  onKeyDown={(e) => e.key === 'Escape' && setIsRenaming(false)}
                  className="flex-1 bg-pixel-bg border-2 border-pixel-border px-2 py-1 text-white text-sm font-mono focus:outline-none focus:border-pixel-primary"
                />
              </form>
            ) : (
              <h3 className={`font-pixel text-sm truncate ${isActive ? 'text-pixel-primary' : 'text-white'}`}>
                {title}
              </h3>
            )}
            {content && !isRenaming && (
              <p className="text-xs text-gray-500 mt-1 truncate">
                {getPreview()}
              </p>
            )}
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <FileText size={12} />
                {wordCount} 字
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {formatDate(updatedAt)}
              </span>
            </div>
          </div>
        </div>

        {!isRenaming && (
          <div className="flex items-center gap-1">
            <PixelButton
              variant="secondary"
              size="sm"
              onClick={handleRenameClick}
              className="p-1"
              title="重命名"
            >
              <Edit2 size={14} />
            </PixelButton>
            <PixelButton
              variant="danger"
              size="sm"
              onClick={handleDelete}
              className="p-1"
              title="删除"
            >
              <Trash2 size={14} />
            </PixelButton>
            {isActive && <ChevronRight size={16} className="text-pixel-primary" />}
          </div>
        )}
      </div>
    </motion.div>
  );
};
