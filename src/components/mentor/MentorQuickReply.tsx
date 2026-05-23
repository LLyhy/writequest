import React from 'react';
import { PixelButton } from '../ui/PixelButton';

interface MentorQuickReplyProps {
  onSelect: (text: string) => void;
}

const QUICK_REPLIES = [
  "帮我想想接下来怎么写？",
  "这段写得怎么样？",
  "卡住了，给点灵感！",
  "今天写多少字合适？",
];

export const MentorQuickReply: React.FC<MentorQuickReplyProps> = ({ onSelect }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {QUICK_REPLIES.map((text, index) => (
        <PixelButton
          key={index}
          variant="secondary"
          size="sm"
          onClick={() => onSelect(text)}
          className="text-xs"
        >
          {text}
        </PixelButton>
      ))}
    </div>
  );
};
