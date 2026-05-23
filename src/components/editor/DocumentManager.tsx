import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FolderOpen } from 'lucide-react';
import { PixelPanel } from '../ui/PixelPanel';
import { PixelButton } from '../ui/PixelButton';
import { DocumentList } from './DocumentList';
import { useEditorStore } from '../../stores';

interface DocumentManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentManager: React.FC<DocumentManagerProps> = ({ isOpen, onClose }) => {
  const { loadDocument, activeDocumentId } = useEditorStore();

  const handleSelectDocument = (id: string) => {
    loadDocument(id);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* 主内容面板 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="absolute inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[900px] md:h-[70vh]"
          >
            <PixelPanel className="w-full h-full flex flex-col">
              {/* 头部 */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-pixel-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pixel-primary border-2 border-pixel-border flex items-center justify-center">
                    <FolderOpen size={20} className="text-pixel-border" />
                  </div>
                  <div>
                    <h2 className="font-pixel text-white text-lg">文档管理器</h2>
                    <p className="text-xs text-gray-500 font-mono">管理你的所有写作文档</p>
                  </div>
                </div>
                <PixelButton variant="secondary" size="sm" onClick={onClose}>
                  <X size={18} />
                </PixelButton>
              </div>

              {/* 内容区域 */}
              <div className="flex-1 overflow-hidden">
                <DocumentList onSelectDocument={handleSelectDocument} />
              </div>

              {/* 底部 */}
              <div className="mt-4 pt-4 border-t-2 border-pixel-border flex items-center justify-between">
                <p className="text-xs text-gray-500 font-mono">
                  提示：选择文档后会自动加载到编辑器
                </p>
                <PixelButton variant="secondary" size="sm" onClick={onClose}>
                  关闭
                </PixelButton>
              </div>
            </PixelPanel>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
