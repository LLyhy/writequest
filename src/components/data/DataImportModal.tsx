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
    &lt;div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"&gt;
      &lt;PixelPanel className="max-w-md w-full"&gt;
        &lt;div className="flex items-center justify-between mb-4"&gt;
          &lt;h2 className="text-xl font-pixel text-white"&gt;导入数据&lt;/h2&gt;
          &lt;PixelButton variant="secondary" size="sm" onClick={handleClose}&gt;
            &lt;X size={16} /&gt;
          &lt;/PixelButton&gt;
        &lt;/div&gt;

        {status === 'idle' &amp;&amp; (
          &lt;&gt;
            &lt;p className="text-gray-300 text-sm mb-4"&gt;
              选择要导入的备份文件（.json）
            &lt;/p&gt;
            &lt;div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center mb-4"&gt;
              &lt;input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileSelect}
                className="hidden"
              /&gt;
              &lt;Upload size={48} className="mx-auto text-gray-400 mb-4" /&gt;
              &lt;PixelButton
                variant="primary"
                onClick={() =&gt; fileInputRef.current?.click()}
              &gt;
                选择文件
              &lt;/PixelButton&gt;
            &lt;/div&gt;
            &lt;p className="text-yellow-400 text-xs"&gt;
              ⚠️ 警告：导入将覆盖现有数据
            &lt;/p&gt;
          &lt;/&gt;
        )}

        {status === 'importing' &amp;&amp; (
          &lt;div className="text-center py-8"&gt;
            &lt;div className="animate-spin w-8 h-8 border-2 border-pixel-primary border-t-transparent rounded-full mx-auto mb-4"&gt;&lt;/div&gt;
            &lt;p className="text-white"&gt;正在导入...&lt;/p&gt;
          &lt;/div&gt;
        )}

        {status === 'success' &amp;&amp; (
          &lt;div className="text-center py-8"&gt;
            &lt;CheckCircle2 size={48} className="mx-auto text-green-400 mb-4" /&gt;
            &lt;p className="text-white mb-4"&gt;导入成功！&lt;/p&gt;
            &lt;PixelButton variant="primary" onClick={handleClose}&gt;
              关闭
            &lt;/PixelButton&gt;
          &lt;/div&gt;
        )}

        {status === 'error' &amp;&amp; (
          &lt;div className="text-center py-8"&gt;
            &lt;AlertCircle size={48} className="mx-auto text-red-400 mb-4" /&gt;
            &lt;p className="text-red-400 mb-2"&gt;导入失败&lt;/p&gt;
            &lt;p className="text-gray-400 text-sm mb-4"&gt;{error}&lt;/p&gt;
            &lt;div className="flex gap-3"&gt;
              &lt;PixelButton variant="secondary" onClick={handleClose} className="flex-1"&gt;
                关闭
              &lt;/PixelButton&gt;
              &lt;PixelButton
                variant="primary"
                onClick={() =&gt; setStatus('idle')}
                className="flex-1"
              &gt;
                重试
              &lt;/PixelButton&gt;
            &lt;/div&gt;
          &lt;/div&gt;
        )}
      &lt;/PixelPanel&gt;
    &lt;/div&gt;
  );
}
