import React from 'react';
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link,
  Quote,
  Code,
  Eye,
  Type,
  Columns,
} from 'lucide-react';
import { PixelButton } from '../ui/PixelButton';

export type ViewMode = 'editor' | 'preview' | 'split';

interface MarkdownToolbarProps {
  onInsert: (text: string, wrapWith?: [string, string], moveCursor?: number) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export const MarkdownToolbar: React.FC<MarkdownToolbarProps> = ({
  onInsert,
  viewMode,
  onViewModeChange,
}) => {
  const buttons = [
    {
      icon: Bold,
      label: '加粗',
      onClick: () => onInsert('', ['**', '**'], -2),
    },
    {
      icon: Italic,
      label: '斜体',
      onClick: () => onInsert('', ['*', '*'], -1),
    },
    {
      icon: Heading1,
      label: '标题1',
      onClick: () => onInsert('# '),
    },
    {
      icon: Heading2,
      label: '标题2',
      onClick: () => onInsert('## '),
    },
    {
      icon: Heading3,
      label: '标题3',
      onClick: () => onInsert('### '),
    },
    {
      icon: List,
      label: '无序列表',
      onClick: () => onInsert('- '),
    },
    {
      icon: ListOrdered,
      label: '有序列表',
      onClick: () => onInsert('1. '),
    },
    {
      icon: Quote,
      label: '引用',
      onClick: () => onInsert('> '),
    },
    {
      icon: Code,
      label: '代码',
      onClick: () => onInsert('', ['`', '`'], -1),
    },
    {
      icon: Link,
      label: '链接',
      onClick: () => onInsert('', ['[', '](url)'], -6),
    },
  ];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* 格式按钮 */}
      <div className="flex items-center gap-1 pr-3 border-r-2 border-pixel-border">
        {buttons.map((button, index) => (
          <PixelButton
            key={index}
            variant="secondary"
            size="sm"
            onClick={button.onClick}
            title={button.label}
            className="p-2"
          >
            <button.icon size={16} />
          </PixelButton>
        ))}
      </div>

      {/* 视图模式切换 */}
      <div className="flex items-center gap-1">
        <PixelButton
          variant={viewMode === 'editor' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => onViewModeChange('editor')}
          title="仅编辑器"
          className="p-2"
        >
          <Type size={16} />
        </PixelButton>
        <PixelButton
          variant={viewMode === 'split' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => onViewModeChange('split')}
          title="分屏"
          className="p-2"
        >
          <Columns size={16} />
        </PixelButton>
        <PixelButton
          variant={viewMode === 'preview' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => onViewModeChange('preview')}
          title="仅预览"
          className="p-2"
        >
          <Eye size={16} />
        </PixelButton>
      </div>
    </div>
  );
};
