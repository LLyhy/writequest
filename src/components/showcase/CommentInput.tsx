import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { PixelButton, PixelInput } from '../ui';

interface CommentInputProps {
  placeholder?: string;
  onSubmit: (content: string) => void;
  isLoading?: boolean;
  autoFocus?: boolean;
  onCancel?: () => void;
}

export const CommentInput: React.FC<CommentInputProps> = ({
  placeholder = '写下你的评论...',
  onSubmit,
  isLoading = false,
  autoFocus = false,
  onCancel,
}) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content.trim());
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex gap-3">
        <PixelInput
          placeholder={placeholder}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1"
          autoFocus={autoFocus}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <PixelButton
          type="submit"
          variant="primary"
          disabled={!content.trim() || isLoading}
          isLoading={isLoading}
          className="flex items-center gap-2"
        >
          <Send size={16} />
          发送
        </PixelButton>
      </div>
      {onCancel && (
        <div className="flex justify-end">
          <PixelButton
            type="button"
            variant="secondary"
            size="sm"
            onClick={onCancel}
          >
            取消
          </PixelButton>
        </div>
      )}
    </form>
  );
};
