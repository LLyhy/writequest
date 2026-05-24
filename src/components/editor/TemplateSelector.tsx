import React, { useState } from 'react';
import { X } from 'lucide-react';
import { WRITING_TEMPLATES, TEMPLATE_CATEGORIES, WritingTemplate } from '../../constants/writingTemplates';

interface TemplateSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (content: string) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ isOpen, onClose, onSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [previewTemplate, setPreviewTemplate] = useState<WritingTemplate | null>(null);

  if (!isOpen) return null;

  const filteredTemplates = selectedCategory === 'all' 
    ? WRITING_TEMPLATES 
    : WRITING_TEMPLATES.filter(t => t.category === selectedCategory);

  const handleSelect = (template: WritingTemplate) => {
    onSelect(template.content);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">📝 写作模板库</h2>
            <p className="text-gray-500 mt-1">选择一个模板开始你的创作之旅</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Categories */}
        <div className="p-4 border-b border-gray-100 flex gap-2 overflow-x-auto">
          {TEMPLATE_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                selectedCategory === cat.id 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Template Grid */}
          <div className="w-1/2 p-4 overflow-y-auto border-r border-gray-100">
            <div className="grid gap-3">
              {filteredTemplates.map(template => (
                <div 
                  key={template.id}
                  onClick={() => setPreviewTemplate(template)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    previewTemplate?.id === template.id 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{template.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800">{template.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="w-1/2 p-4 overflow-y-auto flex flex-col">
            {previewTemplate ? (
              <>
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{previewTemplate.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{previewTemplate.name}</h3>
                      <p className="text-gray-500">{previewTemplate.description}</p>
                    </div>
                  </div>
                </div>
                <div className="flex-1 bg-gray-50 rounded-xl p-4 overflow-y-auto mb-4">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans leading-relaxed">
                    {previewTemplate.content}
                  </pre>
                </div>
                <button
                  onClick={() => handleSelect(previewTemplate)}
                  className="w-full py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors"
                >
                  ✨ 使用此模板
                </button>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <p className="text-4xl mb-3">👈</p>
                  <p>选择一个模板预览</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
