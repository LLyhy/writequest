import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, LogIn, UserPlus } from 'lucide-react';
import { PixelPanel, PixelButton, PixelInput } from '../ui';
import { supabaseService } from '../../services/supabaseService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type AuthMode = 'login' | 'signup';

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (authMode === 'login') {
        const { error } = await supabaseService.auth.signIn(email, password);
        if (error) throw error;
      } else {
        const { error } = await supabaseService.auth.signUp(email, password, username);
        if (error) throw error;
      }
      
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError(err.message || '操作失败');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <PixelPanel className="relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-pixel-border/20 rounded transition-colors z-10"
              >
                <X size={20} className="text-gray-400 hover:text-white" />
              </button>

              <div className="p-6">
                <div className="flex items-center justify-center gap-2 mb-6">
                  {authMode === 'login' ? (
                    <LogIn size={24} className="text-pixel-primary" />
                  ) : (
                    <UserPlus size={24} className="text-pixel-primary" />
                  )}
                  <h2 className="font-pixel text-xl text-white">
                    {authMode === 'login' ? '登录' : '注册'}
                  </h2>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded text-red-400 text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {authMode === 'signup' && (
                    <PixelInput
                      icon={<User size={18} />}
                      placeholder="用户名"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  )}

                  <PixelInput
                    icon={<Mail size={18} />}
                    type="email"
                    placeholder="邮箱"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />

                  <PixelInput
                    icon={<Lock size={18} />}
                    type="password"
                    placeholder="密码"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                  <PixelButton
                    type="submit"
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? '加载中...' : (authMode === 'login' ? '登录' : '注册')}
                  </PixelButton>
                </form>

                <div className="mt-4 text-center">
                  <button
                    onClick={() => {
                      setAuthMode(authMode === 'login' ? 'signup' : 'login');
                      setError('');
                    }}
                    className="text-pixel-primary hover:text-pixel-accent transition-colors text-sm"
                  >
                    {authMode === 'login' ? (
                      '还没有账号？立即注册'
                    ) : (
                      '已有账号？立即登录'
                    )}
                  </button>
                </div>
              </div>
            </PixelPanel>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
