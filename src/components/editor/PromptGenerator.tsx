import React, { useState } from 'react';
import { X, RefreshCw, Sparkles } from 'lucide-react';
import { 
  generatePrompts, 
  GENRE_OPTIONS, 
  MOOD_OPTIONS, 
  FOCUS_OPTIONS, 
  type WritingPrompt 
} from '../../services/promptGenerator';

interface PromptGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (content: string) => void;
}

export const PromptGenerator: React.FC<PromptGeneratorProps> = ({ isOpen, onClose, onSelect }) => {
  const [selectedGenre, setSelectedGenre] = useState<string | undefined>();
  const [selectedMood, setSelectedMood] = useState<string | undefined>();
  const [selectedFocus, setSelectedFocus] = useState<string | undefined>();
  const [prompts, setPrompts] = useState<WritingPrompt[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = () => {
    const newPrompts = generatePrompts({
      genre: selectedGenre as any,
      mood: selectedMood as any,
      focus: selectedFocus as any
    });
    setPrompts(newPrompts);
    setHasGenerated(true);
  };

  const handleSelectPrompt = (prompt: WritingPrompt) => {
    const fullContent = `# ${prompt.title}\n\n${prompt.content}${prompt.tips ? `\n\n💡 写作建议：\n${prompt.tips}` : ''}`;
    onSelect(fullContent);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Sparkles className="text-purple-500" />
              灵感生成器
            </h2>
            <p className="text-gray-500 mt-1">选择你的偏好，获取写作灵感</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Options */}
        <div className="p-6 border-b border-gray-100 space-y-4">
          {/* Genre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">🎭 题材（可选）</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedGenre(undefined)}
                className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                  !selectedGenre 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                全部
              </button>
              {GENRE_OPTIONS.map(option => (
                <button
                  key={option.id}
                  onClick={() => setSelectedGenre(option.id)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-all flex items-center gap-1 ${
                    selectedGenre === option.id 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {option.icon} {option.name}
                </button>
              ))}
            </div>
          </div>

          {/* Mood */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">🎨 氛围（可选）</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedMood(undefined)}
                className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                  !selectedMood 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                任意
              </button>
              {MOOD_OPTIONS.map(option => (
                <button
                  key={option.id}
                  onClick={() => setSelectedMood(option.id)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-all flex items-center gap-1 ${
                    selectedMood === option.id 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {option.icon} {option.name}
                </button>
              ))}
            </div>
          </div>

          {/* Focus */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">✨ 重点（可选）</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedFocus(undefined)}
                className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                  !selectedFocus 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                综合
              </button>
              {FOCUS_OPTIONS.map(option => (
                <button
                  key={option.id}
                  onClick={() => setSelectedFocus(option.id)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-all flex items-center gap-1 ${
                    selectedFocus === option.id 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {option.icon} {option.name}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className={`w-5 h-5 ${hasGenerated ? 'animate-spin' : ''}`} />
            {hasGenerated ? '再来一组' : '获取灵感'}
          </button>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-6">
          {prompts.length > 0 ? (
            <div className="space-y-4">
              {prompts.map(prompt => (
                <div
                  key={prompt.id}
                  onClick={() => handleSelectPrompt(prompt)}
                  className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-100 hover:border-purple-300 hover:shadow-md cursor-pointer transition-all"
                >
                  <h3 className="font-bold text-gray-800 mb-2">{prompt.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{prompt.content}</p>
                  {prompt.tips && (
                    <p className="text-xs text-purple-600 italic border-t border-purple-100 pt-2 mt-2">
                      {prompt.tips}
                    </p>
                  )}
                  <div className="mt-2 text-xs text-purple-500 font-medium">
                    ✨ 点击使用这个灵感
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <p className="text-6xl mb-4">✨</p>
              <p>点击"获取灵感"按钮开始</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
