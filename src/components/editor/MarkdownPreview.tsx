import React from 'react';
import { FileText } from 'lucide-react';

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

export const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ content, className = '' }) => {
  if (!content.trim()) {
    return (
      <div className="h-full flex items-center justify-center text-gray-600">
        <div className="text-center">
          <FileText size={48} className="mx-auto mb-4 opacity-50" />
          <p className="font-mono text-sm">预览区域</p>
          <p className="text-xs mt-1">在左侧输入 Markdown 内容</p>
        </div>
      </div>
    );
  }

  // 简单的 Markdown 解析
  const renderContent = (text: string) => {
    let result = text
      // 标题
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-pixel text-white mb-2">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-pixel text-pixel-secondary mb-3">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-pixel text-pixel-primary mb-4 pb-2 border-b-2 border-pixel-border">$1</h1>')
      // 粗体和斜体
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="text-pixel-accent italic">$1</em>')
      // 列表
      .replace(/^- (.*$)/gm, '<li class="pl-2">$1</li>')
      .replace(/^\d+\. (.*$)/gm, '<li class="pl-2">$1</li>')
      // 引用
      .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-pixel-accent pl-4 py-1 my-4 bg-pixel-panel/50 text-gray-300 italic">$1</blockquote>')
      // 代码
      .replace(/`([^`]+)`/g, '<code class="bg-pixel-border px-2 py-1 rounded text-pixel-accent text-sm font-mono">$1</code>')
      // 段落
      .replace(/^(?!<[hlu]|<blockquote|<code)(.*)$/gm, '<p class="text-gray-300 mb-4 leading-relaxed font-mono">$1</p>');

    // 包装列表
    result = result
      .replace(/(<li.*<\/li>)+/g, '<ul class="list-disc list-inside text-gray-300 mb-4 space-y-1 font-mono">$&</ul>');

    return result;
  };

  return (
    <div className={`h-full overflow-y-auto p-6 text-white ${className}`}>
      <div className="prose prose-invert max-w-none">
        <div 
          dangerouslySetInnerHTML={{ __html: renderContent(content) }} 
        />
      </div>
    </div>
  );
};
