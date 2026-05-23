import React, { useRef, useState } from 'react';
import { MarkdownToolbar, ViewMode } from './MarkdownToolbar';
import { MarkdownPreview } from './MarkdownPreview';
import { PixelPanel } from '../ui/PixelPanel';
import { FileText } from 'lucide-react';

interface MarkdownEditorProps {
  content: string;
  onChange: (content: string) => void;
  className?: string;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  content,
  onChange,
  className = '',
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('split');

  const handleInsert = (
    text: string,
    wrapWith?: [string, string],
    moveCursor: number = 0
  ) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    let newText = '';
    let newCursorPos = start;

    if (wrapWith) {
      newText =
        content.substring(0, start) +
        wrapWith[0] +
        selectedText +
        wrapWith[1] +
        content.substring(end);
      newCursorPos = end + wrapWith[0].length + (selectedText.length || 0) + moveCursor;
    } else {
      newText =
        content.substring(0, start) + text + content.substring(end);
      newCursorPos = start + text.length;
    }

    onChange(newText);

    // 聚焦并设置光标位置
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const renderEditor = () => (
    <textarea
      ref={textareaRef}
      value={content}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-full bg-pixel-bg border-2 border-pixel-border p-4 text-white font-mono text-base leading-relaxed resize-none focus:outline-none focus:border-pixel-primary transition-colors placeholder-gray-600"
      placeholder="在这里输入 Markdown 内容...

# 标题
## 副标题

**加粗** 和 *斜体*

- 列表项
- 列表项

> 引用文本"
    />
  );

  return (
    <PixelPanel
      title="Markdown 编辑器"
      titleIcon={<FileText className="text-pixel-primary" />}
      className={`h-full flex flex-col ${className}`}
    >
      {/* 工具栏 */}
      <div className="mb-4 pb-4 border-b-2 border-pixel-border">
        <MarkdownToolbar
          onInsert={handleInsert}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-hidden">
        {viewMode === 'editor' && (
          <div className="h-full">{renderEditor()}</div>
        )}

        {viewMode === 'preview' && (
          <div className="h-full overflow-hidden">
            <MarkdownPreview content={content} />
          </div>
        )}

        {viewMode === 'split' && (
          <div className="flex h-full gap-4">
            <div className="flex-1 overflow-hidden">{renderEditor()}</div>
            <div className="w-0.5 bg-pixel-border" />
            <div className="flex-1 overflow-hidden">
              <MarkdownPreview content={content} />
            </div>
          </div>
        )}
      </div>
    </PixelPanel>
  );
};
