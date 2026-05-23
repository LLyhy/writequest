import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Coins, Zap, Trash2 } from 'lucide-react';
import { MentorAvatar } from './MentorAvatar';
import { MentorQuickReply } from './MentorQuickReply';
import { useMentorStore } from '../../stores';
import { PixelButton } from '../ui/PixelButton';
import { PixelPanel } from '../ui/PixelPanel';
import { useGameStore } from '../../stores';

interface MentorChatProps {
  className?: string;
}

export const MentorChat: React.FC<MentorChatProps> = ({ className = '' }) => {
  const {
    messages,
    freeCallsLeft,
    addMessage,
    clearMessages,
    resetDailyFreeCalls,
    isOpen,
    setIsOpen,
  } = useMentorStore();
  const { coins, addCoins, spendCoins } = useGameStore();
  
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 每日重置免费次数
  useEffect(() => {
    resetDailyFreeCalls();
  }, [resetDailyFreeCalls]);

  // 滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (text: string = inputText) => {
    const trimmedText = text.trim();
    if (!trimmedText) return;

    // 检查是否需要消耗金币
    if (freeCallsLeft <= 0) {
      if (coins < 10) {
        addMessage('mentor', "年轻人，你的金币不够了！先去写点东西赚点金币吧~ 💰");
        return;
      }
      spendCoins(10);
    }

    addMessage('user', trimmedText);
    setInputText('');
    setIsTyping(true);

    // 模拟打字效果
    setTimeout(() => {
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickReply = (text: string) => {
    setInputText(text);
    handleSendMessage(text);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* 聊天窗口 */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="relative w-full max-w-lg sm:max-w-xl"
          >
            <PixelPanel className="max-h-[80vh] flex flex-col">
              {/* 头部 */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-pixel-border">
                <div className="flex items-center gap-3">
                  <MentorAvatar size="md" />
                  <div>
                    <h3 className="font-pixel text-white">玄机子老爷爷</h3>
                    <p className="text-xs text-gray-400 font-mono">
                      {freeCallsLeft > 0 ? (
                        <span className="text-pixel-accent">
                          <Zap size={12} className="inline mr-1" />
                          免费次数: {freeCallsLeft}
                        </span>
                      ) : (
                        <span className="text-pixel-secondary">
                          <Coins size={12} className="inline mr-1" />
                          10 金币/次
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <PixelButton
                    variant="secondary"
                    size="sm"
                    onClick={clearMessages}
                    title="清空对话"
                    className="p-2"
                  >
                    <Trash2 size={16} />
                  </PixelButton>
                  <PixelButton
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="p-2"
                  >
                    <X size={16} />
                  </PixelButton>
                </div>
              </div>

              {/* 消息区域 */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-4 max-h-96">
                {messages.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8"
                  >
                    <MentorAvatar size="lg" className="mx-auto mb-4" />
                    <p className="text-gray-300 font-mono text-sm">
                      年轻人，遇到什么问题了？尽管问老夫！
                    </p>
                    <div className="mt-4">
                      <MentorQuickReply onSelect={handleQuickReply} />
                    </div>
                  </motion.div>
                )}

                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, x: message.role === 'user' ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex gap-3 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.role === 'mentor' && <MentorAvatar size="sm" />}
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-pixel-primary text-white'
                          : 'bg-pixel-panel border-2 border-pixel-border text-gray-200'
                      }`}
                    >
                      <p className="font-mono text-sm">{message.content}</p>
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3"
                  >
                    <MentorAvatar size="sm" />
                    <div className="bg-pixel-panel border-2 border-pixel-border p-3 rounded-lg">
                      <div className="flex gap-1">
                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity }}
                          className="w-2 h-2 bg-pixel-accent rounded-full"
                        />
                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                          className="w-2 h-2 bg-pixel-accent rounded-full"
                        />
                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                          className="w-2 h-2 bg-pixel-accent rounded-full"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* 输入区域 */}
              <div className="space-y-3">
                {messages.length > 0 && (
                  <MentorQuickReply onSelect={handleQuickReply} />
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="说点什么..."
                    className="flex-1 bg-pixel-bg border-2 border-pixel-border px-4 py-2 text-white font-mono focus:outline-none focus:border-pixel-primary rounded"
                  />
                  <PixelButton
                    variant="primary"
                    onClick={() => handleSendMessage()}
                    disabled={!inputText.trim()}
                  >
                    <Send size={16} />
                  </PixelButton>
                </div>
              </div>
            </PixelPanel>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
