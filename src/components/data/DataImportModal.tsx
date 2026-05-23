import { useState, useRef } from 'react';
import { useDataExportStore } from '../../stores';
import { PixelPanel } from '../ui/PixelPanel';
import { PixelButton } from '../ui/PixelButton';
import { X, Upload, AlertCircle, CheckCircle2 } from 'lucide-react';

interface DataImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ImportStatus = 'idle' | 'importing' | 'success' | 'error';

export function DataImportModal({ isOpen, onClose }: DataImportModalProps) {
  const { importData } = useDataExportStore();
  const [status, setStatus] = useState<ImportStatus>('idle');
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus('importing');
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const result = importData(content);
        if (result.success) {
          setStatus('success');
        } else {
          setStatus('error');
          setError(result.error || '导入失败');
        }
      } catch (err) {
        setStatus('error');
        setError('文件解析失败');
      }
    };
    reader.readAsText(file);
  };

  const handleClose = () => {
    setStatus('idle');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <PixelPanel className="max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-pixel text-white">导入数据</h2>
          <PixelButton variant="secondary" size="sm" onClick={handleClose}>
            <X size={16} />
          </PixelButton>
        </div>

        {status === 'idle' && (
          <>
            <p className="text-gray-300 text-sm mb-4">
              选择要导入的备份文件（.json）
            </p>
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center mb-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Upload size={48} className="mx-auto text-gray-400 mb-4" />
              <PixelButton
                variant="primary"
                onClick={() => fileInputRef.current?.click()}
              >
                选择文件
              </PixelButton>
            </div>
            <p className="text-yellow-400 text-xs">
              ⚠️ 警告：导入将覆盖现有数据
            </p>
          </>
        )}

        {status === 'importing' && (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-2 border-pixel-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-white">正在导入...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center py-8">
            <CheckCircle2 size={48} className="mx-auto text-green-400 mb-4" />
            <p className="text-white mb-4">导入成功！</p>
            <PixelButton variant="primary" onClick={handleClose}>
              关闭
            </PixelButton>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center py-8">
            <AlertCircle size={48} className="mx-auto text-red-400 mb-4" />
            <p className="text-red-400 mb-2">导入失败</p>
            <p className="text-gray-400 text-sm mb-4">{error}</p>
            <div className="flex gap-3">
              <PixelButton variant="secondary" onClick={handleClose} className="flex-1">
                关闭
              </PixelButton>
              <PixelButton
                variant="primary"
                onClick={() => setStatus('idle')}
                className="flex-1"
              >
                重试
              </PixelButton>
            </div>
          </div>
        )}
      </PixelPanel>
    </div>
  );
}
