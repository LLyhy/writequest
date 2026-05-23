import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'framer-motion';
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`h-full overflow-y-auto p-6 text-white ${className}`}
    >
      <div className="prose prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ ...props }) => (
              <h1
                className="text-3xl font-pixel text-pixel-primary mb-4 pb-2 border-b-2 border-pixel-border"
                {...props}
              />
            ),
            h2: ({ ...props }) => (
              <h2
                className="text-2xl font-pixel text-pixel-secondary mb-3"
                {...props}
              />
            ),
            h3: ({ ...props }) => (
              <h3
                className="text-xl font-pixel text-white mb-2"
                {...props}
              />
            ),
            p: ({ ...props }) => (
              <p
                className="text-gray-300 mb-4 leading-relaxed font-mono"
                {...props}
              />
            ),
            ul: ({ ...props }) => (
              <ul
                className="list-disc list-inside text-gray-300 mb-4 space-y-1 font-mono"
                {...props}
              />
            ),
            ol: ({ ...props }) => (
              <ol
                className="list-decimal list-inside text-gray-300 mb-4 space-y-1 font-mono"
                {...props}
              />
            ),
            li: ({ ...props }) => (
              <li className="pl-2" {...props} />
            ),
            blockquote: ({ ...props }) => (
              <blockquote
                className="border-l-4 border-pixel-accent pl-4 py-1 my-4 bg-pixel-panel/50 text-gray-300 italic"
                {...props}
              />
            ),
            code: ({ inline, className, children, ...props }) => {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <div className="my-4 rounded-lg overflow-hidden">
                  <div className="bg-pixel-border px-4 py-2 text-xs text-gray-400 font-mono">
                    {match[1]}
                  </div>
                  <pre className="bg-pixel-bg p-4 overflow-x-auto">
                    <code className={className} {...props}>
                      {children}
                    </code>
                  </pre>
                </div>
              ) : (
                <code
                  className="bg-pixel-border px-2 py-1 rounded text-pixel-accent text-sm font-mono"
                  {...props}
                >
                  {children}
                </code>
              );
            },
            a: ({ ...props }) => (
              <a
                className="text-pixel-primary hover:text-pixel-secondary underline transition-colors"
                target="_blank"
                rel="noopener noreferrer"
                {...props}
              />
            ),
            table: ({ ...props }) => (
              <div className="my-4 overflow-x-auto">
                <table
                  className="w-full border-collapse border-2 border-pixel-border"
                  {...props}
                />
              </div>
            ),
            thead: ({ ...props }) => (
              <thead className="bg-pixel-panel" {...props} />
            ),
            th: ({ ...props }) => (
              <th
                className="border-2 border-pixel-border px-4 py-2 text-pixel-primary font-pixel"
                {...props}
              />
            ),
            td: ({ ...props }) => (
              <td
                className="border-2 border-pixel-border px-4 py-2 text-gray-300"
                {...props}
              />
            ),
            strong: ({ ...props }) => (
              <strong className="text-white font-bold" {...props} />
            ),
            em: ({ ...props }) => (
              <em className="text-pixel-accent italic" {...props} />
            ),
            hr: ({ ...props }) => (
              <hr
                className="my-8 border-pixel-border"
                {...props}
              />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </motion.div>
  );
};
