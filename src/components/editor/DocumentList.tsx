import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DocumentItem } from './DocumentItem';
import { FileText, Search, Plus, FolderOpen } from 'lucide-react';
import { PixelInput } from '../ui/PixelInput';
import { PixelButton } from '../ui/PixelButton';
import { useEditorStore } from '../../stores';

interface DocumentListProps {
  onSelectDocument: (id: string) => void;
}

export interface DocumentData {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
}

export const DocumentList: React.FC<DocumentListProps> = ({ onSelectDocument }) => {
  const { 
    documents, 
    activeDocumentId, 
    deleteDocument,
    createDocument,
  } = useEditorStore();
  
  const [searchQuery, setSearchQuery] = React.useState('');

  const documentList: DocumentData[] = Object.entries(documents).map(([id, doc]) => ({
    id,
    title: doc.title,
    content: doc.content,
    updatedAt: doc.updatedAt,
  })).sort((a, b) => b.updatedAt - a.updatedAt);

  const filteredDocuments = documentList.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const calculateWordCount = (content: string): number => {
    const chineseChars = (content.match(/[\u4e00-\u9fa5]/g) || []).length;
    const englishWords = content
      .replace(/[\u4e00-\u9fa5]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 0).length;
    return chineseChars + englishWords;
  };

  const handleCreateDocument = () => {
    const id = createDocument('未命名文档');
    onSelectDocument(id);
  };

  const handleRename = (id: string, newTitle: string) => {
    useEditorStore.getState().saveDocument(id, newTitle);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 pb-4 border-b-2 border-pixel-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-pixel text-white flex items-center gap-2">
            <FolderOpen size={18} />
            我的文档
          </h3>
          <PixelButton
            variant="primary"
            size="sm"
            onClick={handleCreateDocument}
          >
            <Plus size={14} className="mr-1" />
            新建
          </PixelButton>
        </div>

        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <PixelInput
            type="text"
            placeholder="搜索文档..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <AnimatePresence>
          {filteredDocuments.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <FileText size={48} className="mx-auto mb-4 text-gray-600" />
              <p className="text-gray-500 font-mono text-sm mb-2">
                {searchQuery ? '没有找到匹配的文档' : '还没有文档'}
              </p>
              {!searchQuery && (
                <p className="text-gray-600 text-xs">
                  点击"新建"按钮创建你的第一篇文档
                </p>
              )}
            </motion.div>
          ) : (
            filteredDocuments.map((doc) => (
              <DocumentItem
                key={doc.id}
                id={doc.id}
                title={doc.title}
                content={doc.content}
                updatedAt={doc.updatedAt}
                wordCount={calculateWordCount(doc.content)}
                isActive={doc.id === activeDocumentId}
                onSelect={onSelectDocument}
                onDelete={deleteDocument}
                onRename={handleRename}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 pt-4 border-t-2 border-pixel-border">
        <p className="text-xs text-gray-500 font-mono">
          共 {documentList.length} 篇文档
        </p>
      </div>
    </div>
  );
};
